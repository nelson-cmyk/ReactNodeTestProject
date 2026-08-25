import logo from "../assets/logo.png";
import "../css/Header.css";

function Header() {
    return (
        <nav className="ux4g-navbar">
            <div className="ux4g-container">
                <div className="ux4g-navbar-wrap">

                    {/* LEFT */}
                    <div className="ux4g-d-flex ux4g-ai-center ux4g-inline-gap-s">

                        <img
                            src={logo}
                            alt="Government Logo"
                            className="ux4g-navbar-logo"
                        />

                        <span className="ux4g-divider-vertical" />

                        <div className="ux4g-d-flex ux4g-flex-column">

                            <span className="ux4g-label-m-strong">
                                TEST PROJECT
                            </span>

                            <span className="ux4g-body-xs-default">
                                Department Name
                            </span>

                        </div>

                    </div>


                    {/* RIGHT */}
                    <a
                        href="#"
                        className="ux4g-label-l-default ux4g-text-link-md"
                    >
                        Help &amp; Support
                    </a>

                </div>
            </div>
        </nav>
    );
}

export default Header;