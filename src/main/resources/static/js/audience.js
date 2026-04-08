// audience.js
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.audience-card');
    cards.forEach(card => {
        card.addEventListener('click', function () {

            cards.forEach(c => c.classList.remove('selected'));

            card.classList.add('selected');
            const audience = card.getAttribute('data-audience');
            localStorage.setItem('audienceSelection', audience);

            setTimeout(() => {
                window.location.href = 'content.html';
            }, 100);
        });
    });
});
