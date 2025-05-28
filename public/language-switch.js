document.addEventListener('DOMContentLoaded', () => {
    const languageSwitch = document.getElementById('language-switch');
    let currentLanguage = 'ru'; // Изначально русский язык

    // Объект с переводами
    const translations = {
        ru: {
            title: 'Посейдон - Начни новую жизнь у моря',
            navAbout: 'О нас',
            navAdvantages: 'Преимущества',
            navContact: 'Оставить заявку',
            heroTitle: 'Начни новую жизнь у моря',
            heroText1: 'Наша команда в поисках менеджера по работе с клиентами.',
            heroText2: 'Обучение, жилье, переезд — за наш счёт.',
            heroText3: 'Работа в уютном офисе Одессы.',
            notRemote: 'НЕ удалённо!',
            heroButton: 'Оставить заявку', // Кнопка в hero
            poseidonAnimation: 'Воля пользователя будет исполнена!',
            aboutTitle: 'Что мы предлагаем:',
            aboutOffer1: '📚 Обучение, жилье и переезд — за наш счёт',
            aboutOffer2: '🏢 Работа в современном офисе Одессы',
            aboutOffer3: '⏱️ Полноценная занятость (не удалённая)',
            aboutAdvantagesTitle: 'Преимущества работы с нами:',
            aboutAdvantages1: '🚀 Рост и развитие — поддержим твои амбиции',
            aboutAdvantages2: '💼 Стабильная работа в надёжной компании',
            aboutAdvantages3: '🪑 Комфортные условия и современное оборудование',
            aboutAdvantages4: '💰 Зарплата от 280 000 грн + бонусы без потолка',
            aboutAdvantages5: '📈 Карьерные перспективы и развитие',
            aboutAdvantages6: '🏠 Жильё для иногородних — мы позаботимся о тебе',
            aboutAdvantages7: '💸 Высокий доход — твои усилия окупятся',
            aboutCta: 'Оставь заявку прямо сейчас и стань частью нашей команды!',
            advantagesTitle: 'Преимущества',
            advantage1Title: 'Стабильная оплата',
            advantage1Text: 'Зарплата от 280 000 грн, еженедельные бонусы и премии без потолка. Всё официально и без задержек.',
            advantage2Title: 'Комфортные условия',
            advantage2Text: 'Современный офис, фиксированный график 5/2, чай/кофе и зона отдыха для твоего удобства.',
            advantage3Title: 'Карьерный рост',
            advantage3Text: 'Начни с оператора, стань тимлидом или руководителем. Мы продвигаем амбициозных!',
            advantage4Title: 'Жильё для иногородних',
            advantage4Text: 'Предоставляем жильё, чтобы ты мог сосредоточиться на работе, а не на бытовых вопросах.',
            advantage5Title: 'Обучение и поддержка',
            advantage5Text: 'Наставники помогут адаптироваться, даже если у тебя нет опыта. Всему научим!',
            advantage6Title: 'Дружный коллектив',
            advantage6Text: 'Тёплая атмосфера, корпоративы, конкурсы и поддержка команды на каждом этапе.',
            contactTitle: 'Оставить заявку',
            formName: 'Имя',
            formAge: 'Возраст',
            formPhone: 'Телефон +380',
            formCity: 'Город',
            formSubmit: 'Отправить заявку',
            successAnimation: 'Заявка успешно отправлена',
            modalCallbackTitle: 'Заказать звонок',
            modalCallbackText: 'Введите свои данные, и мы перезвоним в течение 30 минут',
            modalCallbackName: 'Имя',
            modalCallbackPhone: 'Телефон +380',
            modalCallbackSubmit: 'Отправить',
            footerText: '© 2025 Все права защищены.',
            privacy: 'Политика конфиденциальности'
        },
        ua: {
            title: 'Посейдон - Почни нове життя біля моря',
            navAbout: 'Про нас',
            navAdvantages: 'Переваги',
            navContact: 'Залишити заявку',
            heroTitle: 'Почни нове життя біля моря',
            heroText1: 'Наша команда в пошуках менеджера по роботі з клієнтами.',
            heroText2: 'Навчання, житло, переїзд — за наш рахунок.',
            heroText3: 'Робота в затишному офісі Одеси.',
            notRemote: 'НЕ віддалено!',
            heroButton: 'Залишити заявку', // Кнопка в hero
            poseidonAnimation: 'Воля користувача буде виконана!',
            aboutTitle: 'Що ми пропонуємо:',
            aboutOffer1: '📚 Навчання, житло та переїзд — за наш рахунок',
            aboutOffer2: '🏢 Робота в сучасному офісі Одеси',
            aboutOffer3: '⏱️ Повноцінна зайнятість (не віддаленка)',
            aboutAdvantagesTitle: 'Переваги роботи з нами:',
            aboutAdvantages1: '🚀 Ріст та розвиток — підтримаємо твої амбіції',
            aboutAdvantages2: '💼 Стабільна робота в надійній компанії',
            aboutAdvantages3: '🪑 Комфортні умови та сучасне обладнання',
            aboutAdvantages4: '💰 Зарплата від 280 000 грн + бонуси без стелі',
            aboutAdvantages5: '📈 Кар\'єрні перспективи та розвиток',
            aboutAdvantages6: '🏠 Житло для іногородніх — ми подбаємо про тебе',
            aboutAdvantages7: '💸 Високий дохід — твої зусилля окупляться',
            aboutCta: 'Залиш заявку прямо зараз і стань частиною нашої команди!',
            advantagesTitle: 'Переваги',
            advantage1Title: 'Стабільна оплата',
            advantage1Text: 'Зарплата від 280 000 грн, щотижневі бонуси та премії без стелі. Все офіційно та без затримок.',
            advantage2Title: 'Комфортні умови',
            advantage2Text: 'Сучасний офіс, фіксований графік 5/2, чай/кава та зона відпочинку для твого комфорту.',
            advantage3Title: 'Кар\'єрний ріст',
            advantage3Text: 'Почни з оператора, стань тімлідом або керівником. Ми просуваємо амбіційних!',
            advantage4Title: 'Житло для іногородніх',
            advantage4Text: 'Надаємо житло, щоб ти міг зосередитися на роботі, а не на побутових питаннях.',
            advantage5Title: 'Навчання та підтримка',
            advantage5Text: 'Наставники допоможуть адаптуватися, навіть якщо у тебе немає досвіду. Всьому навчимо!',
            advantage6Title: 'Дружний колектив',
            advantage6Text: 'Тепла атмосфера, корпоративи, конкурси та підтримка команди на кожному етапі.',
            contactTitle: 'Залишити заявку',
            formName: 'Ім\'я',
            formAge: 'Вік',
            formPhone: 'Телефон +380',
            formCity: 'Місто',
            formSubmit: 'Відправити заявку',
            successAnimation: 'Заявка успішно відправлена',
            modalCallbackTitle: 'Замовити дзвінок',
            modalCallbackText: 'Введіть свої дані, і ми передзвонимо протягом 30 хвилин',
            modalCallbackName: 'Ім\'я',
            modalCallbackPhone: 'Телефон +380',
            modalCallbackSubmit: 'Відправити',
            footerText: '© 2025 Всі права захищені.',
            privacy: 'Політика конфіденційності'
        }
    };

    // Функция для обновления текста на странице
    function updateLanguage(lang) {
        document.documentElement.lang = lang; // Обновляем атрибут lang в <html>
        const elements = [
            { selector: 'title', property: 'textContent', value: translations[lang].title },
            { selector: 'nav ul li:nth-child(1) a', property: 'textContent', value: translations[lang].navAbout },
            { selector: 'nav ul li:nth-child(2) a', property: 'textContent', value: translations[lang].navAdvantages },
            { selector: 'nav ul li:nth-child(3) a', property: 'textContent', value: translations[lang].navContact },
            { selector: '.hero-content h1', property: 'textContent', value: translations[lang].heroTitle },
            { selector: '.hero-content p:nth-child(3)', property: 'textContent', value: translations[lang].heroText1 },
            { selector: '.hero-content p:nth-child(4)', property: 'textContent', value: translations[lang].heroText2 },
            { selector: '.hero-content p:nth-child(5)', property: 'textContent', value: translations[lang].heroText3 },
            { selector: '.not-remote', property: 'textContent', value: translations[lang].notRemote },
            { selector: '.hero-content .btn', property: 'textContent', value: translations[lang].heroButton }, // Кнопка в hero
            { selector: '.poseidon-animation p', property: 'textContent', value: translations[lang].poseidonAnimation },
            { selector: '.about-text h3:nth-of-type(1)', property: 'textContent', value: translations[lang].aboutTitle },
            { selector: '.about-text ul:nth-of-type(1) li:nth-child(1)', property: 'textContent', value: translations[lang].aboutOffer1 },
            { selector: '.about-text ul:nth-of-type(1) li:nth-child(2)', property: 'textContent', value: translations[lang].aboutOffer2 },
            { selector: '.about-text ul:nth-of-type(1) li:nth-child(3)', property: 'textContent', value: translations[lang].aboutOffer3 },
            { selector: '.about-text h3:nth-of-type(2)', property: 'textContent', value: translations[lang].aboutAdvantagesTitle },
            { selector: '.about-text ul:nth-of-type(2) li:nth-child(1)', property: 'textContent', value: translations[lang].aboutAdvantages1 },
            { selector: '.about-text ul:nth-of-type(2) li:nth-child(2)', property: 'textContent', value: translations[lang].aboutAdvantages2 },
            { selector: '.about-text ul:nth-of-type(2) li:nth-child(3)', property: 'textContent', value: translations[lang].aboutAdvantages3 },
            { selector: '.about-text ul:nth-of-type(2) li:nth-child(4)', property: 'textContent', value: translations[lang].aboutAdvantages4 },
            { selector: '.about-text ul:nth-of-type(2) li:nth-child(5)', property: 'textContent', value: translations[lang].aboutAdvantages5 },
            { selector: '.about-text ul:nth-of-type(2) li:nth-child(6)', property: 'textContent', value: translations[lang].aboutAdvantages6 },
            { selector: '.about-text ul:nth-of-type(2) li:nth-child(7)', property: 'textContent', value: translations[lang].aboutAdvantages7 },
            { selector: '.about-cta', property: 'textContent', value: translations[lang].aboutCta },
            { selector: '#advantages h2', property: 'textContent', value: translations[lang].advantagesTitle },
            { selector: '.advantage-item:nth-child(1) h3', property: 'textContent', value: translations[lang].advantage1Title },
            { selector: '.advantage-item:nth-child(1) p', property: 'textContent', value: translations[lang].advantage1Text },
            { selector: '.advantage-item:nth-child(2) h3', property: 'textContent', value: translations[lang].advantage2Title },
            { selector: '.advantage-item:nth-child(2) p', property: 'textContent', value: translations[lang].advantage2Text },
            { selector: '.advantage-item:nth-child(3) h3', property: 'textContent', value: translations[lang].advantage3Title },
            { selector: '.advantage-item:nth-child(3) p', property: 'textContent', value: translations[lang].advantage3Text },
            { selector: '.advantage-item:nth-child(4) h3', property: 'textContent', value: translations[lang].advantage4Title },
            { selector: '.advantage-item:nth-child(4) p', property: 'textContent', value: translations[lang].advantage4Text },
            { selector: '.advantage-item:nth-child(5) h3', property: 'textContent', value: translations[lang].advantage5Title },
            { selector: '.advantage-item:nth-child(5) p', property: 'textContent', value: translations[lang].advantage5Text },
            { selector: '.advantage-item:nth-child(6) h3', property: 'textContent', value: translations[lang].advantage6Title },
            { selector: '.advantage-item:nth-child(6) p', property: 'textContent', value: translations[lang].advantage6Text },
            { selector: '#contact h2', property: 'textContent', value: translations[lang].contactTitle },
            { selector: '#contact-form input[name="name"]', property: 'placeholder', value: translations[lang].formName },
            { selector: '#contact-form input[name="age"]', property: 'placeholder', value: translations[lang].formAge },
            { selector: '#contact-form input[name="phone"]', property: 'placeholder', value: translations[lang].formPhone },
            { selector: '#contact-form input[name="city"]', property: 'placeholder', value: translations[lang].formCity },
            { selector: '#contact-form button', property: 'textContent', value: translations[lang].formSubmit },
            { selector: '.success-anim-container p', property: 'textContent', value: translations[lang].successAnimation },
            { selector: '#callback-modal h3', property: 'textContent', value: translations[lang].modalCallbackTitle },
            { selector: '#callback-modal p', property: 'textContent', value: translations[lang].modalCallbackText },
            { selector: '#modal-form input[name="name"]', property: 'placeholder', value: translations[lang].modalCallbackName },
            { selector: '#modal-form input[name="phone"]', property: 'placeholder', value: translations[lang].modalCallbackPhone },
            { selector: '#modal-form button', property: 'textContent', value: translations[lang].modalCallbackSubmit },
            { selector: 'footer p', property: 'textContent', value: translations[lang].footerText },
            { selector: 'footer a', property: 'textContent', value: translations[lang].privacy }
        ];

        elements.forEach(({ selector, property, value }) => {
            const element = document.querySelector(selector);
            if (element) {
                element[property] = value;
            } else {
                console.warn(`Element not found for selector: ${selector}`);
            }
        });
    }

    // Устанавливаем начальный язык (русский)
    updateLanguage(currentLanguage);

    // Обработчик клика на иконку языка
    if (languageSwitch) {
        languageSwitch.addEventListener('click', (e) => {
            e.preventDefault();
            currentLanguage = currentLanguage === 'ru' ? 'ua' : 'ru';
            updateLanguage(currentLanguage);
            // Меняем только атрибут alt иконки
            languageSwitch.querySelector('img').alt = currentLanguage === 'ru' ? 'UA' : 'RU';
        });
    } else {
        console.error('Language switch element not found');
    }
});