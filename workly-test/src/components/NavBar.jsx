import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/NavBar.css";

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">Workly</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {loggedIn && <li><Link to="/profile/me">Profile</Link></li>}
      </ul>

      <div className="auth-buttons">
        {loggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="join-btn">Join</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
