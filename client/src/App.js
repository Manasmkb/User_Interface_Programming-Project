import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import NavbarComponent from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <div>
      <Navbar />

      <div className="main-container">
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  );
}

export default App;