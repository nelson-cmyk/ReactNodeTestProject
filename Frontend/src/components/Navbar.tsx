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

        <nav className="ux4g-navbar">

            <div className="ux4g-container">

                <div className="ux4g-navbar-wrap">


                    {/* =================================================
                        LEFT / HOME
                    ================================================= */}

                    <div className="ux4g-navbar-left">

                        <Link
                            to="/"
                            className="ux4g-navbar-home"
                        >
                            Home
                        </Link>

                    </div>


                    {/* =================================================
                        MENU LINKS
                    ================================================= */}

                    <ul className="ux4g-navbar-links">

                        {menus.map((menu) => (

                            <li key={menu.id}>

                                <Link to={menu.menu_path}>
                                    {menu.menu_name}
                                </Link>

                            </li>

                        ))}


                        {/* =================================================
                            LOGIN / LOGOUT
                        ================================================= */}

                        {isLoggedIn ? (

                            <li>

                                <button
                                    type="button"
                                    className="logout-btn"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>

                            </li>

                        ) : (

                            <li>

                                <Link
                                    to="/login"
                                    className="login-link"
                                >
                                    Login
                                </Link>

                            </li>

                        )}

                    </ul>

                </div>

            </div>

        </nav>

    );
}

export default Navbar;