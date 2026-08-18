from PIL import Image
import pytesseract
import cv2
import numpy as np
import re


# Tesseract installation path
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def clean_ocr_text(text: str) -> str:
    """
    Clean and normalize OCR output.
    """

    if not text:
        return ""

    text = text.replace("\r", "\n")

    # Remove excessive spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Remove spaces around newlines
    text = re.sub(r" *\n *", "\n", text)

    # Remove excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)

    lines = []

    for line in text.split("\n"):
        line = line.strip()

        if line:
            lines.append(line)

    return "\n".join(lines).strip()


def _resize_image(img: np.ndarray) -> np.ndarray:
    """
    Resize image to a reasonable OCR resolution.
    """

    height, width = img.shape[:2]

    if width < 1600:

        scale = 2.0

        img = cv2.resize(
            img,
            None,
            fx=scale,
            fy=scale,
            interpolation=cv2.INTER_CUBIC,
        )

    elif width > 3000:

        scale = 3000 / width

        img = cv2.resize(
            img,
            (
                int(width * scale),
                int(height * scale),
            ),
            interpolation=cv2.INTER_AREA,
        )

    return img


def _build_preprocessing_variants(img: np.ndarray):
    """
    Create multiple image variants so OCR is not dependent
    on one particular text color or background.
    """

    variants = []

    # ---------------------------------------------------------
    # 1. Grayscale
    # ---------------------------------------------------------

    gray = cv2.cvtColor(
        img,
        cv2.COLOR_RGB2GRAY,
    )

    variants.append(
        ("grayscale", gray)
    )

    # ---------------------------------------------------------
    # 2. Contrast enhancement using CLAHE
    # ---------------------------------------------------------

    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8),
    )

    enhanced = clahe.apply(gray)

    variants.append(
        ("clahe", enhanced)
    )

    # ---------------------------------------------------------
    # 3. Otsu threshold
    # ---------------------------------------------------------

    _, otsu = cv2.threshold(
        enhanced,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU,
    )

    variants.append(
        ("otsu", otsu)
    )

    # ---------------------------------------------------------
    # 4. Adaptive threshold
    # ---------------------------------------------------------

    adaptive = cv2.adaptiveThreshold(
        enhanced,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        11,
    )

    variants.append(
        ("adaptive", adaptive)
    )

    # ---------------------------------------------------------
    # 5. Inverted adaptive threshold
    # Useful for white text on dark backgrounds
    # ---------------------------------------------------------

    adaptive_inv = cv2.bitwise_not(adaptive)

    variants.append(
        ("adaptive_inverse", adaptive_inv)
    )

    # ---------------------------------------------------------
    # 6. Color-aware mask
    # Supports white and red text from the original pipeline
    # ---------------------------------------------------------

    hsv = cv2.cvtColor(
        img,
        cv2.COLOR_RGB2HSV,
    )

    r = img[:, :, 0].astype(np.int16)
    g = img[:, :, 1].astype(np.int16)
    b = img[:, :, 2].astype(np.int16)

    saturation = hsv[:, :, 1]
    value = hsv[:, :, 2]

    # White text
    white_mask = (
        (value > 150) &
        (saturation < 90)
    )

    # Red text
    red_mask = (
        (r > 100) &
        (r > g * 1.4) &
        (r > b * 1.3) &
        (saturation > 70) &
        (value > 70)
    )

    color_mask = (
        white_mask | red_mask
    ).astype(np.uint8) * 255

    variants.append(
        ("color_mask", color_mask)
    )

    return variants


def _run_ocr(image: np.ndarray, config: str):
    """
    Run Tesseract and return text + confidence.
    """

    try:

        data = pytesseract.image_to_data(
            image,
            config=config,
            lang="eng",
            output_type=pytesseract.Output.DICT,
        )

        words = []
        confidences = []

        for text, confidence in zip(
            data["text"],
            data["conf"],
        ):

            text = text.strip()

            try:
                confidence = float(confidence)
            except (ValueError, TypeError):
                confidence = -1

            if text and confidence >= 0:
                words.append(text)
                confidences.append(confidence)

        if not words:
            return "", 0.0

        text = " ".join(words)

        average_confidence = (
            sum(confidences) / len(confidences)
        )

        return (
            clean_ocr_text(text),
            average_confidence,
        )

    except Exception as e:

        print("OCR error:", e)

        return "", 0.0


def extract_text_from_image(image: Image.Image) -> str:
    """
    Extract text from an image using multiple preprocessing
    strategies and Tesseract OCR.

    Supports:
    - documents
    - screenshots
    - posters
    - memes
    - white text on dark backgrounds
    - colored text
    - uneven lighting
    - noisy backgrounds
    """

    # ---------------------------------------------------------
    # 1. PIL -> RGB NumPy
    # ---------------------------------------------------------

    image = image.convert("RGB")

    img = np.array(image)

    # ---------------------------------------------------------
    # 2. Resize
    # ---------------------------------------------------------

    img = _resize_image(img)

    # ---------------------------------------------------------
    # 3. Generate preprocessing variants
    # ---------------------------------------------------------

    variants = _build_preprocessing_variants(img)

    # ---------------------------------------------------------
    # 4. OCR configurations
    # ---------------------------------------------------------

    configs = [
        "--oem 3 --psm 6",
        "--oem 3 --psm 11",
        "--oem 3 --psm 12",
    ]

    candidates = []

    # ---------------------------------------------------------
    # 5. Run OCR
    # ---------------------------------------------------------

    for variant_name, processed_image in variants:

        for config in configs:

            text, confidence = _run_ocr(
                processed_image,
                config,
            )

            if not text:
                continue

            # -------------------------------------------------
            # Score candidate
            #
            # Confidence is more important than length.
            # Small bonus for useful text length.
            # -------------------------------------------------

            word_count = len(text.split())

            score = (
                confidence * 0.85
                + min(word_count, 50) * 0.3
            )

            candidates.append(
                {
                    "text": text,
                    "confidence": confidence,
                    "score": score,
                    "variant": variant_name,
                    "config": config,
                }
            )

    # ---------------------------------------------------------
    # 6. No OCR result
    # ---------------------------------------------------------

    if not candidates:
        return ""

    # ---------------------------------------------------------
    # 7. Select highest quality candidate
    # ---------------------------------------------------------

    best = max(
        candidates,
        key=lambda item: item["score"],
    )

    print(
        f"OCR selected: "
        f"variant={best['variant']}, "
        f"confidence={best['confidence']:.2f}, "
        f"score={best['score']:.2f}"
    )

    return best["text"].strip()