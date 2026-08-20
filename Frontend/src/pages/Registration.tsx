import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Registration.css";
import api from "../api/axios"

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


    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address.";

    if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number.";

    if (!formData.fullname)
      newErrors.fullname = "Full name is required.";

    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
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
        username : formData.fullname, // Generate username from full name
      }
    );


    console.log(response.data);
    alert("Registration Successful");
    navigate("/register");
  } catch (error) {
    console.error(error);
    alert("Registration Failed");
  }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>REGISTRATION </h2>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
             

          {/* Email and Mobile */}
          <div className="form-row">
            <div className="form-group">
              <label>Email address <span className="required">*</span></label>
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
              <label>Mobile Number <span className="required">*</span></label>
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Enter 10 digits mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                maxLength={10}
              />
              {errors.mobileNumber && <span className="error">{errors.mobileNumber}</span>}
            </div>
          </div>

          {/* Username and Password */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input
                type="text"
                name="fullname"
                placeholder="Enter full name"
                value={formData.fullname}
                onChange={handleChange}
              />
              {errors.fullname && <span className="error">{errors.fullname}</span>}
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
          </div>

          {/* Confirm Password */}
          <div className="form-row">
            <div className="form-group">
              <label>Confirm Password <span className="required">*</span></label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Submit */}
          <div className="form-submit">
          <button type="submit" className="submit-btn">SUBMIT</button> 
          
          </div>

        </form>
      </div>
    </div>
  );
}

export default Registration;