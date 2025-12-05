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
  const rituaisList     = $('#rituais-list');
  const itensList       = $('#itens-list');
  const addHabBtn       = $('#add-habilidade');
  const addRitualBtn    = $('#add-ritual');
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

  addHabBtn.addEventListener("click", () => {
    const newRow = criarHabilidadeRow();
    habilidadesList.appendChild(newRow);
  });

  // ======================
  // CRIAR RITUAL
  // ======================

  addRitualBtn.addEventListener("click", () => {
    const newRow = criarRitualRow();
    rituaisList.appendChild(newRow);
  });


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
      descricao: r.querySelector('.hab-desc')?.value || "",
      pagina:    r.querySelector('.hab-pagina')?.value || ""
    }));
  }

  function collectRituais() {
    return $$('.ritual-row').map(r => ({
      nome:        r.querySelector('.ritual-nome')?.value || "",
      pd:          r.querySelector('.ritual-pd')?.value || "",
      descricao:   r.querySelector('.ritual-desc')?.value || "",
      alvo:        r.querySelector('.ritual-alvo')?.value || "",
      alcance:     r.querySelector('.ritual-alcance')?.value || "",
      resistencia: r.querySelector('.ritual-resistencia')?.value || "",
      elemento:    r.querySelector('.ritual-elemento')?.value || ""
    }));
  }

  function collectPericias() {
    return $$('.per-row').map(r => ({
      nome: (r.querySelector('span')?.textContent || '').trim(),
      valor: r.querySelector('input')?.value || ''
    }));
  }

  function collectAtaques() {
    return $$('.ataque-row').map(r => {
      const inputs = Array.from(r.querySelectorAll('input'));
      return {
        nome: inputs[0]?.value || '',
        teste: inputs[1]?.value || '',
        dano: inputs[2]?.value || '',
        crit: inputs[3]?.value || ''
      };
    });
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
      rituais: collectRituais(),
      rituais_dt: $('#rituais_dt')?.value || "",
      pericias: collectPericias(),
      ataques: collectAtaques(),
      itens: collectItens(),
      categorias: {
        cat1: $('#cat1')?.value || "",
        cat2: $('#cat2')?.value || "",
        cat3: $('#cat3')?.value || "",
        cat4: $('#cat4')?.value || ""
      },
      carga: {
        atual: $('#carga_atual')?.value || "",
        max: $('#carga_max')?.value || ""
      },
      anotacoes: {
        aparencia: $('#anot_aparencia')?.value || "",
        anotacoes: $('#anot_anotacoes')?.value || "",
        outro: $('#anot_outro')?.value || ""
      }
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

    // Apply anotacoes (if present under data.anotacoes or data.meta.anotacoes)
    const anot = data.anotacoes || (data.meta && data.meta.anotacoes) || {};
    if (anot) {
      const a1 = $('#anot_aparencia'); if (a1) a1.value = anot.aparencia || '';
      const a2 = $('#anot_anotacoes'); if (a2) a2.value = anot.anotacoes || '';
      const a3 = $('#anot_outro'); if (a3) a3.value = anot.outro || '';
    }

    if (data.atributos) {
      Object.keys(data.atributos).forEach(k => {
        const el = document.getElementById(k);
        if (el) el.value = data.atributos[k];
      });
      if (typeof updateRadar === "function") updateRadar();
    }

    habilidadesList.innerHTML = "";
    (data.habilidades || []).forEach(h => {
      const newRow = criarHabilidadeRow(h);
      habilidadesList.appendChild(newRow);
    });

    rituaisList.innerHTML = "";
    (data.rituais || []).forEach(r => {
      const newRow = criarRitualRow(r);
      rituaisList.appendChild(newRow);
    });

    const rituaisDtEl = $('#rituais_dt');
    if (rituaisDtEl) rituaisDtEl.value = data.rituais_dt || "";

    // Apply perícias (match by name if possible)
    if (data.pericias && Array.isArray(data.pericias)) {
      const rows = $$('.per-row');
      data.pericias.forEach(p => {
        const name = (p.nome || '').trim().toLowerCase();
        const match = rows.find(r => (r.querySelector('span')?.textContent || '').trim().toLowerCase() === name);
        if (match) {
          const inp = match.querySelector('input');
          if (inp) inp.value = p.valor || '';
        }
      });
    }

    // Apply ataques: ensure there are enough rows, then fill
    if (data.ataques && Array.isArray(data.ataques)) {
      const container = document.querySelector('.ataques-list');
      if (container) {
        let rows = Array.from(container.querySelectorAll('.ataque-row'));
        // add extra rows if needed
        while (rows.length < data.ataques.length) {
          const newRow = document.createElement('div');
          newRow.className = 'ataque-row';
          newRow.innerHTML = '<input type="text" placeholder="Nome do ataque">\n            <input type="text" placeholder="Teste (ex: 3d20 +5)">\n            <input type="text" placeholder="Dano (ex: 1d8+2)">\n            <input type="text" placeholder="Crítico (ex: 18 x3)">';
          container.appendChild(newRow);
          rows = Array.from(container.querySelectorAll('.ataque-row'));
        }

        data.ataques.forEach((a, i) => {
          const r = rows[i];
          if (!r) return;
          const inputs = r.querySelectorAll('input');
          if (inputs[0]) inputs[0].value = a.nome || '';
          if (inputs[1]) inputs[1].value = a.teste || '';
          if (inputs[2]) inputs[2].value = a.dano || '';
          if (inputs[3]) inputs[3].value = a.crit || '';
        });
      }
    }

    // Apply categorias (cat1..cat4) and carga
    if (data.categorias) {
      ['cat1','cat2','cat3','cat4'].forEach(k => {
        const el = $('#' + k);
        if (el && data.categorias[k] !== undefined) el.value = data.categorias[k];
      });
    }

    if (data.carga) {
      const ca = $('#carga_atual'); if (ca) ca.value = (data.carga.atual !== undefined && data.carga.atual !== null) ? data.carga.atual : '';
      const cm = $('#carga_max'); if (cm) cm.value = (data.carga.max !== undefined && data.carga.max !== null) ? data.carga.max : '';
    }

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
    rituaisList.innerHTML = "";
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
