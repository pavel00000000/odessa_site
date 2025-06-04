document.addEventListener('DOMContentLoaded', () => {
    const callIcon = document.querySelector('.call-icon');
    const modalInputs = document.querySelectorAll('#modal-form input');

    // Скрытие иконки при фокусе
    const formInputs = document.querySelectorAll('#contact-form input, #modal-form input');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            callIcon.style.display = 'none';
        });
        input.addEventListener('blur', () => {
            callIcon.style.display = 'flex';
        });
    });

    // Скролл к форме после анимации
    document.getElementById('poseidon-trigger').addEventListener('change', (e) => {
        if (e.target.checked) {
            // Ждём 4 секунды (длительность анимации poseidonFade)
            setTimeout(() => {
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                // Сбрасываем checkbox, чтобы анимация могла запуститься снова
                e.target.checked = false;
            }, 2200);
        }
    });

    // Закрытие модальных окон по overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.modal');
            toggleModal(modal.id);
        });
    });

    // Предотвращение закрытия при клике внутри .modal-content
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', e => e.stopPropagation());
    });

    // Показ сообщения
    function showMessage(type, title, text) {
        const modal = document.getElementById('message-modal');
        const titleElement = modal.querySelector('.message-title');
        const textElement = modal.querySelector('.message-text');

        console.log('Showing message:', { type, title, text }); // Для отладки
        titleElement.textContent = title;
        textElement.textContent = text;
        titleElement.className = `message-title ${type}`;
        modal.classList.add('active');
    }

    // Обработка формы обратного звонка
    const modalForm = document.getElementById('modal-form');
    if (modalForm) {
        modalForm.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(modalForm);
            const formDataObj = Object.fromEntries(formData);
            console.log('Отправляемые данные (modal-form):', formDataObj);

            const { name, phone } = formDataObj;
            if (!name) {
                showMessage('error', 'Ошибка', 'Поле имени обязательно.');
                return;
            }
            if (!phone) {
                showMessage('error', 'Ошибка', 'Поле телефона обязательно.');
                return;
            }

            // Очистка телефона
            const cleanedPhone = phone.replace(/[\s()-]/g, '');
            const phoneRegex = /^\+380[0-9]{9}$/;
            if (!phoneRegex.test(cleanedPhone)) {
                showMessage('error', 'Ошибка', 'Неверный формат телефона. Используйте +380XXXXXXXXX.');
                return;
            }

            formData.set('phone', cleanedPhone);

            try {
                const response = await fetch('https://work.odessa.ua/callback', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                console.log('Ответ сервера (modal-form):', result);

                if (response.ok) {
                    showMessage('success', 'Успех!', result.message || 'Запрос на звонок отправлен!');
                    modalForm.reset();
                    toggleModal('callback-modal');
                } else {
                    showMessage('error', 'Ошибка', result.error || 'Ошибка отправки запроса.');
                }
            } catch (error) {
                showMessage('error', 'Ошибка сети', 'Не удалось подключиться к серверу.');
                console.error('Ошибка:', error);
            }
        });

        modalInputs.forEach(input => {
            input.addEventListener('focus', e => e.stopPropagation());
            input.addEventListener('click', e => e.stopPropagation());
        });
    }

    // Обработка формы заявки
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const formDataObj = Object.fromEntries(formData);
            console.log('Отправляемые данные (contact-form):', formDataObj);

            const age = parseInt(formDataObj.age);
            if (!age || isNaN(age) || age < 16 || age > 100) {
                showMessage('error', 'Ошибка', 'Возраст должен быть от 16 до 100.');
                return;
            }

            if (!formDataObj.name || !formDataObj.phone || !formDataObj.city || !formDataObj.age) {
                showMessage('error', 'Ошибка', 'Все поля обязательны.');
                return;
            }

            // Очистка телефона
            const cleanedPhone = formDataObj.phone.replace(/[\s()-]/g, '');
            const phoneRegex = /^\+380[0-9]{9}$/;
            if (!phoneRegex.test(cleanedPhone)) {
                showMessage('error', 'Ошибка', 'Неверный формат телефона. Используйте +380XXXXXXXXX.');
                return;
            }

            formData.set('phone', cleanedPhone);

            try {
                const response = await fetch('https://work.odessa.ua/submit', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                console.log('Ответ сервера (contact-form):', result);

                if (response.ok) {
                    showSuccessAnimation();
                    contactForm.reset();
                } else {
                    showMessage('error', 'Ошибка', result.error || 'Ошибка отправки заявки.');
                }
            } catch (error) {
                showMessage('error', 'Ошибка сети', 'Не удалось подключиться к серверу.');
                console.error('Ошибка:', error);
            }
        });
    }
});

// Анимация карточек при прокрутке
const advantageItems = document.querySelectorAll('.advantage-item');
const observerOptions = {
    root: null,
    threshold: 0.2, // Запуск, когда 20% карточки видно
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const item = entry.target;
            const index = item.style.getPropertyValue('--index') || 0;
            item.classList.add('visible');
            item.style.transitionDelay = `${index * 0.2}s`; // Задержка по --index
            observer.unobserve(item); // Отключаем наблюдение после анимации
        }
    });
}, observerOptions);

advantageItems.forEach(item => {
    observer.observe(item);
});

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('active');
}