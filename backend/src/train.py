import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
accuracy_score,
precision_score,
recall_score,
f1_score,
classification_report,
confusion_matrix
)

# =========================

# Load Dataset

# =========================

df = pd.read_csv("../data/placement.csv")

print("Original Shape:", df.shape)

# =========================

# Data Cleaning

# =========================

df = df.drop(
columns=[
"student_id",
"company_type",
"package_lpa"
]
)

# =========================

# One-Hot Encoding

# =========================

df = pd.get_dummies(
df,
columns=["gender", "degree", "branch"],
drop_first=True,
dtype=int
)

print("Shape after encoding:", df.shape)

# =========================

# Features & Target

# =========================

X = df.drop("placed", axis=1)
y = df["placed"]

print("\nFeatures:")
print(X.columns.tolist())

# =========================

# Train-Test Split

# =========================

X_train, X_test, y_train, y_test = train_test_split(
X,
y,
test_size=0.2,
random_state=42,
stratify=y
)

print("\nTraining Set:", X_train.shape)
print("Testing Set :", X_test.shape)

# =========================

# Logistic Regression

# =========================

lr_model = LogisticRegression(max_iter=1000)

lr_model.fit(X_train, y_train)

print("\nModel trained successfully!")

# =========================

# Predictions

# =========================

y_pred = lr_model.predict(X_test)

# =========================

# Evaluation

# =========================

print("\n===== LOGISTIC REGRESSION =====")

print("Accuracy :", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall   :", recall_score(y_test, y_pred))
print("F1 Score :", f1_score(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# =========================

# Save Model

# =========================
# Save model
joblib.dump(
    lr_model,
    "../models/placement_model.pkl"
)

# Save feature columns
joblib.dump(
    X.columns.tolist(),
    "../models/feature_columns.pkl"
)

print("Model saved successfully!")