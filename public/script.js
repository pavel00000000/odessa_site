document.addEventListener('DOMContentLoaded', () => {
    const callIcon = document.querySelector('.call-icon');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContent = document.querySelector('.modal-content');
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
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            toggleModal();
        });
    }

    // Предотвращение закрытия при клике внутри .modal-content
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Обработка отправки формы обратного звонка
    if (modalForm) {
        modalForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Собираем данные формы
            const formData = new FormData(modalForm);
            const formDataObj = Object.fromEntries(formData);
            console.log('Отправляемые данные (modal-form):', formDataObj); // Отладка

            // Валидация полей
            const { name, phone } = formDataObj;
            if (!name) {
                alert('Ошибка: Поле имени обязательно для заполнения.');
                return;
            }
            if (!phone) {
                alert('Ошибка: Поле телефона обязательно для заполнения.');
                return;
            }
            const phoneRegex = /^\+380[0-9]{9}$/;
            if (!phoneRegex.test(phone)) {
                alert('Ошибка: Неверный формат телефона. Используйте +380XXXXXXXXX.');
                return;
            }

            // Проверка на лишние поля
            const validFields = ['name', 'phone'];
            const receivedFields = Object.keys(formDataObj);
            const extraFields = receivedFields.filter(field => !validFields.includes(field));
            if (extraFields.length > 0) {
                console.warn('Лишние поля в modal-form:', extraFields);
            }

            try {
                const response = await fetch('http://localhost:3000/callback', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                console.log('Ответ сервера (modal-form):', result); // Отладка

                if (response.ok) {
                    alert(result.message || 'Запрос на звонок отправлен!');
                    modalForm.reset();
                    toggleModal();
                } else {
                    alert(result.error || 'Ошибка при отправке запроса. Проверьте поля формы.');
                    console.error('Ошибка сервера:', result);
                }
            } catch (error) {
                alert('Ошибка сети. Проверьте, запущен ли сервер.');
                console.error('Ошибка сети:', error);
            }
        });

        // Предотвращение закрытия при фокусе на полях ввода
        modalInputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.stopPropagation();
            });
            input.addEventListener('click', (e) => {
                e.stopPropagation();
            });
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

            const age = formDataObj.age;
            if (!age || isNaN(parseInt(age)) || parseInt(age) < 16 || parseInt(age) > 100) {
                alert('Ошибка: Возраст должен быть числом от 16 до 100.');
                return;
            }

            if (!formDataObj.name || !formDataObj.phone || !formDataObj.city || !formDataObj.age) {
                alert('Ошибка: Все поля обязательны для заполнения.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/submit', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                console.log('Ответ сервера (contact-form):', result);

                if (response.ok) {
                    alert(result.message || 'Заявка успешно отправлена!');
                    contactForm.reset();
                } else {
                    alert(result.error || 'Ошибка при отправке заявки. Проверьте поля формы.');
                    console.error('Ошибка сервера:', result);
                }
            } catch (error) {
                alert('Ошибка сети. Проверьте, запущен ли сервер.');
                console.error('Ошибка сети:', error);
            }
        });
    }
});

// Открытие/закрытие модального окна
function toggleModal() {
    document.body.classList.toggle('modal-open');
}