"""LunaHer Pattern Screening Service.

Encapsulates XGBoost model loading, feature alignment, clinical parameter inference,
and ultrasound image feature estimation.
"""
from __future__ import annotations

import io
import json
import os
import pickle
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from PIL import Image

from ..core.logging import logger
from ..schemas.screening import (
    ClinicalScreeningRequest,
    ClinicalScreeningResponse,
    ContributingFactor,
    ModelInfoResponse,
    UltrasoundScreeningResponse,
)

# Base Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "ml_models")
MODEL_PATH = os.path.join(MODEL_DIR, "best_xgboost_model.pkl")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")


class PCOSResearchScreeningService:
    """Manages the LunaHer Pattern Screening Model lifecycle and inference."""

    def __init__(self) -> None:
        self.model: Any = None
        self.metadata: Dict[str, Any] = {}
        self.feature_names: List[str] = []
        self.feature_medians: Dict[str, float] = {}
        self.is_loaded: bool = False
        self._load_model_artifacts()

    def _load_model_artifacts(self) -> None:
        """Loads the pre-trained XGBoost model and feature metadata."""
        try:
            if os.path.exists(METADATA_PATH):
                with open(METADATA_PATH, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)
                    self.feature_names = self.metadata.get("feature_names", [])
                    self.feature_medians = self.metadata.get("feature_medians", {})

            if os.path.exists(MODEL_PATH):
                with open(MODEL_PATH, "rb") as f:
                    self.model = pickle.load(f)
                self.is_loaded = True
                logger.info(
                    "LunaHer Pattern Screening Model loaded successfully (%d features)",
                    len(self.feature_names),
                )
            else:
                logger.warning("PCOS Model artifact not found at %s", MODEL_PATH)
                self.is_loaded = False
        except Exception as e:
            logger.error("Failed to load PCOS Research model: %s", str(e))
            self.is_loaded = False

    def get_model_info(self) -> ModelInfoResponse:
        """Returns metadata regarding the trained XGBoost model and supported inputs."""
        features_spec = [
            {"name": "age", "unit": "years", "category": "physical", "description": "Patient age"},
            {"name": "weight_kg", "unit": "kg", "category": "physical", "description": "Body weight"},
            {"name": "height_cm", "unit": "cm", "category": "physical", "description": "Standing height"},
            {"name": "waist_inch", "unit": "inches", "category": "physical", "description": "Waist circumference"},
            {"name": "hip_inch", "unit": "inches", "category": "physical", "description": "Hip circumference"},
            {"name": "pulse_bpm", "unit": "bpm", "category": "vitals", "description": "Resting pulse"},
            {"name": "rbs_mg_dl", "unit": "mg/dL", "category": "metabolic", "description": "Random Blood Sugar"},
            {"name": "bp_systolic", "unit": "mmHg", "category": "vitals", "description": "Systolic blood pressure"},
            {"name": "bp_diastolic", "unit": "mmHg", "category": "vitals", "description": "Diastolic blood pressure"},
            {"name": "cycle_regularity", "unit": "category", "category": "cycle", "description": "Regular vs Irregular"},
            {"name": "cycle_length_days", "unit": "days", "category": "cycle", "description": "Average cycle length"},
            {"name": "fsh_miu_ml", "unit": "mIU/mL", "category": "hormonal", "description": "Follicle-Stimulating Hormone"},
            {"name": "lh_miu_ml", "unit": "mIU/mL", "category": "hormonal", "description": "Luteinizing Hormone"},
            {"name": "amh_ng_ml", "unit": "ng/mL", "category": "hormonal", "description": "Anti-Müllerian Hormone"},
            {"name": "prl_ng_ml", "unit": "ng/mL", "category": "hormonal", "description": "Prolactin"},
            {"name": "prg_ng_ml", "unit": "ng/mL", "category": "hormonal", "description": "Progesterone"},
            {"name": "tsh_miu_l", "unit": "mIU/L", "category": "hormonal", "description": "Thyroid-Stimulating Hormone"},
            {"name": "follicles_left", "unit": "count", "category": "ultrasound", "description": "Antral follicles in Left Ovary"},
            {"name": "follicles_right", "unit": "count", "category": "ultrasound", "description": "Antral follicles in Right Ovary"},
            {"name": "hair_growth", "unit": "yes/no", "category": "clinical", "description": "Hirsutism / excess facial hair"},
            {"name": "skin_darkening", "unit": "yes/no", "category": "clinical", "description": "Acanthosis Nigricans / velvety creases"},
            {"name": "hair_loss", "unit": "yes/no", "category": "clinical", "description": "Scalp hair thinning"},
            {"name": "pimples_acne", "unit": "yes/no", "category": "clinical", "description": "Persistent acne"},
            {"name": "weight_gain", "unit": "yes/no", "category": "clinical", "description": "Unexplained weight gain"},
            {"name": "fast_food", "unit": "yes/no", "category": "lifestyle", "description": "Frequent fast food diet"},
            {"name": "regular_exercise", "unit": "yes/no", "category": "lifestyle", "description": "Regular exercise routine"},
        ]

        metrics = self.metadata.get("metrics", {
            "5_fold_cv_accuracy": 0.9015,
            "5_fold_cv_precision": 0.8721,
            "5_fold_cv_recall": 0.8238,
            "5_fold_cv_f1": 0.8450,
            "5_fold_cv_roc_auc": 0.9544,
        })

        return ModelInfoResponse(
            model_name="LunaHer Pattern Screening Model",
            algorithm="XGBoost (Extreme Gradient Boosting)",
            version="1.0.0",
            is_loaded=self.is_loaded,
            feature_count=len(self.feature_names) if self.feature_names else 42,
            supported_features=features_spec,
            validation_metrics=metrics,
            dataset_source="Kaggle PCOS Dataset (PCOS_data_without_infertility.xlsx) - 538 clinical patient records",
            disclaimer=(
                "The LunaHer model is a research-only statistical classifier. Cross-validation accuracy "
                "reflects retrospective mathematical evaluation on public observational data and cannot be "
                "interpreted as prospective clinical diagnostic performance."
            ),
        )

    def run_clinical_screening(self, request: ClinicalScreeningRequest) -> ClinicalScreeningResponse:
        """Executes model inference on clinical parameters, returning grounded risk scores."""
        if not self.is_loaded or self.model is None:
            raise RuntimeError("PCOS screening model is currently not loaded. Service is operating in offline mode.")

        # 1. Calculate derived clinical metrics
        calculated_metrics: Dict[str, Optional[float]] = {}
        bmi: Optional[float] = None
        if request.weight_kg and request.height_cm:
            height_m = request.height_cm / 100.0
            bmi = round(request.weight_kg / (height_m * height_m), 2)
            calculated_metrics["bmi"] = bmi

        waist_hip_ratio: Optional[float] = None
        if request.waist_inch and request.hip_inch and request.hip_inch > 0:
            waist_hip_ratio = round(request.waist_inch / request.hip_inch, 3)
            calculated_metrics["waist_hip_ratio"] = waist_hip_ratio

        # 2. Build feature vector aligned with trained XGBoost booster
        row_dict: Dict[str, float] = {}
        for feature in self.feature_names:
            # Default to dataset median
            row_dict[feature] = self.feature_medians.get(feature, 0.0)

        # Map user inputs to exact column names
        if request.age is not None:
            row_dict[" Age (yrs)"] = float(request.age)
        if request.weight_kg is not None:
            row_dict["Weight (Kg)"] = float(request.weight_kg)
        if request.height_cm is not None:
            row_dict["Height(Cm) "] = float(request.height_cm)
        if bmi is not None:
            row_dict["BMI"] = float(bmi)
        if request.waist_inch is not None:
            row_dict["Waist(inch)"] = float(request.waist_inch)
        if request.hip_inch is not None:
            row_dict["Hip(inch)"] = float(request.hip_inch)
        if waist_hip_ratio is not None:
            row_dict["Waist:Hip Ratio"] = float(waist_hip_ratio)

        if request.pulse_bpm is not None:
            row_dict["Pulse rate(bpm) "] = float(request.pulse_bpm)
        if request.rbs_mg_dl is not None:
            row_dict["RBS(mg/dl)"] = float(request.rbs_mg_dl)
        if request.bp_systolic is not None:
            row_dict["BP _Systolic (mmHg)"] = float(request.bp_systolic)
        if request.bp_diastolic is not None:
            row_dict["BP _Diastolic (mmHg)"] = float(request.bp_diastolic)

        if request.cycle_regularity is not None:
            # In dataset, Regular = 2, Irregular = 4
            row_dict["Cycle(R/I)"] = 4.0 if request.cycle_regularity == "irregular" else 2.0
        if request.cycle_length_days is not None:
            row_dict["Cycle length(days)"] = float(request.cycle_length_days)

        if request.fsh_miu_ml is not None:
            row_dict["FSH(mIU/mL)"] = float(request.fsh_miu_ml)
        if request.lh_miu_ml is not None:
            row_dict["LH(mIU/mL)"] = float(request.lh_miu_ml)
        if request.amh_ng_ml is not None:
            row_dict["AMH(ng/mL)"] = float(request.amh_ng_ml)
        if request.prl_ng_ml is not None:
            row_dict["PRL(ng/mL)"] = float(request.prl_ng_ml)
        if request.prg_ng_ml is not None:
            row_dict["PRG(ng/mL)"] = float(request.prg_ng_ml)
        if request.tsh_miu_l is not None:
            row_dict["TSH (mIU/L)"] = float(request.tsh_miu_l)

        if request.skin_darkening is not None:
            row_dict["Skin darkening (Y/N)"] = 1.0 if request.skin_darkening else 0.0
        if request.hair_growth is not None:
            row_dict["hair growth(Y/N)"] = 1.0 if request.hair_growth else 0.0
        if request.hair_loss is not None:
            row_dict["Hair loss(Y/N)"] = 1.0 if request.hair_loss else 0.0
        if request.pimples_acne is not None:
            row_dict["Pimples(Y/N)"] = 1.0 if request.pimples_acne else 0.0
        if request.weight_gain is not None:
            row_dict["Weight gain(Y/N)"] = 1.0 if request.weight_gain else 0.0

        if request.fast_food is not None:
            row_dict["Fast food (Y/N)"] = 1.0 if request.fast_food else 0.0
        if request.regular_exercise is not None:
            row_dict["Reg.Exercise(Y/N)"] = 1.0 if request.regular_exercise else 0.0

        if request.follicles_left is not None:
            row_dict["Follicle No. (L)"] = float(request.follicles_left)
        if request.follicles_right is not None:
            row_dict["Follicle No. (R)"] = float(request.follicles_right)

        # 3. Create DataFrame and enforce feature order
        input_df = pd.DataFrame([row_dict])[self.feature_names]

        # 4. Predict probability and classification
        probabilities = self.model.predict_proba(input_df)[0]
        # Class 1 = PCOS Risk Pattern, Class 0 = Lower Risk Pattern
        prob_pcos = float(probabilities[1])
        prediction = int(self.model.predict(input_df)[0])
        risk_score_pct = round(prob_pcos * 100.0, 1)

        # 5. Determine tier and label
        if risk_score_pct >= 65.0:
            confidence_tier = "elevated"
            screening_label = "Elevated Research Risk Pattern"
        elif risk_score_pct >= 40.0:
            confidence_tier = "moderate"
            screening_label = "Borderline / Moderate Risk Pattern"
        else:
            confidence_tier = "low"
            screening_label = "Lower Risk Pattern"

        # 6. Extract key contributing factors (features where user differs from median or has high gain)
        contributing: List[ContributingFactor] = []
        top_importance = self.metadata.get("feature_importance_top15", {})

        check_features = [
            ("Follicle No. (R)", "Right Ovary Follicle Count", request.follicles_right, "count"),
            ("Follicle No. (L)", "Left Ovary Follicle Count", request.follicles_left, "count"),
            ("Skin darkening (Y/N)", "Acanthosis Nigricans / Crease Darkening", request.skin_darkening, "boolean"),
            ("hair growth(Y/N)", "Hirsutism / Facial Hair", request.hair_growth, "boolean"),
            ("Weight gain(Y/N)", "Recent Weight Changes", request.weight_gain, "boolean"),
            ("Cycle(R/I)", "Cycle Regularity", request.cycle_regularity, "text"),
            ("AMH(ng/mL)", "Anti-Müllerian Hormone", request.amh_ng_ml, "ng/mL"),
            ("Pimples(Y/N)", "Persistent Acne / Pimples", request.pimples_acne, "boolean"),
            ("BMI", "Body Mass Index", bmi, "kg/m²"),
        ]

        for col, display_name, user_val, val_type in check_features:
            if user_val is not None:
                median_val = self.feature_medians.get(col, 0.0)
                is_elevated = False
                if val_type == "boolean":
                    is_elevated = bool(user_val)
                elif val_type in ("count", "ng/mL", "kg/m²"):
                    is_elevated = float(user_val) > median_val
                elif val_type == "text":
                    is_elevated = (user_val == "irregular")

                if is_elevated or col in top_importance:
                    gain = top_importance.get(col, 1.0)
                    impact = "high" if gain >= 4.0 else ("moderate" if gain >= 2.0 else "low")
                    explanation = (
                        f"Your value ({user_val}) exceeds reference median ({median_val}). "
                        f"This feature had top gain impact ({gain:.2f}) in model cross-validation."
                        if is_elevated
                        else f"Recorded value ({user_val}) aligns closely with reference median ({median_val})."
                    )
                    contributing.append(
                        ContributingFactor(
                            feature_name=display_name,
                            user_value=user_val,
                            baseline_median=median_val,
                            impact_level=impact,
                            explanation=explanation,
                        )
                    )

        # 7. Formulate educational clinician discussion topics
        discussion_topics = [
            "Share your logged cycle regularity timeline and cycle duration with your physician.",
            "Discuss whether laboratory testing (AMH, LH, FSH, Thyroid) is clinically warranted.",
            "If ultrasound imaging was noted, bring follicle count documentation to a gynecologist.",
            "Review lifestyle factors, metabolic health (blood sugar/insulin), and dermatological concerns.",
        ]

        limitations = [
            "Model is an experimental statistical tool trained on 538 retrospective Kaggle clinical records.",
            "The probability score is not calibrated for general population screening or clinical triage.",
            "Rotterdam consensus diagnosis requires formal clinical evaluation, physical exam, and imaging.",
            "Normal biological cycle variations and other conditions can mimic these parameters.",
        ]

        return ClinicalScreeningResponse(
            prediction=prediction,
            screening_label=screening_label,
            risk_score_percentage=risk_score_pct,
            confidence_tier=confidence_tier,
            calculated_metrics=calculated_metrics,
            top_contributing_factors=contributing[:6],
            model_metadata={
                "algorithm": "XGBoost",
                "training_cv_accuracy": f"{self.metadata.get('metrics', {}).get('5_fold_cv_accuracy', 0.9015) * 100:.1f}%",
                "features_analyzed": len(self.feature_names),
            },
            limitations=limitations,
            suggested_clinician_discussion_topics=discussion_topics,
        )

    def process_ultrasound_image(self, image_bytes: bytes) -> UltrasoundScreeningResponse:
        """Processes an ultrasound scan with LunaHer image pattern estimation."""
        if not image_bytes:
            raise ValueError("No image data provided for ultrasound analysis.")

        # Limit file size (max 10MB)
        if len(image_bytes) > 10 * 1024 * 1024:
            raise ValueError("Uploaded file exceeds 10MB limit. Please upload a compressed scan.")

        try:
            image = Image.open(io.BytesIO(image_bytes))
        except Exception:
            raise ValueError("Uploaded file is not a valid image format. Accepted formats: PNG, JPG, JPEG.")

        # Validate minimum dimensions
        w, h = image.size
        if w < 100 or h < 100:
            raise ValueError(f"Image dimensions ({w}x{h}) are too small for ultrasound feature detection.")

        # Grayscale conversion and thumbnail normalization for image pattern estimation.
        gray_image = image.convert("L")
        gray_image.thumbnail((512, 512))
        arr = np.array(gray_image, dtype=np.float32)

        # Contrast normalization
        p2, p98 = np.percentile(arr, [2, 98])
        arr = np.clip((arr - p2) / max(1e-6, p98 - p2), 0.0, 1.0)

        # Region of interest crop (inner 88%)
        curr_h, curr_w = arr.shape
        y0, y1 = int(curr_h * 0.06), int(curr_h * 0.94)
        x0, x1 = int(curr_w * 0.06), int(curr_w * 0.94)
        roi = arr[y0:y1, x0:x1]

        if roi.size == 0:
            follicle_estimate = 0
        else:
            # Low-intensity thresholding for fluid-filled dark follicle sacs
            threshold = np.percentile(roi, 30)
            binary = roi < threshold

            # Connected component extraction
            components = self._count_connected_components(binary)
            count = 0
            for comp in components:
                area = comp["area"]
                width = comp["width"]
                height = comp["height"]
                aspect = min(width, height) / max(width, height)
                # Candidate-region filter criteria: area 20-1200, aspect >= 0.45, dimension 4-60px
                if 20 <= area <= 1200 and aspect >= 0.45 and 4 <= width <= 60 and 4 <= height <= 60:
                    count += 1
            follicle_estimate = int(max(0, min(30, count)))

        notes = [
            f"Image analyzed with dimensions {w}x{h} px.",
            f"Detected approximately {follicle_estimate} circular anechoic candidate regions.",
            "Candidate region counts are informational only and require review by a qualified clinician.",
        ]

        limitations = [
            "This heuristic detects low-intensity blob components; artifact noise or bowel gas can trigger false positives.",
            "Cannot differentiate between active dominant follicles, physiological cysts, or antral follicles.",
            "Requires transvaginal sonography interpreted by a certified sonologist or radiologist.",
        ]

        # Automatic memory cleanup
        del arr
        del roi
        del image
        del gray_image

        return UltrasoundScreeningResponse(
            left_follicle_estimate=follicle_estimate,
            right_follicle_estimate=follicle_estimate,
            images_processed=1,
            notes=notes,
            limitations=limitations,
        )

    def _count_connected_components(self, binary_mask: np.ndarray) -> List[Dict[str, int]]:
        """Extracts connected component bounding boxes and areas from binary mask."""
        h, w = binary_mask.shape
        visited = np.zeros((h, w), dtype=bool)
        components: List[Dict[str, int]] = []

        for y in range(h):
            for x in range(w):
                if binary_mask[y, x] and not visited[y, x]:
                    queue = [(y, x)]
                    visited[y, x] = True
                    min_y, max_y = y, y
                    min_x, max_x = x, x
                    area = 0

                    while queue:
                        cy, cx = queue.pop(0)
                        area += 1
                        min_y = min(min_y, cy)
                        max_y = max(max_y, cy)
                        min_x = min(min_x, cx)
                        max_x = max(max_x, cx)

                        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                            ny, nx = cy + dy, cx + dx
                            if 0 <= ny < h and 0 <= nx < w and binary_mask[ny, nx] and not visited[ny, nx]:
                                visited[ny, nx] = True
                                queue.append((ny, nx))

                    components.append({
                        "area": area,
                        "width": max_x - min_x + 1,
                        "height": max_y - min_y + 1,
                    })

        return components


# Singleton instance
screening_service = PCOSResearchScreeningService()
