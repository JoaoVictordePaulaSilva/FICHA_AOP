// assets/js/save_load.js
// Salvamento/Carregamento JSON + Export PDF (single page) + Nova ficha
(() => {
  // short helpers
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const filenameFor = (name, ext) => {
    const safe = (name || 'ficha').trim().replace(/\s+/g,'_').replace(/[^\w\-]/g,'');
    const stamp = new Date().toISOString().replace(/[:.]/g,'-');
    return `${safe || 'ficha'}_${stamp}.${ext}`;
  };

  // UI elements (these IDs/classes come from the HTML snippet below)
  const btnDownloadJSON = $('#download-json');
  const btnLoadJSON = $('#load-json'); // optional (label)
  const fileInput = $('#file-input');
  const btnExportPDF = $('#export-pdf');
  const btnNova = $('#nova-ficha');
  const statusEl = $('#save-status');

  const habilidadesList = $('#habilidades-list');
  const addHabBtn = $('#add-habilidade');
  const itensList = $('#itens-list');
  const addItemBtn = $('#add-item');

  // ------------------------
  // Factories (create DOM rows compatible with your CSS)
  // ------------------------
  function criarHabilidadeRow(prefill = {}) {
    const div = document.createElement('div');
    div.className = 'hab-row';
    // structure matches your CSS grid: Nome | PD | DT | Descrição | Página | Elemento | X
    div.innerHTML = `
      <input class="hab-nome" placeholder="Nome da Habilidade">
      <input class="hab-pd" placeholder="PD">
      <input class="hab-dt" placeholder="DT">
      <textarea class="hab-desc" placeholder="Descrição"></textarea>
      <input class="hab-pagina" placeholder="Página">
      <select class="hab-elemento">
        <option value="">—</option>
        <option value="Morte">Morte</option>
        <option value="Energia">Energia</option>
        <option value="Sangue">Sangue</option>
        <option value="Conhecimento">Conhecimento</option>
        <option value="Medo">Medo</option>
      </select>
      <div class="elemento-box"><img src="assets/img/Geral/Transcendência.png" alt="icon"></div>
      <button class="btn-remove" title="Remover">X</button>
    `;
    // prefill
    div.querySelector('.hab-nome').value = prefill.nome || '';
    div.querySelector('.hab-pd').value = prefill.pd || prefill.custo || '';
    div.querySelector('.hab-dt').value = prefill.dt || '';
    div.querySelector('.hab-desc').value = prefill.descricao || prefill.desc || '';
    div.querySelector('.hab-pagina').value = prefill.pagina || prefill.pagina || '';
    div.querySelector('.hab-elemento').value = prefill.elemento || '';

    // element icon sync
    const sel = div.querySelector('.hab-elemento');
    const img = div.querySelector('.elemento-box img');
    sel.addEventListener('change', () => {
      const val = sel.value;
      img.src = val ? `assets/img/Geral/${val}.png` : 'assets/img/Geral/Transcendência.png';
    });
    // remove
    div.querySelector('.btn-remove').addEventListener('click', () => div.remove());
    habilidadesList.appendChild(div);
    return div;
  }

  function criarItemRow(prefill = {}) {
    const div = document.createElement('div');
    div.className = 'item-row';
    // we'll match your visual grid — but use class names so save/load works
    div.innerHTML = `
      <input class="item-nome" placeholder="Nome do Item">
      <textarea class="item-desc" placeholder="Descrição"></textarea>
      <input class="item-qtd" placeholder="Qtd" type="number" min="0">
      <input class="item-cat" placeholder="Cat (1-4)" type="number" min="1" max="4">
      <button class="item-remove" title="Remover">X</button>
    `;
    if (prefill) {
      div.querySelector('.item-nome').value = prefill.nome || '';
      div.querySelector('.item-desc').value = prefill.descricao || prefill.desc || '';
      div.querySelector('.item-qtd').value = prefill.quantidade || prefill.qtd || '';
      div.querySelector('.item-cat').value = prefill.categoria || prefill.cat || '';
    }
    div.querySelector('.item-remove').addEventListener('click', () => div.remove());
    itensList.appendChild(div);
    return div;
  }

  // ------------------------
  // Collectors (read DOM → JS object)
  // ------------------------
  function collectPericias() {
    // per-row structure: <div class="per-row"><span>Nome</span><input></div>
    return $$('#pericias .per-row').map(r => {
      const nome = r.querySelector('span')?.textContent?.trim() || '';
      const input = r.querySelector('input');
      const valor = input ? input.value : '';
      return { nome, valor };
    });
  }

  function collectAtributos() {
    const keys = ['FOR','AGI','INT','PRE','VIG'];
    const out = {};
    keys.forEach(k => {
      const el = document.getElementById(k);
      out[k] = el ? el.value : '';
    });
    return out;
  }

  function collectAtaques() {
    // your original ataque-row has 4 inputs (no special classes). We'll read in order.
    const rows = $$('.ataque-row');
    return rows.map(r => {
      const inputs = Array.from(r.querySelectorAll('input'));
      return {
        nome: (inputs[0]?.value || '').toString(),
        teste: (inputs[1]?.value || '').toString(),
        dano: (inputs[2]?.value || '').toString(),
        crit: (inputs[3]?.value || '').toString()
      };
    });
  }

  function collectHabilidades() {
      return $$('.hab-row')
        .map(r => ({
          nome: r.querySelector('.hab-nome')?.value || '',
          pd: r.querySelector('.hab-pd')?.value || '',
          dt: r.querySelector('.hab-dt')?.value || '',
          descricao: r.querySelector('.hab-desc')?.value || '',
          pagina: r.querySelector('.hab-pagina')?.value || '',
          elemento: r.querySelector('.hab-elemento')?.value || ''
        }))
        .filter(h => h.nome || h.pd || h.dt || h.descricao || h.pagina || h.elemento);
  }

  function collectItens() {
      return $$('.item-row')
        .map(r => ({
          nome: r.querySelector('.item-nome')?.value || '',
          descricao: r.querySelector('.item-desc')?.value || '',
          quantidade: r.querySelector('.item-qtd')?.value || '',
          categoria: r.querySelector('.item-cat')?.value || ''
        }))
        .filter(i => i.nome || i.descricao || i.quantidade || i.categoria);
  }

  function collectCategorias() {
    // your HTML uses ids cat1..cat4
    return {
      cat1: ($('#cat1')?.value) || '',
      cat2: ($('#cat2')?.value) || '',
      cat3: ($('#cat3')?.value) || '',
      cat4: ($('#cat4')?.value) || ''
    };
  }

  function collectFicha() {
    return {
      meta: {
        nome_personagem: ($('#nome_personagem')?.value) || '',
        nome_jogador: ($('#nome_jogador')?.value) || '',
        origem: ($('#origem')?.value) || '',
        classe: ($('#classe')?.value) || '',
        trilha: ($('#trilha')?.value) || '',
        nex: ($('#nex')?.value) || '',
        nivel: ($('#nivel')?.value) || '',
        limite_pd: ($('#limite_pd')?.value) || '',
        pv_atual: ($('#pv_atual')?.value) || '',
        pv_max: ($('#pv_max')?.value) || '',
        pd_atual: ($('#pd_atual')?.value) || '',
        pd_max: ($('#pd_max')?.value) || '',
        def_valor: ($('#def_valor')?.value) || '',
        resistencias: ($('#resistencias')?.value) || '',
        protecao: ($('#protecao')?.value) || ''
      },
      pericias: collectPericias(),
      atributos: collectAtributos(),
      ataques: collectAtaques(),
      habilidades: collectHabilidades(),
      categorias: collectCategorias(),
      carga: {
        atual: ($('#carga_atual')?.value) || '',
        max: ($('#carga_max')?.value) || ''
      },
      itens: collectItens()
    };
  }

  // ------------------------
  // Apply helpers (JS object → DOM)
  // ------------------------
  function applyFicha(data) {
    if (!data) return;
    const m = data.meta || {};
    if ($('#nome_personagem')) $('#nome_personagem').value = m.nome_personagem || '';
    if ($('#nome_jogador')) $('#nome_jogador').value = m.nome_jogador || '';
    if ($('#origem')) $('#origem').value = m.origem || '';
    if ($('#classe')) $('#classe').value = m.classe || '';
    if ($('#trilha')) $('#trilha').value = m.trilha || '';
    if ($('#nex')) $('#nex').value = m.nex || '';
    if ($('#nivel')) $('#nivel').value = m.nivel || '';
    if ($('#limite_pd')) $('#limite_pd').value = m.limite_pd || '';
    if ($('#pv_atual')) $('#pv_atual').value = m.pv_atual || '';
    if ($('#pv_max')) $('#pv_max').value = m.pv_max || '';
    if ($('#pd_atual')) $('#pd_atual').value = m.pd_atual || '';
    if ($('#pd_max')) $('#pd_max').value = m.pd_max || '';
    if ($('#def_valor')) $('#def_valor').value = m.def_valor || '';
    if ($('#resistencias')) $('#resistencias').value = m.resistencias || '';
    if ($('#protecao')) $('#protecao').value = m.protecao || '';

    // pericias: try to match by name text in span
    if (Array.isArray(data.pericias)) {
      data.pericias.forEach(p => {
        const row = $$('#pericias .per-row').find(r => (r.querySelector('span')?.textContent || '').trim() === (p.nome || '').trim());
        if (row) {
          const i = row.querySelector('input');
          if (i) i.value = p.valor ?? p.valor === 0 ? p.valor : (p.bonus ?? '');
        }
      });
    }

    // atributos
    if (data.atributos) {
      ['FOR','AGI','INT','PRE','VIG'].forEach(k => {
        const el = document.getElementById(k);
        if (el && typeof data.atributos[k] !== 'undefined') el.value = data.atributos[k];
      });
      if (typeof window.updateRadar === 'function') window.updateRadar();
    }

    // ataques: rebuild container
    const atkContainer = document.querySelector('.ataques-list');
    if (atkContainer && Array.isArray(data.ataques)) {
      atkContainer.innerHTML = '';
      data.ataques.forEach(atk => {
        const row = document.createElement('div');
        row.className = 'ataque-row';
        row.innerHTML = `
          <input type="text" value="${escapeHtml(atk.nome || '')}" placeholder="Nome do ataque">
          <input type="text" value="${escapeHtml(atk.teste || '')}" placeholder="Teste (ex: 3d20 +5)">
          <input type="text" value="${escapeHtml(atk.dano || '')}" placeholder="Dano (ex: 1d8+2)">
          <input type="text" value="${escapeHtml(atk.crit || '')}" placeholder="Crítico (ex: 18 x3)">
        `;
        atkContainer.appendChild(row);
      });
    }

    // habilidades: clear and rebuild
    if (habilidadesList) {
      habilidadesList.innerHTML = '';
      if (Array.isArray(data.habilidades)) data.habilidades.forEach(h => criarHabilidadeRow({
        nome: h.nome, pd: h.pd || h.custo, dt: h.dt, descricao: h.descricao, pagina: h.pagina || h.pagina, elemento: h.elemento
      }));
    }

    // categorias (ids cat1..cat4)
    if (data.categorias) {
      if ($('#cat1')) $('#cat1').value = data.categorias.cat1 ?? data.categorias.cat_1 ?? '';
      if ($('#cat2')) $('#cat2').value = data.categorias.cat2 ?? data.categorias.cat_2 ?? '';
      if ($('#cat3')) $('#cat3').value = data.categorias.cat3 ?? data.categorias.cat_3 ?? '';
      if ($('#cat4')) $('#cat4').value = data.categorias.cat4 ?? data.categorias.cat_4 ?? '';
    }

    // carga
    if (data.carga) {
      if ($('#carga_atual')) $('#carga_atual').value = data.carga.atual || '';
      if ($('#carga_max')) $('#carga_max').value = data.carga.max || '';
    }

    // itens
    if (itensList) {
      itensList.innerHTML = '';
      if (Array.isArray(data.itens)) data.itens.forEach(it => criarItemRow({
        nome: it.nome, descricao: it.descricao, quantidade: it.quantidade, categoria: it.categoria
      }));
    }

    status('Ficha carregada.');
  }

  // small helper to escape string when injecting into value attr
  function escapeHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ------------------------
  // Actions: Download / Load / Nova / Export PDF
  // ------------------------
  function downloadJSON() {
    const data = collectFicha();
    const nome = ($('#nome_personagem')?.value) || 'ficha';
    const filename = filenameFor(nome, 'json');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    status(`JSON salvo: ${filename}`);
  }

  function handleLoadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const obj = JSON.parse(e.target.result);
        applyFicha(obj);
      } catch (err) {
        alert('Arquivo inválido: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function exportPDFsingle() {
    // requires html2canvas and jsPDF loaded in HTML
    if (typeof html2canvas !== 'function' || typeof window.jspdf === 'undefined') {
      alert('Para exportar em PDF é necessário incluir html2canvas e jsPDF (veja instruções).');
      return;
    }
    status('Gerando imagem...');

    // choose capture element: layout + header (adjust if you want other region)
    const captureEl = document.body;
    const scale = 2;
    html2canvas(captureEl, { scale, useCORS: true, backgroundColor: null }).then(canvas => {
      status('Renderizando PDF...');
      const imgData = canvas.toDataURL('image/png', 1.0);
      const { jsPDF } = window.jspdf || window; // jsPDF may be available as window.jspdf.jsPDF or window.jspdf
      // create pdf
      let pdf;
      try {
        // try constructor at window.jspdf.jsPDF
        if (window.jspdf && window.jspdf.jsPDF) {
          pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        } else if (typeof jsPDF === 'function') {
          pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        } else {
          pdf = new window.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        }
      } catch (e) {
        // fallback
        pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      }

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = canvas.width;
      const imgH = canvas.height;
      const scaleFactor = Math.min(pageW / imgW, pageH / imgH);

      const renderW = imgW * scaleFactor;
      const renderH = imgH * scaleFactor;
      const x = (pageW - renderW) / 2;
      const y = (pageH - renderH) / 2;

      pdf.addImage(imgData, 'PNG', x, y, renderW, renderH, undefined, 'FAST');
      const filename = filenameFor($('#nome_personagem')?.value || 'ficha', 'pdf');
      pdf.save(filename);
      status(`PDF exportado: ${filename}`);
    }).catch(err => {
      console.error(err);
      alert('Erro ao gerar PDF: ' + (err && err.message || err));
      status('Erro ao gerar PDF');
    });
  }

  function novaFicha() {
    if (!confirm('Criar nova ficha — isto limpará todos os campos. Continuar?')) return;
    // clear text/number/textarea inputs (ignore file inputs)
    document.querySelectorAll('input, textarea').forEach(i => {
      if (i.type === 'file') return;
      // keep numeric defaults? we clear everything for a truly new ficha
      i.value = '';
    });
    // pericias: set numeric inputs to 0 if exist
    $$('#pericias .per-row').forEach(r => {
      const i = r.querySelector('input');
      if (i) i.value = 0;
    });
    // reset ataques to five blank rows (your original markup had 5)
    const atk = document.querySelector('.ataques-list');
    if (atk) {
      atk.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.className = 'ataque-row';
        row.innerHTML = `
          <input type="text" placeholder="Nome do ataque">
          <input type="text" placeholder="Teste (ex: 3d20 +5)">
          <input type="text" placeholder="Dano (ex: 1d8+2)">
          <input type="text" placeholder="Crítico (ex: 18 x3)">
        `;
        atk.appendChild(row);
      }
    }

    // clear dynamic lists
    if (habilidadesList) habilidadesList.innerHTML = '';
    if (itensList) itensList.innerHTML = '';

    // reset categories & carga
    if ($('#cat1')) $('#cat1').value = '';
    if ($('#cat2')) $('#cat2').value = '';
    if ($('#cat3')) $('#cat3').value = '';
    if ($('#cat4')) $('#cat4').value = '';
    if ($('#carga_atual')) $('#carga_atual').value = '';
    if ($('#carga_max')) $('#carga_max').value = '';

    if (typeof window.updateRadar === 'function') window.updateRadar();
    status('Nova ficha pronta.');
  }

  function status(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    setTimeout(() => {
      if (statusEl && statusEl.textContent === msg) statusEl.textContent = '';
    }, 4000);
  }

  // ------------------------
  // Event wiring
  // ------------------------
  if (btnDownloadJSON) btnDownloadJSON.addEventListener('click', downloadJSON);

if (fileInput) {
    fileInput.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (f) handleLoadFile(f);
        fileInput.value = '';
    });
}

  if (btnExportPDF) btnExportPDF.addEventListener('click', exportPDFsingle);
  if (btnNova) btnNova.addEventListener('click', novaFicha);


  // expose utilities for console debugging
  window._fichaUtils = {
    collectFicha,
    applyFicha,
    criarHabilidadeRow,
    criarItemRow
  };

})();
