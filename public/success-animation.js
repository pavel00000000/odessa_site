function showSuccessAnimation() {
    const animation = document.querySelector('.success-anim-container');
    animation.style.display = 'block';
    setTimeout(() => {
        animation.style.display = 'none';
    }, 3000); // Скрываем через 3 секунды
}