import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "./MainUserDashboard.css"; // Import the CSS file

const bgImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1511174511562-5f97f4f4eab6?auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1500&q=80"
];

const healthTips = [
  "💧 Stay hydrated: Drink at least 8 glasses of water daily.",
  "🍎 Eat a balanced diet rich in fruits and vegetables.",
  "🏃‍♂️ Stay active: Aim for at least 30 minutes of exercise most days.",
  "💊 Take your medicines on time.",
  "😴 Get enough sleep for better recovery and immunity.",
  "🧘‍♀️ Manage stress with relaxation techniques.",
];

const MainUserDashboard = () => {
  const [user, setUser] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newScheduleTime, setNewScheduleTime] = useState("");
  const [newScheduleDate, setNewScheduleDate] = useState("");
  const [isEveryday, setIsEveryday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const medicineListRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to fetch user profile.");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/medicines", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedicines(res.data);
        setTimeout(() => {
          if (medicineListRef.current) {
            medicineListRef.current.scrollTop = medicineListRef.current.scrollHeight;
          }
        }, 200);
      } catch (err) {
        setError("Failed to fetch medicines.");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!newMedicineName || !newScheduleTime || (!isEveryday && !newScheduleDate)) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/medicines/add",
        {
          medicine_name: newMedicineName,
          schedule_time: newScheduleTime,
          schedule_date: isEveryday ? null : newScheduleDate,
          is_everyday: isEveryday
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMedicineName("");
      setNewScheduleTime("");
      setNewScheduleDate("");
      setIsEveryday(false);
      const res = await axios.get("http://localhost:5000/api/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(res.data);
      setError(null);
      setTimeout(() => {
        if (medicineListRef.current) {
          medicineListRef.current.scrollTop = medicineListRef.current.scrollHeight;
        }
      }, 200);
    } catch (err) {
      setError("Failed to add medicine.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="mud-root">
      <div className="mud-bgWrapper">
        <Fade
          duration={6000}
          transitionDuration={1500}
          infinite
          arrows={false}
          pauseOnHover={false}
          canSwipe={false}
        >
          {bgImages.map((url, idx) => (
            <div key={idx} className="mud-bgSlide" style={{ backgroundImage: `url(${url})` }} />
          ))}
        </Fade>
        <div className="mud-gradientOverlay" />
      </div>
      <div className="mud-overlay">
        <header className="mud-header">
          <div className="mud-headerLeft">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
              alt="Mediseen Logo"
              className="mud-logo"
            />
            <h1 className="mud-heading">
              Welcome{user ? `, ${user.name}` : ""}!
            </h1>
          </div>
          <button onClick={handleLogout} className="mud-logoutBtn">
            Logout
          </button>
        </header>

        <main className="mud-mainContent">
          {user && (
            <section className="mud-profileSection">
              <h2 className="mud-sectionTitle">👤 User Profile Details</h2>
              <div className="mud-userCard">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
                  alt="User"
                  className="mud-avatar"
                />
                <div>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Age:</strong> {user.age}</p>
                  <p><strong>Gender:</strong> {user.gender}</p>
                  <p><strong>Address:</strong> {user.address}</p>
                  <p><strong>Medical Conditions:</strong> {user.medicalConditions || "None"}</p>
                  <p><strong>Current Medications:</strong> {user.currentMedications || "None"}</p>
                  <p><strong>Emergency Contact:</strong> {user.phone}</p>
                </div>
              </div>
            </section>
          )}

          <section className="mud-medicineSection">
            <h2 className="mud-sectionTitle">💊 Medicine Scheduler</h2>
            <form onSubmit={handleAddMedicine} className="mud-form mud-medicineForm">
              <div className="mud-formGroup">
                <label className="mud-label">Medicine Name</label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol"
                  value={newMedicineName}
                  onChange={(e) => setNewMedicineName(e.target.value)}
                  className="mud-input"
                  required
                />
              </div>
              <div className="mud-formGroup">
                <label className="mud-label">Schedule</label>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <input
                      type="checkbox"
                      checked={isEveryday}
                      onChange={(e) => setIsEveryday(e.target.checked)}
                      style={{ marginRight: "0.3rem" }}
                    />
                    Everyday
                  </label>
                  {!isEveryday && (
                    <input
                      type="date"
                      value={newScheduleDate}
                      onChange={(e) => setNewScheduleDate(e.target.value)}
                      className="mud-input"
                      style={{ minWidth: 0 }}
                      required={!isEveryday}
                    />
                  )}
                  <input
                    type="time"
                    value={newScheduleTime}
                    onChange={(e) => setNewScheduleTime(e.target.value)}
                    className="mud-input"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="mud-button mud-addBtn">
                Add
              </button>
            </form>
            <h3 className="mud-medicineListTitle">Your Medicines</h3>
            <div className="mud-medicineListContainer" tabIndex={0} ref={medicineListRef}>
              {loading ? (
                <p style={{ color: "#fff" }}>Loading medicines...</p>
              ) : medicines.length > 0 ? (
                <ul className="mud-medicineList">
                  {medicines.map((med) => (
                    <li key={med.id} className="mud-medicineItem">
                      <span className="mud-pillIcon" role="img" aria-label="pill">
                        💊
                      </span>
                      <div>
                        <div>
                          <strong>{med.medicine_name}</strong>
                        </div>
                        <div className="mud-medicineDateTime">
                          {med.is_everyday
                            ? (
                              <>
                                everyday at <span className="mud-clockIcon" role="img" aria-label="clock">⏰</span>{med.schedule_time}
                              </>
                            ) : (
                              <>
                                <span className="mud-calendarIcon" role="img" aria-label="calendar">📅</span>
                                {med.schedule_date
                                  ? new Date(med.schedule_date).toLocaleDateString('en-CA')
                                  : ""}
                                <span className="mud-clockIcon" role="img" aria-label="clock" style={{marginLeft: 8}}>⏰</span>
                                {med.schedule_time}
                              </>
                            )
                          }
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#fff" }}>No medicines scheduled.</p>
              )}
            </div>
          </section>

          <section className="mud-doctorSection">
            <h2 className="mud-sectionTitle">🩺 Need Doctor's Help?</h2>
            <p style={{ color: "#fff", marginBottom: "0.7rem" }}>
              If you have any urgent medical queries, you can:
            </p>
            <ul className="mud-doctorList">
              <li>
                <a href="tel:112" className="mud-doctorLink">
                  <span role="img" aria-label="call">📞</span> Call Emergency Services (112)
                </a>
              </li>
              <li>
                <a href="mailto:doctor@mediseen.com" className="mud-doctorLink">
                  <span role="img" aria-label="mail">✉️</span> Email a Doctor
                </a>
              </li>
              <li>
                <a href="https://www.practo.com/consult" target="_blank" rel="noopener noreferrer" className="mud-doctorLink">
                  <span role="img" aria-label="consult">💬</span> Online Doctor Consultation
                </a>
              </li>
            </ul>
          </section>

          <section className="mud-tipsSection">
            <h2 className="mud-sectionTitle">🌟 Health Tips</h2>
            <ul className="mud-tipsList">
              {healthTips.map((tip, idx) => (
                <li key={idx} className="mud-tipItem">{tip}</li>
              ))}
            </ul>
          </section>

          <section className="mud-futureSection">
            <h2 className="mud-sectionTitle">🚀 Coming Soon</h2>
            <ul>
              <li>Medicine reminders via Gmail/Push Notification</li>
              <li>Doctor appointment scheduler</li>
              <li>And more!</li>
            </ul>
          </section>
          {error && <div className="mud-error">{error}</div>}
        </main>
      </div>
    </div>
  );
};

export default MainUserDashboard;
