import React, { useState } from "react";
import "./App.css";
import MusicPlayer from "./MusicPlayer"; // Компонент плеера

function App() {
    // Состояние для переключения темной/светлой темы
    const [darkMode, setDarkMode] = useState(false);

    // Состояние для текущей страницы
    const [currentPage, setCurrentPage] = useState("Login");

    // Состояние для аутентификации пользователя
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Состояния для хранения email, пароля и подтверждения пароля
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Состояние для хранения ошибок
    const [error, setError] = useState("");

    // API URL для доступа к серверу
    const API_URL = process.env.REACT_APP_API_URL;

    // Функция для валидации email
    const validateEmail = (email) => /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    // Функция для валидации пароля
    const validatePassword = (password) => password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

    // Обработка регистрации
    const handleRegister = async () => {
        // Проверка email
        if (!validateEmail(email)) {
            setError("Неверный формат электронной почты");
            return;
        }
        // Проверка пароля
        if (!validatePassword(password)) {
            setError("Пароль должен содержать минимум 8 символов, одну заглавную букву и одну цифру");
            return;
        }
        // Проверка (пароля == подтверждение пароля)
        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        // Отправка данных на сервер для регистрации
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
            setError(""); // Удаление ошибки при успешной регистрации
            setIsAuthenticated(true); // Пользователь аутентифицирован
            setCurrentPage("Home"); // Перевод на главную страницу
        } catch (error) {
            setError(error.message); // Если что-то пошло не так - ошибка
        }
    };

    // Обработка входа в систему
    const handleLogin = async () => {
        // Проверка email
        if (!validateEmail(email)) {
            setError("Неверный формат электронной почты");
            return;
        }
        // Проверка (пароль != "")
        if (!password) {
            setError("Пароль не может быть пустым");
            return;
        }

        // Отправка данных на сервер для входа
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
            setError(""); // Удаление ошибки при успешном входе
            setIsAuthenticated(true); // Пользователь аутентифицирован
            setCurrentPage("Home"); // Перевод на главную страницу
        } catch (error) {
            setError(error.message); // Если что-то пошло не так - ошибка
        }
    };

    // Обработка выхода из аккаунта
    const handleLogout = () => {
        setIsAuthenticated(false); // Остановка аутентификации
        setCurrentPage("Login"); // Возврат на страницу входа
        setEmail(""); // Очистка email
        setPassword(""); // Очистка пароль
        setConfirmPassword(""); // Очистка подтверждения пароля
        setError(""); // Удаление ошибок
    };

    // Рендеринг содержимого на текущей страницы
    const renderContent = () => {
        if (!isAuthenticated) {
            // Пользователь не аутентифицирован = страница входа/регистрации
            if (currentPage === "Login") {
                return (
                    <section className="auth">
                        <h2>Вход</h2>
                        {error && <p className="error">{error}</p>} {/* Ошибка, если есть */}
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="Электронная почта"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Обновление email
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Обновление пароля
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
                        {error && <p className="error">{error}</p>} {/* Ошибка, если есть */}
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="Электронная почта"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Обновление email
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Обновление пароля
                            />
                            <input
                                type="password"
                                placeholder="Подтвердите пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} // Обновление подтверждения пароля
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

        // Отображение контента на основе текущей страницы
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
        <div className={darkMode ? "app dark-mode" : "app"}> {/* Переключение темы */}
            {isAuthenticated && (
                <header className="header">
                    <h1>Music Stream</h1>
                    <div className="search">
                        <input type="text" placeholder="Поиск музыки или подкастов..." />
                    </div>
                    <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? "Светлая тема" : "Темная тема"} {/* Переключение темы */}
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        Выйти {/* Кнопка выхода из аккаунта */}
                    </button>
                </header>
            )}

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

            <main className="main-content">{renderContent()}</main> {/* Рендер контент страницы */}

            {isAuthenticated && <MusicPlayer darkMode={darkMode} />} {/* Интеграция плеера */}
        </div>
    );
}

export default App;
