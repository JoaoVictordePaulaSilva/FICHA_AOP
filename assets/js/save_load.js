// assets/js/save_load.js
// Salvamento/Carregamento JSON + Export PDF + Nova Ficha + Criação de Habilidades/Itens
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const filenameFor = (name, ext) => {
    const safe = (name || 'ficha').trim().replace(/\s+/g,'_').replace(/[^\w\-]/g,'');
    const stamp = new Date().toISOString().replace(/[:.]/g,'-');
    return `${safe || 'ficha'}_${stamp}.${ext}`;
  };

  // Botões
  const btnDownloadJSON = $('#download-json');
  const fileInput       = $('#file-input');
  const btnExportPDF    = $('#export-pdf');
  const btnNova         = $('#nova-ficha');
  const statusEl        = $('#save-status');

  // Listas dinâmicas
  const habilidadesList = $('#habilidades-list');
  const itensList       = $('#itens-list');
  const addHabBtn       = $('#add-habilidade');
  const addItemBtn      = $('#add-item');

  // ======================
  // ELEMENTOS (ÍCONES)
  // ======================

  const elementos = {
    "": "assets/img/Geral/Transcendência.png",
    "Morte": "assets/img/Geral/Morte.png",
    "Energia": "assets/img/Geral/Energia.png",
    "Sangue": "assets/img/Geral/Sangue.png",
    "Conhecimento": "assets/img/Geral/Conhecimento.png",
    "Medo": "assets/img/Geral/Medo.png"
  };

  // ======================
  // CRIAR HABILIDADE
  // ======================

  function criarHabilidadeRow(prefill = {}) {
    const div = document.createElement("div");
    div.className = "hab-row";

    div.innerHTML = `
      <input class="hab-nome" placeholder="Nome do Poder/Ritual">
      <input class="hab-pd" placeholder="Custo (ex: 2 PD)">
      <input class="hab-dt" placeholder="DT (ex: 25 Vontade)">
      <textarea class="hab-desc" placeholder="Descrição"></textarea>
      <input class="hab-pagina" placeholder="Página (ex: 208 AOP)">
      <select class="hab-elemento">
        ${Object.keys(elementos).map(e =>
          `<option value="${e}">${e || "Nenhum"}</option>`
        ).join("")}
      </select>
      <button class="btn-remove">X</button>
    `;

    // Ícone ao lado do select
    const select = div.querySelector(".hab-elemento");
    const iconBox = document.createElement("div");
    iconBox.className = "elemento-box";

    const img = document.createElement("img");
    img.src = elementos[prefill.elemento || ""] || elementos[""];
    iconBox.appendChild(img);
    div.appendChild(iconBox);

    select.addEventListener("change", e => {
      img.src = elementos[e.target.value] || elementos[""];
    });

    // Remover
    div.querySelector(".btn-remove").onclick = () => div.remove();

    // Prefill
    div.querySelector(".hab-nome").value   = prefill.nome   || "";
    div.querySelector(".hab-pd").value     = prefill.pd     || "";
    div.querySelector(".hab-dt").value     = prefill.dt     || "";
    div.querySelector(".hab-desc").value   = prefill.descricao || "";
    div.querySelector(".hab-pagina").value = prefill.pagina || "";
    select.value                            = prefill.elemento || "";

    habilidadesList.appendChild(div);
  }

  addHabBtn.addEventListener("click", () => criarHabilidadeRow());


  // ======================
  // CRIAR ITEM
  // ======================

  function criarItemRow(prefill = {}) {
    const div = document.createElement("div");
    div.className = "item-row";

    div.innerHTML = `
      <input class="item-nome" placeholder="Nome (ex: Granada)">
      <textarea class="item-desc" placeholder="Descrição (ex: explode causando 4d8)"></textarea>
      <input class="item-cat" type="number" placeholder="Cat." min="1" max="4">
      <input class="item-qtd" type="number" placeholder="Esp." min="0">
      <button class="item-remove">X</button>
    `;

    div.querySelector(".item-remove").onclick = () => div.remove();

    // Prefill
    div.querySelector(".item-nome").value = prefill.nome || "";
    div.querySelector(".item-desc").value = prefill.descricao || "";
    div.querySelector(".item-cat").value  = prefill.categoria || "";
    div.querySelector(".item-qtd").value  = prefill.quantidade || "";

    itensList.appendChild(div);
  }

  addItemBtn.addEventListener("click", () => criarItemRow());


  // ======================
  // COLETAR DADOS
  // ======================

  function collectHabilidades() {
    return $$('.hab-row').map(r => ({
      nome:      r.querySelector('.hab-nome')?.value || "",
      pd:        r.querySelector('.hab-pd')?.value || "",
      dt:        r.querySelector('.hab-dt')?.value || "",
      descricao: r.querySelector('.hab-desc')?.value || "",
      pagina:    r.querySelector('.hab-pagina')?.value || "",
      elemento:  r.querySelector('.hab-elemento')?.value || ""
    }));
  }

  function collectItens() {
    return $$('.item-row').map(r => ({
      nome:       r.querySelector('.item-nome')?.value || "",
      descricao:  r.querySelector('.item-desc')?.value || "",
      categoria:  r.querySelector('.item-cat')?.value || "",
      quantidade: r.querySelector('.item-qtd')?.value || ""
    }));
  }

  function collectAtributos() {
    const keys = ['FOR','AGI','INT','PRE','VIG'];
    const out = {};
    keys.forEach(k => out[k] = $('#' + k)?.value || "");
    return out;
  }

  function collectFicha() {
    return {
      meta: {
        nome_personagem: $('#nome_personagem')?.value || "",
        nome_jogador:    $('#nome_jogador')?.value || "",
        origem:          $('#origem')?.value || "",
        classe:          $('#classe')?.value || "",
        trilha:          $('#trilha')?.value || "",
        nex:             $('#nex')?.value || "",
        nivel:           $('#nivel')?.value || "",
        limite_pd:       $('#limite_pd')?.value || "",
        pv_atual:        $('#pv_atual')?.value || "",
        pv_max:          $('#pv_max')?.value || "",
        pd_atual:        $('#pd_atual')?.value || "",
        pd_max:          $('#pd_max')?.value || "",
        def_valor:       $('#def_valor')?.value || "",
        resistencias:    $('#resistencias')?.value || "",
        protecao:        $('#protecao')?.value || ""
      },
      atributos:  collectAtributos(),
      habilidades: collectHabilidades(),
      itens: collectItens()
    };
  }

  // ======================
  // APPLY (OBJ → DOM)
  // ======================

  function applyFicha(data) {
    if (!data) return;

    const m = data.meta || {};
    Object.keys(m).forEach(k => {
      const el = $('#' + k);
      if (el) el.value = m[k] || "";
    });

    if (data.atributos) {
      Object.keys(data.atributos).forEach(k => {
        const el = document.getElementById(k);
        if (el) el.value = data.atributos[k];
      });
      if (typeof updateRadar === "function") updateRadar();
    }

    habilidadesList.innerHTML = "";
    (data.habilidades || []).forEach(h => criarHabilidadeRow(h));

    itensList.innerHTML = "";
    (data.itens || []).forEach(i => criarItemRow(i));

    status("Ficha carregada.");
  }


  // ======================
  // DOWNLOAD / LOAD JSON
  // ======================

  function downloadJSON() {
    const data = collectFicha();
    const nome = $('#nome_personagem')?.value || 'ficha';
    const filename = filenameFor(nome, 'json');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    status(`JSON salvo: ${filename}`);
  }

  if (fileInput) {
    fileInput.addEventListener('change', e => {
      const f = e.target.files?.[0];
      if (!f) return;

      const reader = new FileReader();
      reader.onload = ev => {
        try {
          applyFicha(JSON.parse(ev.target.result));
        } catch (err) {
          alert("Erro ao carregar JSON: " + err.message);
        }
      };
      reader.readAsText(f);
      fileInput.value = "";
    });
  }

  if (btnDownloadJSON) btnDownloadJSON.addEventListener('click', downloadJSON);


  // ======================
  // PDF
  // ======================

  function exportPDF() {
    if (typeof html2canvas !== "function" || typeof window.jspdf === "undefined") {
      alert("html2canvas e jsPDF são necessários.");
      return;
    }

    status("Capturando...");

    html2canvas(document.body, { scale: 2 }).then(canvas => {
      const img = canvas.toDataURL("image/png");
      const pdf = new window.jspdf.jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      const imgW = canvas.width;
      const imgH = canvas.height;
      const scale = Math.min(pageW / imgW, pageH / imgH);

      pdf.addImage(img, "PNG", 0, 0, imgW * scale, imgH * scale);

      const filename = filenameFor($('#nome_personagem')?.value || "ficha", "pdf");
      pdf.save(filename);

      status("PDF gerado.");
    });
  }

  if (btnExportPDF) btnExportPDF.addEventListener("click", exportPDF);


  // ======================
  // NOVA FICHA
  // ======================

  function novaFicha() {
    if (!confirm("Criar nova ficha? Isso limpará tudo.")) return;

    document.querySelectorAll("input, textarea").forEach(el => {
      if (el.type !== "file") el.value = "";
    });

    habilidadesList.innerHTML = "";
    itensList.innerHTML = "";

    if (typeof updateRadar === "function") updateRadar();

    status("Nova ficha criada.");
  }

  if (btnNova) btnNova.addEventListener("click", novaFicha);


  // ======================
  // STATUS
  // ======================

  function status(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;

    setTimeout(() => {
      if (statusEl.textContent === msg) statusEl.textContent = "";
    }, 4000);
  }

})();
