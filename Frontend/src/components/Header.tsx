import logo from "../assets/logo.png";
import "../css/Layout.css";

function Header() {
  return (
    <header className="portal-header">
      <div className="header-overlay"></div>

      <div className="header-content">
        <div className="header-left">
          <img
            src={logo}
            alt="Government Logo"
            className="logo"
          />

          <div className="title-section">
            <h1>TEST PROJECT</h1>
            <h3>Department Name</h3>
            <p>Government of West Bengal</p>
          </div>
        </div>

        <div className="header-right">
          <div className="counter-card">
            <span>Visitors</span>
            <strong>1,25,489</strong>
          </div>

          <input
            type="text"
            placeholder="🔍 Search..."
            className="search-box"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;