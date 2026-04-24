import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../main';
import UserContext from '../../context/userContext';

const Register = () => {
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password2: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.password2) {
      setMessage("Passwords don't match!");
      return;
    }

    fetchData("/user/register", { username: formData.username, password: formData.password }, "POST")
    .then((data) => {
      updateUser("userId", data._id || data.id || "");
      updateUser("username", data.username || formData.username || "");
      updateUser("authenticated", false);
      navigate("/login");
    })  
    .catch((error) => {
      setMessage(error?.message || "Registration failed. Please try again.");
    });
  };

  return (
    <div className="form-card">
      <h2 className="text-center">Create Account</h2>

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="register-username">Username</label>
          <input 
            id="register-username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange} 
            className="form-control input-style" 
            placeholder="Enter username"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="register-password">Password</label>
          <input 
            id="register-password" 
            name="password"
            type="password" 
            value={formData.password}
            onChange={handleChange} 
            className="form-control input-style" 
            placeholder="Enter password" 
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="register-confirm-password">Confirm Password</label>
          <input 
            id="register-confirm-password" 
            name="password2"
            type="password" 
            value={formData.password2}
            onChange={handleChange} 
            className="form-control input-style" 
            placeholder="Confirm password" 
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100 btn-style">Register</button>
        {message ? <p className="text-danger mt-2 mb-0">{message}</p> : null}
      </form>
    </div>
  );
}

export default Register;