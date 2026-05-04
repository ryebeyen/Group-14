if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode"); 
    document.querySelector(".dark-mode-toggle")?.classList.add("active");
}