let presentes = [];
let presenteSelecionado = null;
let filtroAtual = "todos";

const lista = document.getElementById("listaPresentes");
const contador = document.getElementById("contador");
const filtro = document.getElementById("filtroCategoria");
const modal = document.getElementById("modal");

async function carregarPresentes() {
  try {
    if (!API_URL) {
      presentes = PRESENTES_DEMO;
    } else {
      const resposta = await fetch(API_URL);
      presentes = await resposta.json();
    }
    montarCategorias();
    renderizar();
  } catch (erro) {
    contador.textContent = "Não foi possível carregar a lista. Verifique a configuração.";
    console.error(erro);
  }
}

function montarCategorias() {
  const categorias = [...new Set(presentes.map(p => p.categoria).filter(Boolean))];
  filtro.innerHTML = '<option value="todos">Todos</option>' + categorias.map(c => `<option value="${c}">${c}</option>`).join("");
}

filtro.addEventListener("change", () => {
  filtroAtual = filtro.value;
  renderizar();
});

function renderizar() {
  const disponiveis = presentes.filter(p => !p.reservado && (filtroAtual === "todos" || p.categoria === filtroAtual));
  contador.textContent = `${disponiveis.length} presente(s) disponível(is)`;
  document.getElementById("mensagemVazia").classList.toggle("hidden", disponiveis.length !== 0);
  lista.innerHTML = disponiveis.map(p => `
    <article class="gift-card">
      <img src="${p.foto || 'img/presente.svg'}" alt="${p.nome}" onerror="this.src='img/presente.svg'">
      <div class="gift-info">
        <span class="category">${p.categoria || 'Presente'}</span>
        <h3>${p.nome}</h3>
        <p class="price">${p.valor || ''}</p>
        <button class="btn-primary" onclick="abrirModal('${p.id}')">Reservar presente</button>
      </div>
    </article>
  `).join("");
}

function abrirModal(id) {
  presenteSelecionado = presentes.find(p => p.id === id);
  if (!presenteSelecionado) return;
  document.getElementById("modalFoto").src = presenteSelecionado.foto || "img/presente.svg";
  document.getElementById("modalTitulo").textContent = presenteSelecionado.nome;
  document.getElementById("modalValor").textContent = presenteSelecionado.valor || "";
  document.getElementById("nomeConvidado").value = "";
  document.getElementById("mensagemConvidado").value = "";
  document.getElementById("modalAviso").textContent = "";
  modal.classList.remove("hidden");
}

function fecharModal() {
  modal.classList.add("hidden");
}

async function confirmarReserva() {
  const nome = document.getElementById("nomeConvidado").value.trim();
  const mensagem = document.getElementById("mensagemConvidado").value.trim();
  const aviso = document.getElementById("modalAviso");

  if (!nome) {
    aviso.textContent = "Informe seu nome para reservar.";
    return;
  }

  if (!API_URL) {
    presentes = presentes.map(p => p.id === presenteSelecionado.id ? { ...p, reservado: true } : p);
    fecharModal();
    renderizar();
    alert("Reserva simulada. Configure o Google Apps Script para salvar de verdade.");
    return;
  }

  aviso.textContent = "Reservando...";

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ id: presenteSelecionado.id, nome, mensagem }),
    });
    const dados = await resposta.json();

    if (!dados.ok) {
      aviso.textContent = dados.erro || "Esse item já foi reservado.";
      await carregarPresentes();
      return;
    }

    fecharModal();
    await carregarPresentes();
    alert("Presente reservado com sucesso. Muito obrigado!");
  } catch (erro) {
    aviso.textContent = "Erro ao reservar. Tente novamente.";
    console.error(erro);
  }
}

carregarPresentes();
