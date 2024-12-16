import React, { useState } from "react";
import "./App.css";

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState("Login");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    };

    const handleRegister = () => {
        if (!validateEmail(email)) {
            setError("Invalid email format");
            return;
        }
        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long, contain a number and an uppercase letter");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        setIsAuthenticated(true);
        setCurrentPage("Home");
    };

    const handleLogin = () => {
        if (!validateEmail(email)) {
            setError("Invalid email format");
            return;
        }
        if (!password) {
            setError("Password cannot be empty");
            return;
        }
        setError("");
        setIsAuthenticated(true);
        setCurrentPage("Home");
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage("Login");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError("");
    };

    const renderContent = () => {
        if (!isAuthenticated) {
            if (currentPage === "Login") {
                return (
                    <section className="auth">
                        <h2>Login</h2>
                        {error && <p className="error">{error}</p>}
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button onClick={handleLogin} className="auth-btn">Login</button>
                        <p>
                            Don't have an account? <span onClick={() => setCurrentPage("Register")} className="link">Register</span>
                        </p>
                    </section>
                );
            }
            if (currentPage === "Register") {
                return (
                    <section className="auth">
                        <h2>Register</h2>
                        {error && <p className="error">{error}</p>}
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button onClick={handleRegister} className="auth-btn">Register</button>
                        <p>
                            Already have an account? <span onClick={() => setCurrentPage("Login")} className="link">Login</span>
                        </p>
                    </section>
                );
            }
        }

        switch (currentPage) {
            case "Home":
                return (
                    <section className="home">
                        <h2>Welcome to Music Stream</h2>
                        <p>Discover your favorite music and podcasts.</p>
                    </section>
                );
            case "Genres":
                return (
                    <section className="genres">
                        <h2>Genres</h2>
                        <p>Explore music by genre.</p>
                    </section>
                );
            case "My Collection":
                return (
                    <section className="collection">
                        <h2>My Collection</h2>
                        <p>Your saved tracks, albums, and playlists.</p>
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <div className={darkMode ? "app dark-mode" : "app"}>
            {/* Header */}
            {isAuthenticated && (
                <header className="header">
                    <h1>Music Stream</h1>
                    <div className="search">
                        <input type="text" placeholder="Search music or podcasts..." />
                    </div>
                    <button
                        className="theme-toggle"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </header>
            )}

            {/* Sidebar */}
            {isAuthenticated && (
                <aside className="sidebar">
                    <nav>
                        <ul>
                            <li onClick={() => setCurrentPage("Home")}>🏠 Home</li>
                            <li onClick={() => setCurrentPage("Genres")}>🎵 Genres</li>
                            <li onClick={() => setCurrentPage("My Collection")}>📂 My Collection</li>
                        </ul>
                    </nav>
                </aside>
            )}

            {/* Main Content */}
            <main className="main-content">{renderContent()}</main>

            {/* Music Player */}
            {isAuthenticated && (
                <footer className="player">
                    <div className="track-info">
                        <img src="https://via.placeholder.com/50" alt="Track Cover" />
                        <div>
                            <p>Track Name</p>
                            <p>Artist Name</p>
                        </div>
                    </div>
                    <div className="controls">
                        <button>⏪</button>
                        <button>⏯</button>
                        <button>⏩</button>
                    </div>
                    <div className="progress-bar">
                        <input type="range" min="0" max="100" value="50" />
                    </div>
                </footer>
            )}
        </div>
    );
}

export default App;
