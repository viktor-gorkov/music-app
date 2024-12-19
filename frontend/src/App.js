import React, { useState } from "react";
import "./App.css";
import MusicPlayer from "./MusicPlayer"; // Добавляем компонент плеера

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState("Login");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const API_URL = process.env.REACT_APP_API_URL;

    const validateEmail = (email) => /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    const validatePassword = (password) => password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

    const handleRegister = async () => {
        if (!validateEmail(email)) {
            setError("Неверный формат электронной почты");
            return;
        }
        if (!validatePassword(password)) {
            setError("Пароль должен содержать минимум 8 символов, одну заглавную букву и одну цифру");
            return;
        }
        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Ошибка регистрации");
            }
            setError("");
            setIsAuthenticated(true);
            setCurrentPage("Home");
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            setError("Неверный формат электронной почты");
            return;
        }
        if (!password) {
            setError("Пароль не может быть пустым");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Ошибка входа");
            }
            setError("");
            setIsAuthenticated(true);
            setCurrentPage("Home");
        } catch (error) {
            setError(error.message);
        }
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
                        <h2>Вход</h2>
                        {error && <p className="error">{error}</p>}
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="Электронная почта"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button onClick={handleLogin} className="auth-btn">Войти</button>
                        <p>
                            Нет аккаунта?{" "}
                            <span onClick={() => setCurrentPage("Register")} className="link">Зарегистрироваться</span>
                        </p>
                    </section>
                );
            }
            if (currentPage === "Register") {
                return (
                    <section className="auth">
                        <h2>Регистрация</h2>
                        {error && <p className="error">{error}</p>}
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="Электронная почта"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Подтвердите пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button onClick={handleRegister} className="auth-btn">Зарегистрироваться</button>
                        <p>
                            Уже есть аккаунт?{" "}
                            <span onClick={() => setCurrentPage("Login")} className="link">Войти</span>
                        </p>
                    </section>
                );
            }
        }

        switch (currentPage) {
            case "Home":
                return (
                    <section className="home">
                        <h2>Добро пожаловать в Music Stream</h2>
                        <p>Откройте для себя любимую музыку и подкасты.</p>
                    </section>
                );
            case "Genres":
                return (
                    <section className="genres">
                        <h2>Жанры</h2>
                        <p>Исследуйте музыку по жанрам.</p>
                    </section>
                );
            case "My Collection":
                return (
                    <section className="collection">
                        <h2>Моя коллекция</h2>
                        <p>Ваши сохраненные треки, альбомы и плейлисты.</p>
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
                        <input type="text" placeholder="Поиск музыки или подкастов..." />
                    </div>
                    <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? "Светлая тема" : "Темная тема"}
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        Выйти
                    </button>
                </header>
            )}

            {/* Sidebar */}
            {isAuthenticated && (
                <aside className="sidebar">
                    <nav>
                        <ul>
                            <li onClick={() => setCurrentPage("Home")}>🏠 Главная</li>
                            <li onClick={() => setCurrentPage("Genres")}>🎵 Жанры</li>
                            <li onClick={() => setCurrentPage("My Collection")}>📂 Моя коллекция</li>
                        </ul>
                    </nav>
                </aside>
            )}

            {/* Main Content */}
            <main className="main-content">{renderContent()}</main>

            {/* Music Player */}
            {isAuthenticated && <MusicPlayer darkMode={darkMode} />}
        </div>
    );
}

export default App;
