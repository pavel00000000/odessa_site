const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Добавляем модуль path
const multer = require('multer');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
const chatId = process.env.CHAT_ID;

// Middleware
app.use(cors({ origin: 'https://odessa-site.onrender.com' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Статические файлы
const upload = multer(); // Для обработки multipart/form-data

// Корневой маршрут
app.get('/', (req, res) => {
    console.log('GET / requested');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Форма заявки
app.post('/submit', upload.none(), (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Body (submit):', req.body);
    const { name, age, phone, city } = req.body;
    if (!name || !age || !phone || !city) {
        console.log('Ошибка: одно или несколько полей пустые', req.body);
        return res.status(400).json({ error: 'Все поля должны быть заполнены' });
    }
    const message = `Новая заявка:\nИмя: ${name}\nВозраст: ${age}\nТелефон: ${phone}\nГород: ${city}`;
    bot.sendMessage(chatId, message)
        .then(() => res.status(200).json({ message: 'Заявка отправлена' }))
        .catch((error) => {
            console.error('Ошибка Telegram:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        });
});

// Форма обратного звонка
app.post('/callback', upload.none(), (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Body (callback):', req.body);
    const { phone } = req.body;
    if (!phone) {
        console.log('Ошибка: поле телефона пустое', req.body);
        return res.status(400).json({ error: 'Поле телефона должно быть заполнено' });
    }
    const message = `Запрос на звонок:\nТелефон: ${phone}`;
    bot.sendMessage(chatId, message)
        .then(() => res.status(200).json({ message: 'Запрос отправлен' }))
        .catch((error) => {
            console.error('Ошибка Telegram:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер запущен и слушает порт ${port}`);
});