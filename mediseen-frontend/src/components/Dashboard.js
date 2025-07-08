import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [medicinesError, setMedicinesError] = useState(null);
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newScheduleTime, setNewScheduleTime] = useState("");
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/user/profile", {
        headers: {
          Authorization: token,
        },
      });
      setUser(res.data.user);

      // Check if the user has completed their profile
      if (!res.data.user.profileComplete) {
        navigate("/complete-profile");
      }
    } catch (err) {
      console.error("Error fetching user profile", err);
      navigate("/"); // Redirect to home if error occurs
    }
  };

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/medicines", {
        headers: {
          Authorization: token,
        },
      });
      setMedicines(res.data);
    } catch (err) {
      console.error("Error fetching medicines", err);
      setMedicinesError("There was an issue fetching your medicines. Please try again.");
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/medicines",
        {
          medicine_name: newMedicineName,
          schedule_time: newScheduleTime,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setNewMedicineName("");
      setNewScheduleTime("");
      fetchMedicines(); // Refresh list
    } catch (err) {
      alert("Failed to add medicine");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchMedicines();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Welcome to Mediseen</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      {user && (
        <div style={styles.userInfo}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      {user && !user.profileComplete && (
        <div style={styles.profileReminder}>
          <p><strong>Your profile is not complete!</strong> Please complete your profile to fully use the platform.</p>
          <button
            onClick={() => navigate("/complete-profile")}
            style={styles.profileBtn}
          >
            Complete Profile
          </button>
        </div>
      )}

      <h3>Add New Medicine</h3>
      <form onSubmit={handleAddMedicine} style={styles.form}>
        <input
          type="text"
          placeholder="Medicine Name"
          value={newMedicineName}
          onChange={(e) => setNewMedicineName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="time"
          value={newScheduleTime}
          onChange={(e) => setNewScheduleTime(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>Add Medicine</button>
      </form>

      <h3>Your Medicines</h3>
      {medicinesError && <p style={styles.error}>{medicinesError}</p>}
      {medicines.length > 0 ? (
        <ul style={styles.list}>
          {medicines.map((med) => (
            <li key={med.id} style={styles.listItem}>
              <strong>{med.medicine_name}</strong> at {med.schedule_time}
            </li>
          ))}
        </ul>
      ) : (
        <p>No medicines scheduled.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#d9534f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  userInfo: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "5px",
    marginBottom: "1rem",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
  profileReminder: {
    backgroundColor: "#fffae6",
    padding: "1rem",
    borderRadius: "5px",
    marginBottom: "1rem",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
  profileBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f0ad4e",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "300px",
    marginBottom: "2rem",
  },
  input: {
    padding: "0.5rem",
    marginBottom: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  addButton: {
    padding: "0.5rem",
    backgroundColor: "#5cb85c",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  list: {
    padding: 0,
    listStyle: "none",
  },
  listItem: {
    background: "#fff",
    padding: "1rem",
    marginBottom: "0.5rem",
    borderRadius: "5px",
    boxShadow: "0 0 3px rgba(0,0,0,0.1)",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
};

export default Dashboard;
