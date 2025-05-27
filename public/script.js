document.addEventListener('DOMContentLoaded', () => {
    const callIcon = document.querySelector('.call-icon');
    const modalOverlay = document.querySelector('#callback-modal .modal-overlay');
    const modalContent = document.querySelector('#callback-modal .modal-content');
    const modalForm = document.getElementById('modal-form');
    const modalInputs = document.querySelectorAll('#modal-form input');

    // Скрытие иконки при фокусе на полях формы
    const formInputs = document.querySelectorAll('#contact-form input, #modal-form input');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            callIcon.style.display = 'none';
        });
        input.addEventListener('blur', () => {
            callIcon.style.display = 'flex';
        });
    });

    // Обработка клика по overlay для закрытия модального окна
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.modal');
            toggleModal(modal.id);
        });
    });

    // Предотвращаем закрытие при клике внутри .modal-content
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Функция для показа сообщения в модальном окне
    function showMessage(type, title, text) {
        const modal = document.getElementById('message-modal');
        const titleElement = modal.querySelector('.message-title');
        const textElement = modal.querySelector('.message-text');

        titleElement.textContent = title;
        textElement.textContent = text;
        titleElement.className = `message-title ${type}`; // success или error

        modal.classList.add('active');
    }

    // Обработка формы обратного звонка
    if (modalForm) {
        modalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(modalForm);
            const formDataObj = Object.fromEntries(formData);
            console.log('Отправляемые данные (modal-form):', formDataObj);

            // Валидация полей
            const { name, phone } = formDataObj;
            if (!name) {
                showMessage('error', 'Ошибка', 'Поле имени обязательно для заполнения.');
                return;
            }
            if (!phone) {
                showMessage('error', 'Ошибка', 'Поле телефона обязательно для заполнения.');
                return;
            }

            // Очистка номера от пробелов и дефисов
            const cleanedPhone = phone.replace(/[\s-]/g, '');
            const phoneRegex = /^\+380[0-9]{9}$/;
            if (!phoneRegex.test(cleanedPhone)) {
                showMessage('error', 'Ошибка', 'Неверный формат телефона. Используйте +380XXXXXXXXX.');
                return;
            }

            formData.set('phone', cleanedPhone);

            try {
                const response = await fetch('/callback', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                console.log('Ответ сервера (modal-form):', result);

                if (response.ok) {
                    showMessage('success', 'Успех!', result.message || 'Запрос на звонок получен!');
                    modalForm.reset();
                    toggleModal('callback-modal');
                } else {
                    showMessage('error', 'Ошибка', result.error || 'Ошибка при отправке запроса.');
                }
            } catch (error) {
                showMessage('error', 'Ошибка сети', 'Не удалось подключиться к серверу. Проверьте соединение.');
                console.error('Ошибка:', error);
            }
        });

        // Предотвращаем закрытие при клике на поля
        modalInputs.forEach(input => {
            input.addEventListener('focus', e => e.stopPropagation());
            input.addEventListener('click', e => e.stopPropagation());
        });
    }

    // Обработка формы заявки
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const formDataObj = Object.fromEntries(formData);
            console.log('Отправляемые данные (contact-form):', formDataObj);

            const age = parseInt(formDataObj.age);
            if (!age || isNaN(age) || age < 16 || age > 100) {
                showMessage('error', 'Ошибка', 'Возраст должен быть числом от 16 до 50.');
                return;
            }

            if (!formDataObj.name || !formDataObj.phone || !formDataObj.city || !formDataObj.age) {
                showMessage('error', 'Ошибка', 'Все поля обязательны для заполнения.');
                return;
            }

            const cleanedPhone = formDataObj.phone.replace(/[\s-]/g, '');
            const phoneRegex = /^\+380[0-9]{9}$/;
            if (!phoneRegex.test(cleanedPhone)) {
                showMessage('error', 'Ошибка', 'Неверный формат телефона. Используйте +380XXXXXXXXX.');
                return;
            }

            formData.set('phone', cleanedPhone);

            try {
                const response = await fetch('/submit', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                console.log('Ответ сервера (contact-form):', result);

                if (response.ok) {
                    showMessage('success', 'Успех!', 'Заявка успешно отправлена!');
                    contactForm.reset();
                } else {
                    showMessage('error', 'Ошибка', result.error || 'Ошибка при отправке заявки.');
                }
            } catch (error) {
                showMessage('error', 'Ошибка сети', 'Не удалось подключиться к серверу. Проверьте соединение.');
                console.error('Ошибка:', error);
            }
        });
    }
});

// Управление модальными окнами
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('active');
}