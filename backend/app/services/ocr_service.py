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
    Clean OCR output.
    """

    if not text:
        return ""

    text = text.replace("\r", "\n")

    # Remove excessive spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Remove excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)

    lines = []

    for line in text.split("\n"):
        line = line.strip()

        if line:
            lines.append(line)

    return "\n".join(lines).strip()


def extract_text_from_image(image: Image.Image) -> str:
    """
    Extract text from images using color-aware preprocessing.

    This works better for images containing:
    - white text on dark backgrounds
    - red text
    - textured backgrounds
    - posters/memes
    """

    # PIL -> OpenCV
    image = image.convert("RGB")
    img = np.array(image)

    # OpenCV uses RGB here because numpy image is RGB
    height, width = img.shape[:2]

    # ---------------------------------------------------------
    # 1. Resize
    # ---------------------------------------------------------

    if width < 1600:
        scale = 2

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

    # ---------------------------------------------------------
    # 2. Convert to HSV
    # ---------------------------------------------------------

    hsv = cv2.cvtColor(
        img,
        cv2.COLOR_RGB2HSV
    )

    r = img[:, :, 0]
    g = img[:, :, 1]
    b = img[:, :, 2]

    saturation = hsv[:, :, 1]
    value = hsv[:, :, 2]

    # ---------------------------------------------------------
    # 3. Detect WHITE text
    # ---------------------------------------------------------

    white_mask = (
        (value > 150) &
        (saturation < 90)
    )

    white_mask = (
        white_mask.astype(np.uint8) * 255
    )

    # ---------------------------------------------------------
    # 4. Detect RED text
    # ---------------------------------------------------------

    red_mask = (
        (r > 100) &
        (r > g * 1.4) &
        (r > b * 1.3) &
        (saturation > 70) &
        (value > 70)
    )

    red_mask = (
        red_mask.astype(np.uint8) * 255
    )

    # ---------------------------------------------------------
    # 5. Combine text masks
    # ---------------------------------------------------------

    text_mask = cv2.bitwise_or(
        white_mask,
        red_mask
    )

    # ---------------------------------------------------------
    # 6. Remove small background noise
    # ---------------------------------------------------------

    kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (5, 5)
    )

    text_mask = cv2.morphologyEx(
        text_mask,
        cv2.MORPH_CLOSE,
        kernel,
        iterations=2
    )

    small_kernel = np.ones(
        (3, 3),
        np.uint8
    )

    text_mask = cv2.morphologyEx(
        text_mask,
        cv2.MORPH_OPEN,
        small_kernel,
        iterations=1
    )

    # ---------------------------------------------------------
    # 7. OCR
    # ---------------------------------------------------------

    configs = [
        "--oem 3 --psm 6",
        "--oem 3 --psm 11",
        "--oem 3 --psm 12",
    ]

    results = []

    for config in configs:

        try:

            text = pytesseract.image_to_string(
                text_mask,
                config=config,
                lang="eng",
            )

            text = clean_ocr_text(text)

            if text:
                results.append(text)

        except Exception as e:
            print("OCR error:", e)

    if not results:
        return ""

    # Prefer the most readable result
    best_text = max(
        results,
        key=lambda x: len(x)
    )

    return best_text.strip()