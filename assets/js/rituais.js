// rituais.js
// Criação de linhas de ritual dinâmicas

function criarRitualRow(prefill = {}) {
  const div = document.createElement("div");
  div.className = "ritual-row";

  // Lista de elementos com suas imagens
  const elementos = {
    "": { label: "Nenhum", img: "" },
    "Morte": { label: "Morte", img: "assets/img/Geral/Morte.png" },
    "Energia": { label: "Energia", img: "assets/img/Geral/Energia.png" },
    "Sangue": { label: "Sangue", img: "assets/img/Geral/Sangue.png" },
    "Conhecimento": { label: "Conhecimento", img: "assets/img/Geral/Conhecimento.png" },
    "Medo": { label: "Medo", img: "assets/img/Geral/Medo.png" }
  };

  // Cria as opções de elemento
  const elementoOptionsHTML = Object.entries(elementos)
    .map(([key, val]) => `<option value="${key}">${val.label}</option>`)
    .join("");

  div.innerHTML = `
    <input class="ritual-nome" placeholder="Nome (ex: Descarnar)">
    <input type="number" class="ritual-pd" placeholder="PD" min="0">
    <textarea class="ritual-desc" placeholder="Descrição (ex: Causa 2d8 de dano de sangue)"></textarea>
    <input class="ritual-alvo" placeholder="Alvo (ex: 1 ser)">
    <input class="ritual-alcance" placeholder="Alcance (ex: Toque)">
    <input class="ritual-resistencia" placeholder="Resistência (ex: Vontade Parcialmente)">
    <div class="ritual-elemento-col">
      <select class="ritual-elemento">
        ${elementoOptionsHTML}
      </select>
      <img class="ritual-elemento-img" src="" alt="Elemento">
    </div>
    <button class="btn-remove">X</button>
  `;

  // Remover
  div.querySelector(".btn-remove").onclick = () => div.remove();

  // Prefill
  div.querySelector(".ritual-nome").value   = prefill.nome   || "";
  div.querySelector(".ritual-pd").value     = prefill.pd     || "";
  div.querySelector(".ritual-desc").value   = prefill.descricao || "";
  div.querySelector(".ritual-alvo").value   = prefill.alvo   || "";
  div.querySelector(".ritual-alcance").value = prefill.alcance || "";
  div.querySelector(".ritual-resistencia").value = prefill.resistencia || "";

  // Setup de imagem de elemento
  const select = div.querySelector(".ritual-elemento");
  const img = div.querySelector(".ritual-elemento-img");

  const elementoMap = {
    "": "transcendencia",
    "Energia": "energia",
    "Morte": "morte",
    "Sangue": "sangue",
    "Conhecimento": "conhecimento",
    "Medo": "medo"
  };

  const updateElementoImage = () => {
    const selectedElemento = select.value;
    if (elementos[selectedElemento]) {
      img.src = elementos[selectedElemento].img;
      img.style.display = elementos[selectedElemento].img ? 'block' : 'none';
    }
    
    // Atualiza classe de cor da linha
    Object.values(elementoMap).forEach(classe => {
      div.classList.remove(`elemento-${classe}`);
    });
    const newClass = elementoMap[selectedElemento] || "transcendencia";
    div.classList.add(`elemento-${newClass}`);
  };

  select.addEventListener("change", updateElementoImage);
  
  if (prefill.elemento) {
    select.value = prefill.elemento;
  }
  
  updateElementoImage();

  return div;
}
