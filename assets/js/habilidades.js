// Caminho para as imagens dos elementos
const elementos = {
  "": "assets/img/Geral/Transcendência.png",
  "Morte": "assets/img/Geral/Morte.png",
  "Energia": "assets/img/Geral/Energia.png",
  "Sangue": "assets/img/Geral/Sangue.png",
  "Conhecimento": "assets/img/Geral/Conhecimento.png",
  "Medo": "assets/img/Geral/Medo.png"
};

// Seletores
const habilidadesList = document.getElementById("habilidades-list");
const addButton = document.getElementById("add-habilidade");

function criarHabilidade(){
  const div = document.createElement("div");
  div.className = "hab-row";

  div.innerHTML = `
    <input placeholder="Nome do Poder/Ritual">
    <input placeholder="Custo (ex: 2 PD)">
    <textarea placeholder="Descrição"></textarea>
    <input placeholder="Página (ex: 208 AOP)">

    <select class="elemento-select">
      ${Object.keys(elementos).map(e =>
        `<option value="${e}">${e || "Nenhum"}</option>`
      ).join("")}
    </select>

    <button class="btn-remove">X</button>
  `;

  // Ícone
  const select = div.querySelector(".elemento-select");
  const iconContainer = document.createElement("div");
  iconContainer.className = "elemento-box";

  const img = document.createElement("img");
  img.src = elementos[""];
  iconContainer.appendChild(img);

  div.replaceChild(iconContainer, div.children[4]);
  div.insertBefore(select, iconContainer);

  select.addEventListener("change", e => {
    img.src = elementos[e.target.value] || elementos[""];
  });

  div.querySelector(".btn-remove").onclick = () => div.remove();

  habilidadesList.appendChild(div);
}

addButton.addEventListener("click", criarHabilidade);
