function showSuccessAnimation() {
    const animation = document.querySelector('.success-anim-container');
    animation.style.display = 'flex'; // Используем flex для соответствия CSS
    animation.addEventListener('click', () => {
        animation.style.display = 'none';
    }, { once: true }); // Событие срабатывает только один раз
}