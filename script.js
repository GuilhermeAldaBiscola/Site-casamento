let presentes = [];
let presenteSelecionado = null;

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {
  await carregarPresentes();
  configurarFiltro();
  renderizarPresentes();
}

async function carregarPresentes() {
  try {
    if (!API_URL || API_URL.includes("SUA_URL")) {
      throw new Error("API_URL não configurada");
    }

    const resposta = await fetch(API_URL);
    if (!resposta.ok) throw new Error("Erro HTTP " + resposta.status);

    const dados = await resposta.json();
    const lista = Array.isArray(dados) ? dados : (Array.isArray(dados.presentes) ? dados.presentes : []);

    if (!lista.length) throw new Error("Lista vazia ou retorno inválido");

    presentes = lista
      .map(normalizarPresente)
      .filter(item => !ehPix(item));
  } catch (erro) {
    console.warn("Usando lista demo:", erro);
    presentes = (PRESENTES_DEMO || []).map(normalizarPresente).filter(item => !ehPix(item));
  }

  presentes.unshift(normalizarPresente(PIX_ITEM));
}

function normalizarPresente(item) {
  return {
    id: String(item.id || "").trim(),
    nome: String(item.nome || "").trim(),
    valor: String(item.valor || "").trim(),
    categoria: String(item.categoria || "Outros").trim(),
    foto: String(item.foto || "img/presente.svg").trim(),
    descricao: String(item.descricao || item.descrição || "").trim(),
    link_loja: String(item.link_loja || item.link || item.loja || item.produto || "").trim(),
    reservado: String(item.reservado || "").trim(),
    convidado: String(item.convidado || "").trim(),
    mensagem: String(item.mensagem || "").trim(),
    data: String(item.data || "").trim()
  };
}

function ehPix(item) {
  return String(item.categoria || "").toLowerCase() === "pix" || String(item.id || "").toLowerCase().startsWith("pix");
}

function configurarFiltro() {
  const filtro = document.getElementById("filtroCategoria");
  const categorias = [...new Set(presentes.map(p => p.categoria).filter(Boolean))].sort();

  filtro.innerHTML = '<option value="todos">Todos</option>';
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filtro.appendChild(option);
  });

  filtro.onchange = renderizarPresentes;
}

function renderizarPresentes() {
  const lista = document.getElementById("listaPresentes");
  const vazia = document.getElementById("mensagemVazia");
  const filtro = document.getElementById("filtroCategoria").value;

  lista.innerHTML = "";

  const disponiveis = presentes.filter(item => {
    const passaFiltro = filtro === "todos" || item.categoria === filtro;
    const disponivel = ehPix(item) || !item.reservado;
    return passaFiltro && disponivel;
  });

  if (disponiveis.length === 0) {
    vazia.classList.remove("hidden");
    return;
  }
  vazia.classList.add("hidden");

  disponiveis.forEach(item => {
    const card = document.createElement("article");
    card.className = ehPix(item) ? "gift-card pix-card" : "gift-card";

    card.innerHTML = `
      <img src="${escaparAtributo(item.foto)}" alt="${escaparAtributo(item.nome)}" onerror="this.src='img/presente.svg'" />
      <div class="gift-info">
        <p class="category">${escaparHTML(item.categoria)}</p>
        <h3>${escaparHTML(item.nome)}</h3>
        <p class="price">${escaparHTML(item.valor)}</p>
        <button class="btn-primary full" onclick="abrirModal('${escaparAtributo(item.id)}')">
          ${ehPix(item) ? "Fazer Pix" : "Ver detalhes"}
        </button>
      </div>
    `;

    lista.appendChild(card);
  });
}

function abrirModal(id) {
  presenteSelecionado = presentes.find(p => p.id === id);
  if (!presenteSelecionado) return;

  const isPix = ehPix(presenteSelecionado);
  const modalFoto = document.getElementById("modalFoto");
  modalFoto.src = presenteSelecionado.foto || "img/presente.svg";
  modalFoto.classList.toggle("pix-modal-icon", isPix);

  document.getElementById("modalCategoria").textContent = presenteSelecionado.categoria;
  document.getElementById("modalTitulo").textContent = presenteSelecionado.nome;
  document.getElementById("modalValor").textContent = presenteSelecionado.valor;
  document.getElementById("modalDescricao").textContent = presenteSelecionado.descricao || "Sem descrição detalhada cadastrada.";

  const link = document.getElementById("modalLinkLoja");
  if (!isPix && presenteSelecionado.link_loja) {
    link.href = presenteSelecionado.link_loja;
    link.classList.remove("hidden");
  } else {
    link.href = "#";
    link.classList.add("hidden");
  }

  document.getElementById("modalAviso").textContent = "";
  limparCampos();

  if (isPix) {
    document.getElementById("areaReserva").classList.add("hidden");
    document.getElementById("areaPix").classList.remove("hidden");
    document.getElementById("pixChaveTexto").textContent = PIX_KEY;
    document.getElementById("pixQrCode").src = PIX_QR_CODE;
  } else {
    document.getElementById("areaPix").classList.add("hidden");
    document.getElementById("areaReserva").classList.remove("hidden");
  }

  document.getElementById("modal").classList.remove("hidden");
}

function limparCampos() {
  ["nomeConvidado", "mensagemConvidado", "pixNome", "pixValor", "pixMensagem"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
  presenteSelecionado = null;
}

async function confirmarReserva() {
  if (!presenteSelecionado || ehPix(presenteSelecionado)) return;

  const nome = document.getElementById("nomeConvidado").value.trim();
  const mensagem = document.getElementById("mensagemConvidado").value.trim();
  const aviso = document.getElementById("modalAviso");

  if (!nome) {
    aviso.textContent = "Informe seu nome para confirmar a reserva.";
    return;
  }

  try {
    aviso.textContent = "Reservando...";

    const resposta = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        tipo: "reserva",
        id: presenteSelecionado.id,
        convidado: nome,
        mensagem: mensagem
      })
    });

    const retorno = await resposta.json();

    if (!retorno.success && retorno.status !== "ok") {
      throw new Error(retorno.message || "Não foi possível reservar.");
    }

    presenteSelecionado.reservado = "SIM";
    presenteSelecionado.convidado = nome;
    aviso.textContent = "Presente reservado com sucesso. Obrigado!";
    setTimeout(() => {
      fecharModal();
      renderizarPresentes();
    }, 900);

  } catch (erro) {
    console.error(erro);
    aviso.textContent = "Não foi possível reservar agora. Tente novamente.";
  }
}

async function copiarPix() {
  const aviso = document.getElementById("modalAviso");
  try {
    await navigator.clipboard.writeText(PIX_KEY);
    aviso.textContent = "Chave Pix copiada com sucesso!";
  } catch (erro) {
    aviso.textContent = "Chave Pix: " + PIX_KEY;
  }
}

async function avisarPix() {
  const nome = document.getElementById("pixNome").value.trim();
  const valor = document.getElementById("pixValor").value.trim();
  const mensagem = document.getElementById("pixMensagem").value.trim();
  const aviso = document.getElementById("modalAviso");

  if (!nome) {
    aviso.textContent = "Informe seu nome para enviar o aviso.";
    return;
  }

  if (!valor) {
    aviso.textContent = "Informe o valor do Pix para os noivos identificarem.";
    return;
  }

  try {
    aviso.textContent = "Enviando aviso...";

    const resposta = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        tipo: "pix",
        nome: nome,
        valor: valor,
        mensagem: mensagem
      })
    });

    const retorno = await resposta.json();

    if (!retorno.success && retorno.status !== "ok") {
      throw new Error(retorno.message || "Não foi possível registrar o aviso.");
    }

    aviso.textContent = "Aviso enviado com sucesso. Muito obrigado!";
    setTimeout(() => fecharModal(), 1200);

  } catch (erro) {
    console.error(erro);
    aviso.textContent = "Não foi possível enviar o aviso agora. Confira se o Apps Script foi atualizado.";
  }
}

function escaparHTML(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escaparAtributo(texto) {
  return escaparHTML(texto);
}
