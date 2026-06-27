import { useState } from "react";
import "./App.css";
import bg from "./assets/bg.jpg";

const SKILL_TIPS = {
  cgpa:                 "Focus on core subject scores this semester.",
  coding_skills:        "Practice DSA on LeetCode or HackerRank daily.",
  communication_skills: "Join group discussions, mock interviews, or debate clubs.",
  aptitude_score:       "Practise quantitative aptitude and logical reasoning papers.",
  internships:          "Apply for internships on Internshala or LinkedIn.",
  projects:             "Build 1–2 domain-specific projects and publish on GitHub.",
  certifications:       "Earn free certifications on Coursera, NPTEL, or Google.",
  backlogs:             "Clear pending backlogs — they heavily impact shortlisting.",
};

const LOWER_IS_BETTER = new Set(["backlogs"]);

function SkillBar({ field, data }) {
  const { label, you, benchmark, max, gap } = data;
  const isLower = LOWER_IS_BETTER.has(field);
  const isGood  = isLower ? you <= benchmark : gap >= 0;
  const youPct   = Math.min((you / max) * 100, 100);
  const benchPct = Math.min((benchmark / max) * 100, 100);
  const absGap   = Math.abs(gap).toFixed(2);

  const badgeText = isLower
    ? (isGood ? `${absGap} below average ✓` : `+${absGap} above average`)
    : (isGood ? `+${absGap} above benchmark` : `${absGap} below benchmark`);

  return (
    <div className="skill-row">
      <div className="skill-label-row">
        <span className="skill-name">{label}</span>
        <span className="skill-vals">
          You: <b style={{ color: "white" }}>{you}</b>
          &nbsp;|&nbsp;Avg: <b style={{ color: "white" }}>{benchmark}</b>
        </span>
      </div>

      <div className="skill-track">
        <div className={`skill-bar ${isGood ? "good" : "bad"}`} style={{ width: `${youPct}%` }} />
        <div className="benchmark-line" style={{ left: `${benchPct}%` }} />
      </div>

      <div className="skill-badge-row">
        <span className={`skill-badge ${isGood ? "good" : "bad"}`}>{badgeText}</span>
        {!isGood && SKILL_TIPS[field] && (
          <span className="skill-tip">{SKILL_TIPS[field]}</span>
        )}
      </div>
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState({
    age: "", cgpa: "", backlogs: "", internships: "",
    certifications: "", coding_skills: "", communication_skills: "",
    aptitude_score: "", projects: "",
    gender: "Male", degree: "BTech", branch: "CS",
  });
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePredict = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res  = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else            setResult(data);
    } catch {
      setError("Could not connect to the server. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      age: "", cgpa: "", backlogs: "", internships: "",
      certifications: "", coding_skills: "", communication_skills: "",
      aptitude_score: "", projects: "",
      gender: "Male", degree: "BTech", branch: "CS",
    });
    setResult(null);
    setError(null);
  };

  const isPlaced = result?.prediction === "Placed";

  return (
    <div className="background" style={{ backgroundImage: `url(${bg})` }}>

      {/* Title lives outside the card — always fully visible */}
      <h1 className="page-title">🎓 Placement Predictor</h1>
      <p className="page-subtitle">Predict your placement readiness based on your academic and skill profile.</p>

      <div className="card">
        <div className="grid">
          <input type="number"            name="age"                   placeholder="Age (e.g. 21)"         value={formData.age}                  onChange={handleChange} />
          <input type="number" step="0.01" name="cgpa"                 placeholder="CGPA (5.5 – 9.8)"      value={formData.cgpa}                 onChange={handleChange} />
          <input type="number"            name="backlogs"              placeholder="Backlogs (0 – 3)"       value={formData.backlogs}             onChange={handleChange} />
          <input type="number"            name="internships"           placeholder="Internships (0 – 5)"    value={formData.internships}          onChange={handleChange} />
          <input type="number"            name="certifications"        placeholder="Certifications (0 – 5)" value={formData.certifications}       onChange={handleChange} />
          <input type="number" step="0.1" name="coding_skills"         placeholder="Coding skills (1 – 10)" value={formData.coding_skills}        onChange={handleChange} />
          <input type="number" step="0.1" name="communication_skills"  placeholder="Communication (1 – 10)" value={formData.communication_skills} onChange={handleChange} />
          <input type="number"            name="aptitude_score"        placeholder="Aptitude score (1 – 10)"     value={formData.aptitude_score}       onChange={handleChange} />
          <input type="number"            name="projects"              placeholder="Projects (0 – 10)"      value={formData.projects}             onChange={handleChange} />

          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select name="degree" value={formData.degree} onChange={handleChange}>
            <option value="BTech">BTech</option>
            <option value="BE">BE</option>
            <option value="BCA">BCA</option>
            <option value="BSc">BSc</option>
          </select>
          <select name="branch" value={formData.branch} onChange={handleChange}>
            <option value="CS">CS</option>
            <option value="IT">IT</option>
            <option value="AI">AI</option>
            <option value="DS">DS</option>
            <option value="Electrical">Electrical</option>
            <option value="Mechanical">Mechanical</option>
          </select>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handlePredict} disabled={loading}>
            {loading ? "Predicting..." : "Predict Placement"}
          </button>
          <button className="btn btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>

        {error && (
          <div className="result" style={{ borderLeft: "4px solid #ff6b6b" }}>
            <p style={{ color: "#ff6b6b" }}>⚠️ {error}</p>
          </div>
        )}

        {result && (
          <>
            <div className="result" style={{ borderLeft: `4px solid ${isPlaced ? "#00e676" : "#ff6b6b"}` }}>
              <h2>Prediction Result</h2>
              <h3 style={{ color: isPlaced ? "#00e676" : "#ff6b6b" }}>
                {isPlaced ? "✅" : "❌"} {result.prediction}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>
                Confidence: <b style={{ color: "white" }}>{result.probability}%</b>
              </p>
            </div>

            {result.skill_gap && (
              <div className="skill-gap-section">
                <div className="skill-gap-header">
                  <h2 className="skill-gap-title">📊 Skill gap vs placed students</h2>
                  <div className="skill-gap-legend">
                    <span className="legend-line" />
                    Placed avg
                  </div>
                </div>
                {Object.entries(result.skill_gap).map(([field, data]) => (
                  <SkillBar key={field} field={field} data={data} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;