// ======================
// SISTEMA DE ITENS
// ======================

const itensList = document.getElementById("itens-list");
const addItemBtn = document.getElementById("add-item");

function criarItem(){
  const div = document.createElement("div");
  div.className = "item-row";

  div.innerHTML = `
    <input placeholder="Nome (ex: Granada)">
    <textarea placeholder="Descrição (ex: explode causando 4d8)"></textarea>
    <input type="number" placeholder="Cat." min="1" max="4">
    <input type="number" placeholder="Esp." min="0">
    <button class="item-remove">X</button>
  `;

  div.querySelector(".item-remove").onclick = () => div.remove();

  itensList.appendChild(div);
}

addItemBtn.addEventListener("click", criarItem);
