from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from PIL import Image
from io import BytesIO

from app.database.database import get_db
from app.dependencies.auth import get_current_user
from app.models.analysis import Analysis
from app.models.user import User
from app.services.ocr_service import extract_text_from_image
from app.services.toxicity_model import analyze_toxicity


router = APIRouter(
    prefix="/image-analysis",
    tags=["Image Analysis"],
)


@router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # Validate file type
    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be detected.",
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file.",
        )

    try:
        # Read image
        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty.",
            )

        print("\n================ IMAGE ANALYSIS ================")
        print("Filename:", file.filename)
        print("Content type:", file.content_type)
        print("File size:", len(contents), "bytes")

        # Open image
        image = Image.open(BytesIO(contents))

        print("Image size:", image.size)

        # OCR
        extracted_text = extract_text_from_image(image)

        print("\n========== OCR RESULT ==========")
        print(repr(extracted_text))
        print("================================")

        # No readable text
        if not extracted_text.strip():
            return {
                "filename": file.filename,
                "extracted_text": "",
                "prediction": "No Text",
                "confidence": 0,
                "message": "No readable text was detected.",
            }

        # Clean OCR text
        extracted_text = " ".join(
            extracted_text.split()
        ).strip()

        print("\n========== TEXT SENT TO MODEL ==========")
        print(repr(extracted_text))
        print("=========================================")

        # Toxicity model
        result = analyze_toxicity(extracted_text)

        print("\n========== MODEL RESULT ==========")
        print(result)
        print("==================================")

        # Save image analysis to database
        analysis = Analysis(
            user_id=current_user.id,
            text=extracted_text,
            prediction=result["prediction"],
            confidence=result["confidence"],
            source="image",
            filename=file.filename,
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        print("Saved analysis ID:", analysis.id)
        print("Source:", analysis.source)
        print("Filename:", analysis.filename)
        print("========================================\n")

        return {
            "id": analysis.id,
            "filename": file.filename,
            "extracted_text": extracted_text,
            "prediction": result["prediction"],
            "confidence": result["confidence"],
            "source": "image",
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()

        print("\nIMAGE ANALYSIS ERROR:")
        print(repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"Image analysis failed: {str(e)}",
        )