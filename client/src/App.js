import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/pages/Navbar.js';
import Register from './components/pages/Register.js';
import LoginForm from './components/pages/LoginForm.js';
import Profile from './components/pages/Profile.js';
import ReactionGame from './components/pages/ReactionGame.js';
import { UserProvider } from './context/userContext';

const Home = () => (
  <div className="main-container">
    <section className="home-hero">
      <p className="home-kicker">Social Space Reimagined</p>
      <h1 className="home-title">Build Your Voice. Grow Your Circle.</h1>
      <p className="home-subtitle">
        A clean, distraction-free place to post updates, connect with people, and keep your ideas alive.
      </p>
      <div className="home-actions">
        <Link className="btn btn-lg home-btn home-btn-play" to="/reaction-game">Play color clash: GAME</Link>
        <Link className="btn btn-primary btn-lg home-btn" to="/register">Get Started</Link>
        <Link className="btn btn-outline-primary btn-lg home-btn" to="/login">Login</Link>
      </div>
    </section>
  </div>
);

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app-shell">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reaction-game" element={<ReactionGame />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;