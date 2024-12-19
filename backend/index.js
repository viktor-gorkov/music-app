// Импорт переменных из .env
require('dotenv').config();

// Импорт модулей
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

dotenv.config(); // Загрузка переменных окружения

// Инициализация Express
const app = express();
const PORT = process.env.PORT || 5000;

// Настройка middleware
app.use(cors()); // CORS для разрешения кросс-доменных запросов
app.use(bodyParser.json()); // Парсиминг запросов в формате JSON

// Подключение к базе данных MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Подключение к MongoDB")) // Успешное подключение
    .catch((err) => console.error("Ошибка подключения к MongoDB:", err)); // Обработка ошибки подключения

// Базовый маршрут для проверки работы сервера
app.get("/", (req, res) => {
    res.send("Добро пожаловать в API!");
});

// Схема пользователя (email и пароль)
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true }, // Email должен быть уникальным и обязательным
    password: { type: String, required: true }, // Пароль обязателен
});

// Модель пользователя
const User = mongoose.model("User", userSchema);

// Регистрация нового пользователя
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) { // Проверка на наличие email и пароля
            return res.status(400).json({ message: "Email и пароль обязательны." });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword }); // Создание нового пользователя

        // Сохранение нового пользователя в базе данных
        await newUser.save();
        res.status(201).json({ message: "Пользователь успешно зарегистрирован." }); // Успешная регистрация
    } catch (err) {
        if (err.code === 11000) { // Проверка на повтор email
            res.status(400).json({ message: "Email уже зарегистрирован." });
        } else {
            res.status(500).json({ message: "Ошибка при регистрации пользователя." }); // Общая ошибка сервера
        }
    }
});

// Вход пользователя
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }); // Поиск пользователя по email
        if (!user) { // Пользователь не найден - ошибка
            return res.status(404).json({ message: "Пользователь не найден." });
        }

        // Сравнение предоставленного пароля с сохраненным хешированным паролем
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { // Пароли не совпадают - ошибка
            return res.status(401).json({ message: "Неверные данные для входа." });
        }

        // Генерация JWT-токена для пользователя
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Вход успешен.", token }); // Отправка токен при успешном входе
    } catch (err) {
        res.status(500).json({ message: "Ошибка при входе." }); // Ошибка сервера
    }
});

// Получение списка всех пользователей (без паролей)
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({}, "id email"); // Поиск всех пользователей
        res.json(users); // Отправка списка пользователей
    } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
        res.status(500).json({ message: "Ошибка сервера" }); // Обработка ошибки сервера
    }
});

// Получение данных пользователя по ID
app.get("/api/user/:id", async (req, res) => {
    try {
        const userId = req.params.id; // Получение ID пользователя из параметров URL
        const user = await User.findById(userId).select("id email"); // Поиск пользователя по ID, возврат только id и email

        if (!user) { // Пользователь не найден - ошибка
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        res.json(user); // Отправка данных пользователя
    } catch (error) {
        console.error("Ошибка при получении пользователя:", error);
        res.status(500).json({ message: "Ошибка сервера" }); // Обработка ошибки сервера
    }
});

// Обновление данных пользователя по ID
app.put('/api/user/:id', async (req, res) => {
    try {
        const userId = req.params.id; // Получение ID пользователя из параметров URL

        if (!mongoose.Types.ObjectId.isValid(userId)) { // Проверка, является ли ID пользователя действительным
            return res.status(400).json({ message: 'Неверный формат ID пользователя' });
        }

        const updatedData = req.body; // Получаем новые данные пользователя
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }); // Обновление пользователя в базе данных

        if (!updatedUser) { // Пользователь не найден - ошибка
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({
            message: 'Пользователь успешно обновлен',
            user: updatedUser, // Отправка новых данных пользователя
        });
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' }); // Ошибка сервера
    }
});

// Удаление пользователя по ID
app.delete('/api/user/:id', async (req, res) => {
    try {
        const userId = req.params.id; // Получение ID пользователя из параметров URL

        if (!mongoose.Types.ObjectId.isValid(userId)) { // Проверка, является ли ID пользователя действительным
            return res.status(400).json({ message: 'Неверный формат ID пользователя' });
        }

        const deletedUser = await User.findByIdAndDelete(userId); // Удаление пользователя из базы данных

        if (!deletedUser) { // Пользователь не найден - ошибка
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({
            message: 'Пользователь успешно удален',
            user: deletedUser, // Сообщение об удалении пользователя
        });
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' }); // Ошибка сервера
    }
});

// Запуск сервера Express
app.listen(PORT, () => console.log(`Сервер работает на http://localhost:${PORT}`));
