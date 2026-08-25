import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/Registration.css";
import api from "../api/axios";

function Registration() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        mobileNumber: "",
        fullname: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (
            !formData.email ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Enter a valid email address.";
        }

        if (
            !formData.mobileNumber ||
            !/^\d{10}$/.test(formData.mobileNumber)
        ) {
            newErrors.mobileNumber =
                "Enter a valid 10-digit mobile number.";
        }

        if (!formData.fullname.trim()) {
            newErrors.fullname = "Full name is required.";
        }

        if (
            !formData.password ||
            formData.password.length < 6
        ) {
            newErrors.password =
                "Password must be at least 6 characters.";
        }

        if (
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword =
                "Passwords do not match.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: "",
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const response = await api.post(
                "/register",
                {
                    full_name: formData.fullname,
                    email: formData.email,
                    password: formData.password,
                    phone_number: formData.mobileNumber,
                    username: formData.fullname,
                }
            );

            console.log(response.data);

            alert("Registration Successful");

            // Go to login after successful registration
            navigate("/login");

        } catch (error) {
            console.error(error);

            alert("Registration Failed");
        }
    };

    return (
         <section className="ux4g-identity-access-container">

            {/* =====================================================
                MAIN LAYOUT
            ===================================================== */}

            <div className="ux4g-identity-access-layout">


                {/* =================================================
                    LEFT PANEL
                ================================================= */}

                <div className="
                    ux4g-identity-access-sidebar
                    ux4g-d-flex
                    ux4g-sm-d-none
                    ux4g-flex-column
                    ux4g-jc-between
                ">

                    <div className="ux4g-sidebar-top">

                        <div className="ux4g-sidebar-logo-container ux4g-mb-xl">

                            <div className="ux4g-sidebar-logo-placeholder">
                                LOGO
                            </div>

                        </div>


                        <h1 className="
                            ux4g-heading-l-default
                            ux4g-mb-m
                        ">
                            Secure Digital Access to Government Services
                        </h1>


                        <p className="
                            ux4g-body-l-default
                            ux4g-text-neutral-inverse
                        ">
                            Create your account to access government
                            services, submit applications, track
                            applications and manage your digital
                            services securely.
                        </p>

                    </div>


                    {/* SIDEBAR INFORMATION */}

                    <div className="
                        ux4g-sidebar-bottom
                        ux4g-d-flex
                        ux4g-inline-gap-s
                    ">

                        <div className="ux4g-sidebar-stat">

                            <span className="
                                ux4g-label-s-default
                                ux4g-text-neutral-inverse
                            ">
                                TRUSTED BY
                            </span>

                            <span className="
                                ux4g-label-l-default
                                ux4g-text-neutral-inverse
                            ">
                                Citizens
                            </span>

                        </div>


                        <div className="ux4g-sidebar-stat">

                            <span className="
                                ux4g-label-s-default
                                ux4g-text-neutral-inverse
                            ">
                                AVAILABLE SERVICES
                            </span>

                            <span className="
                                ux4g-label-l-default
                                ux4g-text-neutral-inverse
                            ">
                                Multiple Services
                            </span>

                        </div>

                    </div>


                    {/* DECORATIVE CIRCLES */}

                    <div className="
                        ux4g-sidebar-ring
                        ux4g-ring-1
                    />

                    <div className="
                        ux4g-sidebar-ring
                        ux4g-ring-2
                        ux4g-sidebar-ring-bottom
                    />

                </div>


                {/* =================================================
                    RIGHT PANEL
                ================================================= */}

                <div className="
                    ux4g-identity-access-column
                    ux4g-d-flex
                    ux4g-ai-center
                    ux4g-jc-center
                    ux4g-flex-column
                ">


                    {/* FORM BOX */}

                    <div className="ux4g-form-box">

                        <h2 className="
                            ux4g-heading-l-default
                            ux4g-text-neutral-primary
                            ux4g-mb-xs
                        ">
                            Create your account
                        </h2>


                        <p className="
                            ux4g-body-s-default
                            ux4g-text-neutral-secondary
                            ux4g-mb-2xl
                        ">
                            Enter your details to create your account
                        </p>


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            className="
                                ux4g-signin-form
                                ux4g-d-flex
                                ux4g-flex-column
                                ux4g-stack-gap-m
                            "
                            onSubmit={handleSubmit}
                        >


                            {/* EMAIL */}

                            <div className="
                                ux4g-input-container
                                ux4g-input-lg
                            ">

                                <label
                                    className="
                                        ux4g-label-l-default
                                        ux4g-mb-2xs
                                    "
                                    htmlFor="email"
                                >
                                    Email Address
                                    <span className="ux4g-required">
                                        *
                                    </span>
                                </label>


                                <div className="ux4g-input">

                                    <input
                                        className="ux4g-input-input"
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter valid email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />

                                </div>


                                {errors.email && (
                                    <div className="ux4g-registration-error">
                                        {errors.email}
                                    </div>
                                )}

                            </div>


                            {/* MOBILE */}

                            <div className="
                                ux4g-input-container
                                ux4g-input-lg
                            ">

                                <label
                                    className="
                                        ux4g-label-l-default
                                        ux4g-mb-2xs
                                    "
                                    htmlFor="mobileNumber"
                                >
                                    Mobile Number
                                    <span className="ux4g-required">
                                        *
                                    </span>
                                </label>


                                <div className="ux4g-input">

                                    <span className="ux4g-input-prefix">
                                        +91
                                    </span>

                                    <input
                                        className="ux4g-input-input"
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder="Enter 10 digit mobile number"
                                        value={formData.mobileNumber}
                                        onChange={(e) => {

                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );

                                            setFormData({
                                                ...formData,
                                                mobileNumber: value,
                                            });

                                            setErrors({
                                                ...errors,
                                                mobileNumber: "",
                                            });

                                        }}
                                    />

                                </div>


                                {errors.mobileNumber && (
                                    <div className="ux4g-registration-error">
                                        {errors.mobileNumber}
                                    </div>
                                )}

                            </div>


                            {/* FULL NAME */}

                            <div className="
                                ux4g-input-container
                                ux4g-input-lg
                            ">

                                <label
                                    className="
                                        ux4g-label-l-default
                                        ux4g-mb-2xs
                                    "
                                    htmlFor="fullname"
                                >
                                    Full Name
                                    <span className="ux4g-required">
                                        *
                                    </span>
                                </label>


                                <div className="ux4g-input">

                                    <input
                                        className="ux4g-input-input"
                                        id="fullname"
                                        name="fullname"
                                        type="text"
                                        placeholder="Enter full name"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                    />

                                </div>


                                {errors.fullname && (
                                    <div className="ux4g-registration-error">
                                        {errors.fullname}
                                    </div>
                                )}

                            </div>


                            {/* PASSWORD */}

                            <div className="
                                ux4g-input-container
                                ux4g-input-lg
                            ">

                                <label
                                    className="
                                        ux4g-label-l-default
                                        ux4g-mb-2xs
                                    "
                                    htmlFor="password"
                                >
                                    Password
                                    <span className="ux4g-required">
                                        *
                                    </span>
                                </label>


                                <div className="ux4g-input">

                                    <input
                                        className="ux4g-input-input"
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />

                                </div>


                                {errors.password && (
                                    <div className="ux4g-registration-error">
                                        {errors.password}
                                    </div>
                                )}

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="
                                ux4g-input-container
                                ux4g-input-lg
                            ">

                                <label
                                    className="
                                        ux4g-label-l-default
                                        ux4g-mb-2xs
                                    "
                                    htmlFor="confirmPassword"
                                >
                                    Confirm Password
                                    <span className="ux4g-required">
                                        *
                                    </span>
                                </label>


                                <div className="ux4g-input">

                                    <input
                                        className="ux4g-input-input"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />

                                </div>


                                {errors.confirmPassword && (
                                    <div className="ux4g-registration-error">
                                        {errors.confirmPassword}
                                    </div>
                                )}

                            </div>


                            {/* SUBMIT */}

                            <div className="
                                ux4g-form-actions
                                ux4g-d-flex
                                ux4g-flex-column
                                ux4g-gap-xs
                            ">

                                <button
                                    className="
                                        ux4g-btn-primary
                                        ux4g-btn-lg
                                    "
                                    type="submit"
                                >
                                    Create Account
                                </button>

                            </div>

                        </form>


                        {/* LOGIN */}

                        <div className="
                            ux4g-text-center
                            ux4g-mt-2xl
                        ">

                            <button
                                type="button"
                                className="
                                    ux4g-text-link
                                    ux4g-label-xl-default
                                    ux4g-link-button
                                "
                                onClick={() => navigate("/login")}
                            >
                                Already have an account? Sign in
                            </button>

                        </div>

                    </div>


                    
                </div>

            </div>

        </section>
    );
}

export default Registration;