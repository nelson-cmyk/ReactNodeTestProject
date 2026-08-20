import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"applicant" | "staff">("applicant");

  const [formData, setFormData] = useState({
    
    email: "",
    password: "",
    captcha: "AB3X9",
    otp: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

   if (
  !formData.email ||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
) {
  newErrors.email = "Enter a valid email address.";
}

    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (!formData.captcha)
      newErrors.captcha = "Please enter the CAPTCHA.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors({ ...errors, email: "Enter a valid email to receive OTP." });
      return;
    }
    setOtpSent(true);
    alert(`OTP sent to ${formData.email}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    const response = await api.post(
  "/login",
  {
    email: formData.email,
    password: formData.password,
  }
);
   

    // Store JWT token
    localStorage.setItem("token", response.data.token);

    // Store user details (optional)
    localStorage.setItem("user", JSON.stringify(response.data.user));
//
//    alert("Login Successful");
    window.location.href = "/dashboard";
  } catch (error) {
    console.error(error);
    alert("Invalid email/username or password");
  }
};

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-header">
          <h2>USER LOGIN</h2>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${activeTab === "applicant" ? "active" : ""}`}
            onClick={() => { setActiveTab("applicant"); setErrors({}); }}
          >
            Applicant Login
          </button>
          <button
            className={`login-tab ${activeTab === "staff" ? "active" : ""}`}
            onClick={() => { setActiveTab("staff"); setErrors({}); }}
          >
            Staff Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          {/* Applicant Login */}
          {activeTab === "applicant" && (
            <>
              <div className="form-group">
                <label>Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter valid email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>

              <div className="form-group otp-group">
                <label>OTP</label>
                <div className="otp-row">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength={6}
                    disabled={!otpSent}
                  />
                  <button type="button" className="otp-btn" onClick={handleSendOtp}>
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Staff Login */}
          {activeTab === "staff" && (
            <>
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>
            </>
          )}

          {/* CAPTCHA - both tabs */}
          <div className="form-group captcha-group">
            <label>CAPTCHA <span className="required">*</span></label>
            <div className="captcha-row">
              <div className="captcha-box">AB3X9</div>
              <input
                type="text"
                name="captcha"
                placeholder="Enter CAPTCHA"
                value={formData.captcha}
                onChange={handleChange}
                maxLength={5}
              />
            </div>
            {errors.captcha && <span className="error">{errors.captcha}</span>}
          </div>

          <div className="login-actions">
            <button
              type="button"
              className="forgot-link"
              onClick={() => alert("Please contact support to recover your password.")}
            >
              Forgot Password?
            </button>
            <button type="submit" className="login-btn">LOGIN</button>
          </div>

          {activeTab === "applicant" && (
            <p className="register-link">
              Don't have an account?{" "}
              <Link to="/registration">Register here</Link>
            </p>
          )}

        </form>
      </div>
    </div>
  );
}

export default Login;