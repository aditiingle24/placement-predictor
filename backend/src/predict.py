import pandas as pd
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "placement.csv")

# Load model and feature columns
model = joblib.load(os.path.join(MODELS_DIR, "placement_model.pkl"))
feature_columns = joblib.load(os.path.join(MODELS_DIR, "feature_columns.pkl"))

# Skill gap config: field -> { label, max, benchmark from placed students }
# Benchmarks computed from placement.csv placed==1 rows
SKILL_GAP_CONFIG = {
    "cgpa":                  { "label": "CGPA",                 "max": 10,  "benchmark": 8.14 },
    "coding_skills":         { "label": "Coding skills",        "max": 10,  "benchmark": 7.52 },
    "communication_skills":  { "label": "Communication skills", "max": 10,  "benchmark": 5.48 },
    "aptitude_score":        { "label": "Aptitude score",       "max": 10,  "benchmark": 7.17 },  # benchmark: (79.55-60)*(9/39)+1 = 7.17 on 1-10 scale
    "internships":           { "label": "Internships",          "max": 5,   "benchmark": 1.53 },
    "projects":              { "label": "Projects",             "max": 10,  "benchmark": 2.45 },
    "certifications":        { "label": "Certifications",       "max": 5,   "benchmark": 2.53 },
    "backlogs":              { "label": "Backlogs",             "max": 3,   "benchmark": 1.49 },
}

NUMERIC_FIELDS = [
    "age", "cgpa", "backlogs", "internships",
    "certifications", "coding_skills",
    "communication_skills", "aptitude_score", "projects"
]


def compute_skill_gap(student_data):
    gaps = {}
    for field, config in SKILL_GAP_CONFIG.items():
        value = float(student_data.get(field, 0))
        benchmark = config["benchmark"]
        max_val = config["max"]
        gap = round(value - benchmark, 2)

        # For backlogs, lower is better — flip the gap direction
        if field == "backlogs":
            status = "good" if value <= benchmark else "bad"
        else:
            status = "good" if gap >= 0 else "bad"

        gaps[field] = {
            "label":     config["label"],
            "you":       value,
            "benchmark": benchmark,
            "max":       max_val,
            "gap":       gap,
            "status":    status,
        }
    return gaps


def predict_placement(student_data):
    # Cast numeric fields
    cleaned = {}
    for key, value in student_data.items():
        if key in NUMERIC_FIELDS:
            cleaned[key] = float(value)
        else:
            cleaned[key] = value

    # Scale aptitude from user-facing 1-10 -> model's 60-99 range
    # Formula: scaled = 60 + (input - 1) * (39 / 9)
    raw_aptitude = cleaned["aptitude_score"]
    cleaned["aptitude_score"] = round(60 + (raw_aptitude - 1) * (39 / 9), 2)

    # Create dataframe
    df = pd.DataFrame([cleaned])

    # One-hot encode — match train.py (drop_first=True, dtype=int)
    df = pd.get_dummies(
        df,
        columns=["gender", "degree", "branch"],
        drop_first=True,
        dtype=int
    )

    # Add missing columns
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0

    df = df[feature_columns]

    prediction = model.predict(df)[0]
    probability = float(model.predict_proba(df)[0][prediction])

    skill_gap = compute_skill_gap(student_data)

    return {
        "prediction":  "Placed" if prediction == 1 else "Not Placed",
        "probability": round(probability * 100, 2),
        "skill_gap":   skill_gap,
    }