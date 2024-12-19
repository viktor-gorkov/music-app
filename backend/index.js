require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Routes
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: "Email already registered." });
        } else {
            res.status(500).json({ message: "Error registering user." });
        }
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful.", token });
    } catch (err) {
        res.status(500).json({ message: "Error logging in." });
    }
});

app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({}, "id email"); // Получаем только id и email
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/api/user/:id", async (req, res) => {
    try {
        const userId = req.params.id; // Получаем id из параметров маршрута
        const user = await User.findById(userId).select("id email"); // Ищем пользователя по ID, возвращаем только id и email

        if (!user) {
            return res.status(404).json({ message: "User not found" }); // Если пользователь не найден
        }

        res.json(user); // Отправляем найденного пользователя
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" }); // Ошибка сервера
    }
});

app.put('/api/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Проверяем корректность ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const updatedData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
            new: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.delete('/api/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Проверка корректности ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User deleted successfully',
            user: deletedUser,
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
