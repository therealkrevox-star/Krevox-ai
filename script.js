const langBtn = document.getElementById("langBtn");
let lang = "uz";
langBtn.addEventListener("click", () => {
  lang = lang === "uz" ? "en" : "uz";
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-uz][data-en]").forEach(el => {
    el.innerHTML = el.dataset[lang];
  });
  langBtn.textContent = lang === "uz" ? "UZ / EN" : "EN / UZ";
});
