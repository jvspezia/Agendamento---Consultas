// ===== VARIÁVEIS GLOBAIS =====
let especialidadeSelecionada = '';
let horarioSelecionado = '';

// ===== TEMA CLARO/ESCURO =====
function aplicarTema() {
  const tema = localStorage.getItem('tema') || 'claro';
  document.body.setAttribute('data-theme', tema);
  const btn = document.getElementById('btnTema');
  if (btn) btn.innerHTML = tema === 'escuro' ? '☀️' : '🌙';
}

function alternarTema() {
  const atual = localStorage.getItem('tema') || 'claro';
  const novo = atual === 'claro' ? 'escuro' : 'claro';
  localStorage.setItem('tema', novo);
  aplicarTema();
}

document.addEventListener('DOMContentLoaded', aplicarTema);

// ===== ETAPAS =====
function irEtapa2() {
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const nascimento = document.getElementById('nascimento').value;

  if (!nome || !telefone || !nascimento) {
    alert('Por favor, preencha todos os campos antes de continuar.');
    return;
  }

  document.getElementById('etapa1').classList.add('d-none');
  document.getElementById('etapa2').classList.remove('d-none');
  document.getElementById('dot2').classList.add('active');
  window.scrollTo(0, 0);
}

function voltarEtapa1() {
  document.getElementById('etapa2').classList.add('d-none');
  document.getElementById('etapa1').classList.remove('d-none');
  document.getElementById('dot2').classList.remove('active');
  window.scrollTo(0, 0);
}

function irEtapa3() {
  if (!especialidadeSelecionada) {
    alert('Por favor, selecione uma especialidade.');
    return;
  }

  document.getElementById('etapa2').classList.add('d-none');
  document.getElementById('etapa3').classList.remove('d-none');
  document.getElementById('dot3').classList.add('active');
  window.scrollTo(0, 0);
}

function voltarEtapa2() {
  document.getElementById('etapa3').classList.add('d-none');
  document.getElementById('etapa2').classList.remove('d-none');
  document.getElementById('dot3').classList.remove('active');
  window.scrollTo(0, 0);
}

// ===== SELEÇÃO DE ESPECIALIDADE =====
function selecionarEspec(el, nome) {
  document.querySelectorAll('.espec-card').forEach(c => c.classList.remove('selecionado'));
  el.classList.add('selecionado');
  especialidadeSelecionada = nome;
}

// ===== SELEÇÃO DE HORÁRIO =====
function selecionarHorario(el, hora) {
  document.querySelectorAll('.horario-card').forEach(c => c.classList.remove('selecionado'));
  el.classList.add('selecionado');
  horarioSelecionado = hora;
}

// ===== CONFIRMAR AGENDAMENTO =====
function confirmarAgendamento() {
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const nascimento = document.getElementById('nascimento').value;
  const dataConsulta = document.getElementById('dataConsulta').value;
  const obs = document.getElementById('obs').value.trim();

  if (!dataConsulta) {
    alert('Por favor, selecione a data da consulta.');
    return;
  }

  if (!horarioSelecionado) {
    alert('Por favor, selecione um horário.');
    return;
  }

  const consulta = {
    id: Date.now(),
    nome,
    telefone,
    nascimento,
    especialidade: especialidadeSelecionada,
    data: dataConsulta,
    horario: horarioSelecionado,
    obs,
    status: 'Confirmado'
  };

  const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  consultas.push(consulta);
  localStorage.setItem('consultas', JSON.stringify(consultas));
  localStorage.setItem('ultimaConsulta', JSON.stringify(consulta));

  window.location.href = 'confirmacao.html';
}

// ===== PAINEL =====
function carregarConsultas() {
  const lista = document.getElementById('listaConsultas');
  if (!lista) return;

  const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');

  if (consultas.length === 0) {
    lista.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="bi bi-calendar-x" style="font-size:3rem"></i>
        <p class="mt-3">Nenhuma consulta agendada ainda.</p>
        <a href="agendar.html" class="btn btn-primary-blue mt-2">Agendar agora</a>
      </div>`;
    return;
  }

  lista.innerHTML = consultas.reverse().map(c => `
    <div class="consulta-card">
      <div class="consulta-header">
        <span class="badge-espec">${c.especialidade}</span>
        <span class="badge-status">${c.status}</span>
      </div>
      <h5 class="fw-bold mt-2">${c.nome}</h5>
      <p class="mb-1"><i class="bi bi-calendar3 me-2 text-primary"></i>${formatarData(c.data)} às ${c.horario}</p>
      <p class="mb-1"><i class="bi bi-telephone me-2 text-primary"></i>${c.telefone}</p>
      ${c.obs ? `<p class="mb-0 text-muted"><i class="bi bi-chat-left-text me-2"></i>${c.obs}</p>` : ''}
      <button class="btn btn-danger btn-sm mt-3 w-100" onclick="cancelarConsulta(${c.id})">
        <i class="bi bi-x-circle me-2"></i>Cancelar Consulta
      </button>
    </div>
  `).join('');
}

function cancelarConsulta(id) {
  if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;
  let consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  consultas = consultas.filter(c => c.id !== id);
  localStorage.setItem('consultas', JSON.stringify(consultas));
  carregarConsultas();
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

// ===== CONFIRMAÇÃO =====
function carregarConfirmacao() {
  const div = document.getElementById('dadosConfirmacao');
  if (!div) return;

  const c = JSON.parse(localStorage.getItem('ultimaConsulta'));
  if (!c) {
    window.location.href = 'index.html';
    return;
  }

  div.innerHTML = `
    <p><i class="bi bi-person-fill me-2 text-primary"></i><strong>Paciente:</strong> ${c.nome}</p>
    <p><i class="bi bi-hospital-fill me-2 text-primary"></i><strong>Especialidade:</strong> ${c.especialidade}</p>
    <p><i class="bi bi-calendar3 me-2 text-primary"></i><strong>Data:</strong> ${formatarData(c.data)}</p>
    <p><i class="bi bi-clock me-2 text-primary"></i><strong>Horário:</strong> ${c.horario}</p>
    <p><i class="bi bi-telephone me-2 text-primary"></i><strong>Telefone:</strong> ${c.telefone}</p>
    ${c.obs ? `<p><i class="bi bi-chat-left-text me-2 text-primary"></i><strong>Observação:</strong> ${c.obs}</p>` : ''}
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  aplicarTema();
  carregarConsultas();
  carregarConfirmacao();
});