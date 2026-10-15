"""LunaHer Pattern Screening API endpoints.

Provides secure, validated endpoints for clinical parameter inference, ultrasound image
follicle estimation, and model transparency metadata.
"""
from __future__ import annotations

from typing import Dict
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from ..core.logging import logger
from ..schemas.screening import (
    ClinicalScreeningRequest,
    ClinicalScreeningResponse,
    ModelInfoResponse,
    UltrasoundScreeningResponse,
)
from ..services.screening_service import screening_service

router = APIRouter(
    prefix="/api/pcos-screening",
    tags=["LunaHer Pattern Screening"],
)


@router.get(
    "/health",
    summary="Check Screening Service Availability",
    response_model=Dict[str, str],
)
async def check_screening_health() -> Dict[str, str]:
    """Returns the operational status of the ML screening service and model readiness."""
    return {
        "status": "healthy" if screening_service.is_loaded else "degraded",
        "model_loaded": str(screening_service.is_loaded),
        "model_type": screening_service.metadata.get("model_type", "XGBClassifier"),
        "version": "1.0.0",
    }


@router.get(
    "/model-info",
    summary="Report Loaded Model Version and Supported Parameters",
    response_model=ModelInfoResponse,
)
async def get_model_information() -> ModelInfoResponse:
    """Returns transparent metadata regarding training cross-validation metrics, feature counts,

    supported input parameters, and dataset origins.
    """
    return screening_service.get_model_info()


@router.post(
    "/clinical",
    summary="Run Clinical Parameter Screening Inference",
    response_model=ClinicalScreeningResponse,
)
async def run_clinical_analysis(request: ClinicalScreeningRequest) -> ClinicalScreeningResponse:
    """Runs the LunaHer Pattern Screening Model on clinical parameters.

    Never diagnoses PCOS; produces an uncalibrated experimental risk score with grounded
    feature contributions and educational clinician discussion topics.
    """
    if not screening_service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="PCOS screening model is currently not loaded. Service is unavailable.",
        )

    try:
        response = screening_service.run_clinical_screening(request)
        return response
    except Exception as e:
        logger.error("Clinical screening inference error: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing clinical parameters. Please verify input values and try again.",
        )


@router.post(
    "/ultrasound",
    summary="Run Ultrasound Follicle Analysis",
    response_model=UltrasoundScreeningResponse,
)
async def run_ultrasound_analysis(file: UploadFile = File(...)) -> UltrasoundScreeningResponse:
    """Estimates antral follicle counts from an uploaded ultrasound scan image using the

    LunaHer image pattern estimation pipeline.
    Temporary memory buffers are purged immediately upon processing completion.
    """
    # 1. Validate content type
    allowed_types = ["image/png", "image/jpeg", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{file.content_type}'. Please upload a PNG, JPG, or JPEG ultrasound image.",
        )

    # 2. Read bytes and enforce file size ceiling (10 MB)
    try:
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Image exceeds 10MB limit. Please upload a compressed scan.",
            )

        # 3. Process image through follicle estimation pipeline
        response = screening_service.process_ultrasound_image(contents)
        return response
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except HTTPException:
        raise
    except Exception as err:
        logger.error("Ultrasound image processing failed: %s", str(err))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while analyzing the ultrasound image. Ensure image is clear and unobstructed.",
        )
    finally:
        # Guarantee file close
        await file.close()
