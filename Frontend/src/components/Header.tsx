import logo from "../assets/logo.png";
import "../css/Header.css";

function Header() {
    return (
        <nav className="ux4g-header">
            <div className="ux4g-header-container">
                <div className="ux4g-header-wrap">

                    {/* LEFT */}
                    <div className="ux4g-header-left">
                        <img
                            src={logo}
                            alt="Government Logo"
                            className="ux4g-header-logo"
                        />

                        <span className="ux4g-header-divider" />

                        <div className="ux4g-header-title">
                            <span className="ux4g-header-project">
                                TEST PROJECT
                            </span>

                            <span className="ux4g-header-department">
                                Department Name
                            </span>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <a
                        href="#"
                        className="ux4g-header-help"
                    >
                        Help &amp; Support
                    </a>

                </div>
            </div>
        </nav>
    );
}

export default Header;