const atributos = ["FOR","AGI","INT","PRE","VIG"];

function initAtributos(){
  atributos.forEach(attr => {
    const el = document.getElementById(attr);
    el.addEventListener("input", () => {
      el.value = clamp(el.value, 0, 10);
      updateRadar();
    });
  });
}
