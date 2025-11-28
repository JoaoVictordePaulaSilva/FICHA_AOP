async function loadPericias(){
  const container = document.getElementById("pericias");
  const lista = await fetch("./data/pericias.json").then(r => r.json());

  lista.forEach(p => {
    const div = document.createElement("div");
    div.className = "per-row";
    div.innerHTML = `
      <span>${p}</span>
      <input type="number" value="0" min="-10" max="20" aria-label="${p} bonus">
    `;
    container.appendChild(div);
  });
}
