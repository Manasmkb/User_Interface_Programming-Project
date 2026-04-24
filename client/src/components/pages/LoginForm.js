import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../main";
import UserContext from "../../context/userContext";

const LoginForm = () => {
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");

    fetchData("/user/login", { username: formData.username, password: formData.password }, "POST")
    .then((data) => {
      const userId = data._id || data.id || "";
      const username = data.username || formData.username;

      if (!userId || !username) {
        setMessage("Login failed. Please try again.");
        return;
      }

      updateUser("userId", userId);
      updateUser("username", username);
      updateUser("authenticated", true);
      navigate("/profile");
    })
    .catch((err) => {
      setMessage(err?.error || err?.message || "Login failed. Please try again.");
    });
  };

  return (
    <div className="form-card">
      <h2 className="text-center">Welcome Back</h2>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="login-username">Username</label>
          <input 
            id="login-username"
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
          <label htmlFor="login-password">Password</label>
          <input 
            id="login-password" 
            name="password"
            type="password" 
            value={formData.password}
            onChange={handleChange}
            className="form-control input-style" 
            placeholder="Enter password" 
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 btn-style">Login</button>
        {message ? <p className="text-danger mt-2 mb-0">{message}</p> : null}
      </form>
    </div>
  );
};

export default LoginForm;