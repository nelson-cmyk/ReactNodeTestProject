import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Login.css";
import api from "../api/axios";

function Login() {
    const [activeTab, setActiveTab] = useState<"applicant" | "staff">(
        "applicant"
    );

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        captcha: "",
        otp: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [otpSent, setOtpSent] = useState(false);
    const [loginError, setLoginError] = useState("");

    // =====================================================
    // Handle input
    // =====================================================
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setLoginError("");
    };

    // =====================================================
    // Change Login Tab
    // =====================================================
    const handleTabChange = (
        tab: "applicant" | "staff"
    ) => {
        setActiveTab(tab);

        setFormData({
            email: "",
            password: "",
            captcha: "",
            otp: "",
        });

        setErrors({});
        setLoginError("");
        setOtpSent(false);
    };

    // =====================================================
    // Validate
    // =====================================================
    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email =
                activeTab === "staff"
                    ? "Username is required."
                    : "Email address is required.";
        } else if (
            activeTab === "applicant" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email =
                "Enter a valid email address.";
        }

        if (!formData.password) {
            newErrors.password =
                "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters.";
        }

        if (!formData.captcha) {
            newErrors.captcha =
                "Please enter the CAPTCHA.";
        } else if (
            formData.captcha.toUpperCase() !== "AB3X9"
        ) {
            newErrors.captcha =
                "Invalid CAPTCHA.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =====================================================
    // Send OTP
    // =====================================================
    const handleSendOtp = () => {
        if (!formData.email) {
            setErrors((prev) => ({
                ...prev,
                email:
                    "Enter your email address first.",
            }));
            return;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            )
        ) {
            setErrors((prev) => ({
                ...prev,
                email:
                    "Enter a valid email address.",
            }));
            return;
        }

        setOtpSent(true);

        alert(
            `OTP sent to ${formData.email}`
        );
    };

    // =====================================================
    // Login
    // =====================================================
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setLoginError("");

        if (!validate()) {
            return;
        }

        try {
            const response = await api.post(
                "/login",
                {
                    email: formData.email,
                    password: formData.password,
                }
            );

            // Store JWT
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Store user
            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data.user
                )
            );

            // Redirect
            window.location.href =
                "/dashboard";

        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            setLoginError(
                "Username or password is incorrect."
            );
        }
    };

    return (
        <section className="ux4g-identity-access-container">

          
            {/* =================================================
                MAIN LOGIN LAYOUT
            ================================================= */}
            <div className="ux4g-identity-access-layout">

                {/* =================================================
                    LEFT SIDEBAR
                ================================================= */}
                <div className="ux4g-identity-access-sidebar">

                    <div className="ux4g-sidebar-top">

                        <div className="ux4g-sidebar-logo-container">
                            <img
                                src="/assets/images/navbar-logo.svg"
                                alt="Government Logo"
                                className="ux4g-logo-white"
                            />
                        </div>

                        <h1>
                            Secure Digital Access to
                            Government Services
                        </h1>

                        <p>
                            Access certificates,
                            documents, and government
                            services securely through
                            a unified citizen login.
                        </p>

                    </div>

                    <div className="ux4g-sidebar-bottom">

                        <div className="ux4g-sidebar-stat">
                            <span>
                                TRUSTED BY
                            </span>

                            <strong>
                                Citizens
                            </strong>
                        </div>

                        <div className="ux4g-sidebar-stat">
                            <span>
                                AVAILABLE SERVICES
                            </span>

                            <strong>
                                Government Services
                            </strong>
                        </div>

                    </div>

                    {/* Decorative rings */}
                    <div className="ux4g-sidebar-ring ux4g-ring-1" />
                    <div className="ux4g-sidebar-ring ux4g-ring-2" />

                </div>

                {/* =================================================
                    RIGHT LOGIN PANEL
                ================================================= */}
                <div className="ux4g-identity-access-column">

                    <div className="ux4g-form-box">

                        {/* Heading */}
                        <h2>
                            Sign in to your account
                        </h2>

                        <p className="ux4g-form-subtitle">
                            Access your government
                            services securely
                        </p>

                        {/* =================================================
                            LOGIN TABS
                        ================================================= */}
                        <div className="ux4g-login-tabs">

                            <button
                                type="button"
                                className={
                                    activeTab ===
                                    "applicant"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleTabChange(
                                        "applicant"
                                    )
                                }
                            >
                                Applicant Login
                            </button>

                            <button
                                type="button"
                                className={
                                    activeTab ===
                                    "staff"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleTabChange(
                                        "staff"
                                    )
                                }
                            >
                                Staff Login
                            </button>

                        </div>

                        {/* =================================================
                            FORM
                        ================================================= */}
                        <form
                            className="ux4g-signin-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Username / Email */}
                            <div className="ux4g-input-container">

                                <label>
                                    {activeTab ===
                                    "staff"
                                        ? "Username"
                                        : "Email Address"}

                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <div className="ux4g-input">

                                    <input
                                        className="ux4g-input-input"
                                        type={
                                            activeTab ===
                                            "staff"
                                                ? "text"
                                                : "email"
                                        }
                                        name="email"
                                        placeholder={
                                            activeTab ===
                                            "staff"
                                                ? "Enter your username"
                                                : "Enter your email address"
                                        }
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                                {errors.email && (
                                    <span className="ux4g-error">
                                        {errors.email}
                                    </span>
                                )}

                            </div>

                            {/* Password */}
                            <div className="ux4g-input-container">

                                <label>
                                    Password
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <div className="ux4g-input">

                                    <input
                                        className="ux4g-input-input"
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={
                                            formData.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                                {errors.password && (
                                    <span className="ux4g-error">
                                        {errors.password}
                                    </span>
                                )}

                            </div>

                            {/* =================================================
                                LOGIN ERROR ALERT
                            ================================================= */}
                            {loginError && (
                                <div className="ux4g-alert ux4g-alert-error">

                                    <span className="ux4g-alert-icon">
                                        !
                                    </span>

                                    <div className="ux4g-alert-body">

                                        <span className="ux4g-alert-message">
                                            {loginError}
                                        </span>

                                        <div className="ux4g-alert-footer">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setLoginError("")
                                                }
                                            >
                                                Try again
                                            </button>

                                            <span>
                                                Attempt failed
                                            </span>

                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* =================================================
                                CAPTCHA
                            ================================================= */}
                            <div className="ux4g-input-container">

                                <label>
                                    CAPTCHA
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <div className="ux4g-captcha-row">

                                    <div className="ux4g-captcha-box">
                                        AB3X9
                                    </div>

                                    <input
                                        className="ux4g-input-input"
                                        type="text"
                                        name="captcha"
                                        placeholder="Enter CAPTCHA"
                                        value={
                                            formData.captcha
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        maxLength={5}
                                    />

                                </div>

                                {errors.captcha && (
                                    <span className="ux4g-error">
                                        {errors.captcha}
                                    </span>
                                )}

                            </div>

                            {/* =================================================
                                OTP
                            ================================================= */}
                            {activeTab ===
                                "applicant" && (
                                <div className="ux4g-input-container">

                                    <label>
                                        OTP
                                    </label>

                                    <div className="ux4g-otp-row">

                                        <input
                                            className="ux4g-input-input"
                                            type="text"
                                            name="otp"
                                            placeholder="Enter OTP"
                                            value={
                                                formData.otp
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            maxLength={6}
                                            disabled={
                                                !otpSent
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="ux4g-btn-secondary"
                                            onClick={
                                                handleSendOtp
                                            }
                                        >
                                            {otpSent
                                                ? "Resend OTP"
                                                : "Send OTP"}
                                        </button>

                                    </div>

                                </div>
                            )}

                            {/* =================================================
                                ACTIONS
                            ================================================= */}
                            <div className="ux4g-form-actions">

                                <button
                                    className="ux4g-btn-primary"
                                    type="submit"
                                >
                                    Sign In
                                </button>

                                <div className="ux4g-divider-horizontal">
                                    <span>
                                        OR
                                    </span>
                                </div>

                                <button
                                    className="ux4g-btn-outline-primary"
                                    type="button"
                                    onClick={() =>
                                        alert(
                                            "Aadhaar login will be available soon."
                                        )
                                    }
                                >
                                    Sign in with Aadhaar
                                </button>

                            </div>

                        </form>

                        {/* Registration */}
                        {activeTab ===
                            "applicant" && (
                            <div className="ux4g-register">

                                <Link to="/registration">
                                    New user? Register here
                                </Link>

                            </div>
                        )}

                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}
                    <div className="ux4g-form-footer">

                        <span>
                            Powered by -
                        </span>

                        <span className="ux4g-footer-brand">
                            NIC
                        </span>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Login;