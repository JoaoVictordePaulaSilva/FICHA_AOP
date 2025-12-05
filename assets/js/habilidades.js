// habilidades.js
// Criação de linhas de habilidade dinâmicas

function criarHabilidadeRow(prefill = {}) {
  const div = document.createElement("div");
  div.className = "hab-row";

  div.innerHTML = `
    <input class="hab-nome" placeholder="Nome (ex: Ataque Especial)">
    <input type="number" class="hab-pd" placeholder="PD" min="0">
    <textarea class="hab-desc" placeholder="Descrição (ex: +5 no ataque ou dano)"></textarea>
    <input class="hab-pagina" placeholder="Página (ex: 20 AOP)">
    <button class="btn-remove">X</button>
  `;

  // Remover
  div.querySelector(".btn-remove").onclick = () => div.remove();

  // Prefill
  div.querySelector(".hab-nome").value   = prefill.nome   || "";
  div.querySelector(".hab-pd").value     = prefill.pd     || "";
  div.querySelector(".hab-desc").value   = prefill.descricao || "";
  div.querySelector(".hab-pagina").value = prefill.pagina || "";

  return div;
}

