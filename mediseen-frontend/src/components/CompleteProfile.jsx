import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// List of common conditions for multi-select
const commonConditions = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "Arthritis",
  "Kidney Disease",
  "Thyroid Disorder",
  "Cancer",
  "Allergies",
  "None"
];

const CompleteProfile = () => {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [otherCondition, setOtherCondition] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleConditionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedConditions((prev) => [...prev, value]);
    } else {
      setSelectedConditions((prev) => prev.filter((c) => c !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!fullName || !age || !gender || !emergencyContact || !address) {
      setError("Please fill in all the required fields.");
      setLoading(false);
      return;
    }

    if (isNaN(age)) {
      setError("Please enter a valid age.");
      setLoading(false);
      return;
    }

    // Combine selected conditions and otherCondition
    let medicalConditions = selectedConditions.join(", ");
    if (otherCondition.trim()) {
      medicalConditions = medicalConditions
        ? `${medicalConditions}, ${otherCondition.trim()}`
        : otherCondition.trim();
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/user/complete-profile",
        {
          name: fullName,
          age,
          gender,
          address,
          medicalConditions,
          currentMedications,
          phone: emergencyContact,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/mainuserdashboard");
      } else {
        setError("Unexpected server response. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "There was a problem updating your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Complete Your Profile</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Personal Details</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            style={styles.input}
            min={0}
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Emergency Contact"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Medical Conditions</h3>
          <div style={styles.checkboxGroup}>
            {commonConditions.map((condition) => (
              <label key={condition} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={condition}
                  checked={selectedConditions.includes(condition)}
                  onChange={handleConditionChange}
                  style={styles.checkbox}
                />
                {condition}
              </label>
            ))}
          </div>
          <input
            type="text"
            placeholder="Other condition (if not listed)"
            value={otherCondition}
            onChange={(e) => setOtherCondition(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Current Medications</h3>
          <textarea
            placeholder="List any current medications (optional)"
            value={currentMedications}
            onChange={(e) => setCurrentMedications(e.target.value)}
            style={{ ...styles.input, height: "80px" }}
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    background: "#f9f9f9",
    borderRadius: "14px",
    boxShadow: "0 4px 18px rgba(0, 0, 0, 0.10)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#1976d2",
    fontWeight: "bold",
    fontSize: "2rem",
    letterSpacing: "1px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  section: {
    background: "#fff",
    borderRadius: "8px",
    padding: "1.2rem 1rem",
    boxShadow: "0 2px 8px rgba(33,150,243,0.04)",
    marginBottom: "1rem",
  },
  sectionTitle: {
    margin: "0 0 1rem 0",
    color: "#388e3c",
    fontWeight: "bold",
    fontSize: "1.1rem",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #bdbdbd",
    marginBottom: "0.8rem",
    width: "100%",
    boxSizing: "border-box",
  },
  checkboxGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "0.8rem",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "1rem",
    background: "#e3f2fd",
    borderRadius: "5px",
    padding: "0.3rem 0.7rem",
    boxShadow: "0 1px 3px rgba(33,150,243,0.08)",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "0.5rem",
  },
  button: {
    padding: "0.9rem",
    backgroundColor: "#1976d2",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
    letterSpacing: "1px",
    boxShadow: "0 2px 8px rgba(33,150,243,0.12)",
    marginTop: "1rem",
  },
  error: {
    color: "#fff",
    backgroundColor: "#f44336",
    padding: "0.8rem",
    borderRadius: "5px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "1rem",
  },
};

export default CompleteProfile;
