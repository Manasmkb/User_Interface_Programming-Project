// src/RegisterForm.js
import React from "react";

function RegisterForm() {
  return (
    <div className="form-card">
      <h2 className="text-center">Create Account</h2>

      <form>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control input-style" placeholder="Enter email" />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control input-style" placeholder="Enter password" />
        </div>

        <div className="mb-3">
          <label>Confirm Password</label>
          <input type="password" className="form-control input-style" placeholder="Confirm password" />
        </div>

        <button className="btn btn-success w-100 btn-style">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;