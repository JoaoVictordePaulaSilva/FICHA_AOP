document.addEventListener("DOMContentLoaded", async () => {
  await loadPericias();
  initAtributos();
  initInformacoes();  // novo módulo
  updateRadar();
});
