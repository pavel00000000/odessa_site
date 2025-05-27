const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');

dotenv.config();

const app = express();
const port = 3000;

// Настройка Telegram-бота
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
const chatId = process.env.CHAT_ID;

// Настройка multer
const upload = multer();

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Обработка формы заявки
app.post('/submit', upload.none(), (req, res) => {
    console.log('Полученные данные (submit):', req.body);
    const { name, age, phone, city } = req.body;

    if (!name || !age || !phone || !city) {
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!age) missingFields.push('age');
        if (!phone) missingFields.push('phone');
        if (!city) missingFields.push('city');
        console.error('Ошибка: пустые поля:', missingFields);
        return res.status(400).json({ error: `Все поля обязательны для заполнения. Пропущены: ${missingFields.join(', ')}` });
    }

    const phoneRegex = /^\+380[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        console.error('Неверный формат телефона:', phone);
        return res.status(400).json({ error: 'Неверный формат телефона. Используйте +380XXXXXXXXX' });
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
        console.error('Неверный возраст:', age);
        return res.status(400).json({ error: 'Возраст должен быть числом от 16 до 100' });
    }

    const message = `Новая заявка:\nИмя: ${name}\nВозраст: ${age}\nТелефон: ${phone}\nГород: ${city}`;

    bot.sendMessage(chatId, message)
        .then(() => res.status(200).json({ message: 'Заявка успешно отправлена' }))
        .catch((error) => {
            console.error('Ошибка отправки в Telegram:', error);
            res.status(500).json({ error: 'Ошибка сервера при отправке заявки' });
        });
});

// Обработка формы обратного звонка
app.post('/callback', upload.none(), (req, res) => {
    console.log('Полученные данные (callback):', req.body);
    const { name, phone } = req.body;

    // Проверка на пустые поля
    if (!name || !phone) {
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!phone) missingFields.push('phone');
        console.error('Ошибка: пустые поля:', missingFields);
        return res.status(400).json({ error: `Все поля обязательны для заполнения. Пропущены: ${missingFields.join(', ')}` });
    }

    // Проверка формата телефона
    const phoneRegex = /^\+380[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        console.error('Неверный формат телефона:', phone);
        return res.status(400).json({ error: 'Неверный формат телефона. Используйте +380XXXXXXXXX' });
    }

    // Проверка имени (например, минимум 2 символа, только буквы и пробелы)
    const nameRegex = /^[A-Za-zА-Яа-я\s]{2,}$/;
    if (!nameRegex.test(name)) {
        console.error('Неверный формат имени:', name);
        return res.status(400).json({ error: 'Имя должно содержать минимум 2 буквы и только буквы или пробелы' });
    }

    const message = `Запрос на звонок:\nИмя: ${name}\nТелефон: ${phone}`; // Исправлено: добавлено поле name

    bot.sendMessage(chatId, message)
        .then(() => res.status(200).json({ message: 'Запрос на звонок отправлен' }))
        .catch((error) => {
            console.error('Ошибка отправки в Telegram:', error);
            return res.status(500).json({ error: 'Ошибка сервера при отправке запроса' });
        });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});