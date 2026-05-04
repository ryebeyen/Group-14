const toggle = document.querySelector(".dark-mode-toggle");

toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark);
});
