// src/LoginForm.js
import React from "react";

function LoginForm() {
  return (
    <div className="form-card">
      <h2 className="text-center">Welcome Back</h2>

      <form>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control input-style" placeholder="Enter email" />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control input-style" placeholder="Enter password" />
        </div>

        <button className="btn btn-primary w-100 btn-style">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;