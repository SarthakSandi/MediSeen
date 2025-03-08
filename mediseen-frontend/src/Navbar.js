import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear JWT token from storage
    navigate("/"); // Redirect to landing page
  };

  return (
    <nav>
      <h2>Mediseen</h2>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
