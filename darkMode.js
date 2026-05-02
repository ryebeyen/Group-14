document.querySelector('.dark-mode-toggle').addEventListener('click', () => {
    const toggle = document.querySelector('.dark-mode-toggle');
    toggle.classList.toggle('active');
    document.body.classList.toggle('dark-mode');
});