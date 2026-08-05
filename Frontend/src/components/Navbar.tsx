import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Navbar.css";

interface Menu {
  id: number;
  menu_name: string;
  menu_path: string;
}

function Navbar() {

 
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchMenus = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/menus",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMenus(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMenus();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    
    <nav className="navbar">
      <div className="brand">
        <Link to="/"> TEST PROJECT</Link>
      </div>
     
      <ul className="nav-menu">
        <li>
          <Link to="/">Home</Link>
        </li>

        {menus.map((menu) => (
          <li key={menu.id}>
            <Link to={menu.menu_path}>
              {menu.menu_name}
            </Link>
          </li>
        ))}

        {isLoggedIn ? (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;