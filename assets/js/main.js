document.addEventListener("DOMContentLoaded", async () => {
  await loadPericias();
  initAtributos();
  initInformacoes();  // novo módulo
  updateRadar();
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".regra-header").forEach(header => {
    header.addEventListener("click", () => {
      const target = document.querySelector(header.dataset.target);
      const icon = header.querySelector(".toggle-icon");

      const isOpen = target.style.display === "block";

      target.style.display = isOpen ? "none" : "block";
      icon.textContent = isOpen ? "+" : "-";
    });
  });
});
