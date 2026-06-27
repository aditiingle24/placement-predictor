# 🎓 Placement Predictor
 
> Predict your placement readiness based on your academic and skill profile.
 
A full-stack web application that predicts whether a student will be placed based on their academic performance and skill set. Built with a **React** frontend and a **Flask** + **scikit-learn** backend, it also provides a **skill gap analysis** comparing the student's profile against the average profile of placed students.
 
---
 
## 📸 Features
 
- **Placement Prediction** — Logistic Regression model trained on 12,000 student records
- **Confidence Score** — Shows how confident the model is in its prediction
- **Skill Gap Analysis** — Visual bar chart comparing your scores against placed student benchmarks
- **Actionable Tips** — Highlighted suggestions for every skill you're below benchmark on
- **Clean UI** — Glassmorphism card design with a responsive layout
---
 
## 🗂️ Project Structure
 
```
placement-predictor/
│
├── frontend/                  # React (Vite) app
│   ├── src/
│   │   ├── App.jsx            # Main component with form, result & skill gap UI
│   │   ├── App.css            # All styles
│   │   └── assets/
│   │       └── bg.jpg         # Background image
│   └── index.html             # Tab title & favicon
│
├── backend/                   # Flask API
│   ├── app.py                 # Flask server with /predict endpoint
│   ├── predict.py             # Prediction logic + skill gap computation
│   └── train.py               # Model training script
│
├── models/
│   ├── placement_model.pkl    # Trained Logistic Regression model
│   └── feature_columns.pkl    # Feature column order for inference
│
└── data/
    └── placement.csv          # Dataset (12,000 student records)
```
 
---
 
## 🧠 Model Details
 
| Property | Details |
|---|---|
| Algorithm | Logistic Regression |
| Dataset | 12,000 student records |
| Placed / Not Placed | 3,652 / 8,348 |
| Features | CGPA, backlogs, internships, certifications, coding skills, communication skills, aptitude score, projects, gender, degree, branch |
| Encoding | One-hot encoding with `drop_first=True` |
| Output | Placed / Not Placed + confidence % |
 
---
 
## 📊 Skill Gap Benchmarks
 
Benchmarks are computed from the **average profile of placed students** in `placement.csv` — not hardcoded values.
 
| Skill | Placed Student Average |
|---|---|
| CGPA | 8.14 / 10 |
| Coding skills | 7.52 / 10 |
| Communication skills | 5.48 / 10 |
| Aptitude score | 7.17 / 10 |
| Internships | 1.53 |
| Projects | 2.45 |
| Certifications | 2.53 |
| Backlogs | 1.49 (lower is better) |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Python 3.8+
- Node.js 16+
---
 
### 1. Clone the repository
 
```bash
git clone https://github.com/your-username/placement-predictor.git
cd placement-predictor
```
 
### 2. Set up the backend
 
```bash
cd backend
pip install flask flask-cors scikit-learn pandas joblib
```
 
Train the model (only needed once):
 
```bash
python train.py
```
 
Start the Flask server:
 
```bash
python app.py
```
 
The API will run at `http://127.0.0.1:5000`
 
---
 
### 3. Set up the frontend
 
```bash
cd frontend
npm install
npm run dev
```
 
The app will run at `http://localhost:5173`
 
---
 
## 🔌 API Reference
 
### `POST /predict`
 
**Request body:**
 
```json
{
  "age": 21,
  "cgpa": 8.5,
  "backlogs": 0,
  "internships": 2,
  "certifications": 3,
  "coding_skills": 8,
  "communication_skills": 7,
  "aptitude_score": 8,
  "projects": 3,
  "gender": "Male",
  "degree": "BTech",
  "branch": "CS"
}
```
 
**Response:**
 
```json
{
  "prediction": "Placed",
  "probability": 87.43,
  "skill_gap": {
    "cgpa": {
      "label": "CGPA",
      "you": 8.5,
      "benchmark": 8.14,
      "max": 10,
      "gap": 0.36,
      "status": "good"
    },
    "...": "..."
  }
}
```
 
---
 
## 📥 Input Ranges
 
| Field | Range |
|---|---|
| Age | 18 – 25 |
| CGPA | 5.5 – 9.8 |
| Backlogs | 0 – 3 |
| Internships | 0 – 5 |
| Certifications | 0 – 5 |
| Coding skills | 1 – 10 |
| Communication skills | 1 – 10 |
| Aptitude score | 1 – 10 *(scaled internally to 60–99)* |
| Projects | 0 – 10 |
 
---
 
## 🛠️ Tech Stack
 
**Frontend**
- React 18 (Vite)
- CSS3 (Glassmorphism, CSS variables)
**Backend**
- Python / Flask
- Flask-CORS
- scikit-learn (Logistic Regression)
- pandas, joblib
---
 
## 🔮 Future Improvements
 
- Replace Logistic Regression with XGBoost / Random Forest for better accuracy
- Add SHAP explainability — show which features drove the prediction
- Batch CSV upload for predicting multiple students at once
- Authentication for students to save and track their predictions over time
---
 
## 👩‍💻 Author
 
Made with ❤️ by **Aditi**
 
