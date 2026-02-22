// audience.js
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.audience-card');
    cards.forEach(card => {
        card.addEventListener('click', function () {
            // 先全部取消高亮
            cards.forEach(c => c.classList.remove('selected'));
            // 当前卡片高亮
            card.classList.add('selected');
            const audience = card.getAttribute('data-audience');
            localStorage.setItem('audienceSelection', audience);
            // 延迟100毫秒后跳转，让选中动画可见
            setTimeout(() => {
                window.location.href = 'content.html';
            }, 100);
        });
    });
});
