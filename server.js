const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Проверка переменных окружения
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? 'Loaded' : 'Not loaded');
console.log('CHAT_ID:', process.env.CHAT_ID ? 'Loaded' : 'Not loaded');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
const chatId = process.env.CHAT_ID;

// Middleware
app.use(cors({ origin: 'https://work.odessa.ua' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
const upload = multer();

// Корневой маршрут
app.get('/', (req, res) => {
    console.log('GET / requested');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Маршрут для privacy.html
app.get('/privacy.html', (req, res) => {
    console.log('GET /privacy.html requested');
    res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

// Редирект для /public/privacy.html
app.get('/public/privacy.html', (req, res) => {
    console.log('Redirecting /public/privacy.html to /privacy.html');
    res.redirect('/privacy.html');
});

// Форма заявки
app.post('/submit', upload.none(), async (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Body (submit):', req.body);
    const { name, age, phone, city } = req.body;
    if (!name || !age || !phone || !city) {
        console.log('Ошибка: одно или несколько полей пустые', req.body);
        return res.status(400).json({ error: 'Все поля должны быть заполнены' });
    }
    const cleanedPhone = phone.replace(/[\s()-]/g, '');
    const phoneRegex = /^\+380[0-9]{9}$/;
    if (!phoneRegex.test(cleanedPhone)) {
        console.log('Ошибка: Неверный формат телефона', req.body);
        return res.status(400).json({ error: 'Неверный формат телефона. Используйте +380XXXXXXXXX.' });
    }
    const message = `Новая заявка:\nИмя: ${name}\nВозраст: ${age}\nТелефон: ${cleanedPhone}\nГород: ${city}`;
    try {
        await bot.sendMessage(chatId, message);
        console.log('Сообщение успешно отправлено в Telegram (submit)');
        res.status(200).json({ message: 'Заявка успешно отправлена!' });
    } catch (error) {
        console.error('Ошибка Telegram (submit):', error.response?.body || error.message);
        res.status(500).json({ error: 'Ошибка сервера при отправке заявки.' });
    }
});

// Форма обратного звонка
app.post('/callback', upload.none(), async (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Body (callback):', req.body);
    const { name, phone } = req.body;
    if (!name || !phone) {
        console.log('Ошибка: поля имени или телефона пустые', req.body);
        return res.status(400).json({ error: 'Поля имени и телефона должны быть заполнены' });
    }
    const cleanedPhone = phone.replace(/[\s()-]/g, '');
    const phoneRegex = /^\+380[0-9]{9}$/;
    if (!phoneRegex.test(cleanedPhone)) {
        console.log('Ошибка: Неверный формат телефона', req.body);
        return res.status(400).json({ error: 'Неверный формат телефона. Используйте +380XXXXXXXXX.' });
    }
    const message = `Запрос на звонок:\nИмя: ${name}\nТелефон: ${cleanedPhone}`;
    try {
        await bot.sendMessage(chatId, message);
        console.log('Сообщение успешно отправлено в Telegram (callback)');
        res.status(200).json({ message: 'Запрос на звонок отправлен!' });
    } catch (error) {
        console.error('Ошибка Telegram (callback):', error.response?.body || error.message);
        res.status(500).json({ error: 'Ошибка сервера при отправке запроса.' });
    }
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Запуск сервера
app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер запущен и слушает порт ${port}`);
});