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

// ===== SPLASH SCREEN =====
function iniciarSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  gerarPatas('patasContainer');
  setTimeout(function () {
    splash.classList.add('hide');
    setTimeout(function () {
      splash.style.display = 'none';
      ativarFadeIns();
    }, 500);
  }, 2000);
}

// ===== PATAS FLUTUANTES =====
function gerarPatas(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < 10; i++) {
    const pata = document.createElement('div');
    pata.classList.add('pata-float');
    pata.innerText = '🐾';
    pata.style.left = Math.random() * 100 + '%';
    pata.style.animationDuration = (6 + Math.random() * 8) + 's';
    pata.style.animationDelay = (Math.random() * 6) + 's';
    pata.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    container.appendChild(pata);
  }
}

// ===== ANIMAÇÕES DE FADE-IN =====
function ativarFadeIns() {
  const elementos = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  elementos.forEach(function (el) { observer.observe(el); });
}

// ===== FORMATAÇÕES =====
function formatarCPF(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}

function formatarTelefone(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{2})(\d)/, '($1) $2');
  v = v.replace(/(\d{5})(\d)/, '$1-$2');
  input.value = v;
}

function formatarCEP(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 8);
  v = v.replace(/(\d{5})(\d)/, '$1-$2');
  input.value = v;
}

// ===== BUSCA DE CEP =====
async function buscarCEP() {
  const cepInput = document.getElementById('cep');
  const cep = cepInput.value.replace(/\D/g, '');
  if (cep.length !== 8) return;
  try {
    const res = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
    const data = await res.json();
    if (data.erro) { alert('CEP não encontrado.'); return; }
    document.getElementById('endereco').value = data.logradouro || '';
    document.getElementById('bairro').value = data.bairro || '';
    document.getElementById('cidade').value = data.localidade || '';
  } catch (e) {
    console.log('Erro ao buscar CEP');
  }
}

// ===== SALVAR DONO =====
function salvarDono() {
  const campos = ['nome', 'cpf', 'nascimento', 'telefone', 'email', 'cep', 'endereco', 'bairro', 'cidade'];
  for (let campo of campos) {
    const el = document.getElementById(campo);
    if (!el || !el.value.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      if (el) el.focus();
      return;
    }
  }

  const dono = {
    nome: document.getElementById('nome').value.trim(),
    cpf: document.getElementById('cpf').value.trim(),
    nascimento: document.getElementById('nascimento').value,
    telefone: document.getElementById('telefone').value.trim(),
    email: document.getElementById('email').value.trim(),
    cep: document.getElementById('cep').value.trim(),
    endereco: document.getElementById('endereco').value.trim(),
    bairro: document.getElementById('bairro').value.trim(),
    cidade: document.getElementById('cidade').value.trim(),
    comoConheceu: document.getElementById('comoConheceu') ? document.getElementById('comoConheceu').value : ''
  };

  localStorage.setItem('dadosDono', JSON.stringify(dono));
  window.location.href = 'cadastro-pet.html';
}

// ===== SELEÇÃO DE OPÇÕES =====
function selecionarOpcao(grupo, valor, el) {
  document.querySelectorAll('[data-grupo="' + grupo + '"]').forEach(function (btn) {
    btn.classList.remove('selecionado');
  });
  if (el) el.classList.add('selecionado');
  const input = document.getElementById('input_' + grupo);
  if (input) input.value = valor;
}

// ===== PREVIEW DE FOTO =====
function previewFoto() {
  const input = document.getElementById('fotoPet');
  const preview = document.getElementById('previewFoto');
  const placeholder = document.getElementById('fotoPlaceholder');
  const area = document.getElementById('uploadArea');
  if (!input.files || !input.files[0]) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    localStorage.setItem('fotoPet', e.target.result);
    if (preview) {
      preview.src = e.target.result;
      preview.classList.remove('d-none');
    }
    if (placeholder) placeholder.classList.add('d-none');
    if (area) area.style.borderColor = 'var(--primary)';
  };
  reader.readAsDataURL(input.files[0]);
}

// ===== SALVAR PET =====
function salvarPet() {
  const obrigatorios = ['nomePet', 'especie', 'raca', 'nascimentoPet', 'cor', 'peso', 'observacoesPet'];
  for (let campo of obrigatorios) {
    const el = document.getElementById(campo);
    if (!el || !el.value.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      if (el) el.focus();
      return;
    }
  }

  const sexo = document.getElementById('input_sexo') ? document.getElementById('input_sexo').value : '';
  const castrado = document.getElementById('input_castrado') ? document.getElementById('input_castrado').value : '';
  const vacinas = document.getElementById('input_vacinas') ? document.getElementById('input_vacinas').value : '';

  if (!sexo) { alert('Por favor, selecione o sexo do pet.'); return; }
  if (!castrado) { alert('Por favor, informe se o pet é castrado.'); return; }
  if (!vacinas) { alert('Por favor, informe se as vacinas estão em dia.'); return; }

  const pet = {
    nome: document.getElementById('nomePet').value.trim(),
    especie: document.getElementById('especie').value,
    raca: document.getElementById('raca').value.trim(),
    sexo: sexo,
    nascimento: document.getElementById('nascimentoPet').value,
    cor: document.getElementById('cor').value.trim(),
    peso: document.getElementById('peso').value.trim(),
    castrado: castrado,
    vacinas: vacinas,
    observacoes: document.getElementById('observacoesPet').value.trim()
  };

  localStorage.setItem('dadosPet', JSON.stringify(pet));
  window.location.href = 'agendar.html';
}

// ===== CARREGAR RESUMO NO AGENDAR =====
function carregarResumo() {
  const dono = JSON.parse(localStorage.getItem('dadosDono') || 'null');
  const pet = JSON.parse(localStorage.getItem('dadosPet') || 'null');
  const resumoDono = document.getElementById('resumoDono');
  const resumoPet = document.getElementById('resumoPet');
  if (resumoDono) resumoDono.textContent = dono ? dono.nome : 'Tutor não cadastrado';
  if (resumoPet) resumoPet.textContent = pet ? pet.nome + ' (' + pet.especie + ')' : 'Pet não cadastrado';
}

// ===== HORÁRIOS =====
let horarioSelecionado = '';
const todosHorarios = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

function renderizarHorarios(dataSelecionada) {
  const grid = document.getElementById('horariosGrid');
  if (!grid) return;
  const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  const ocupados = consultas.filter(function (c) { return c.data === dataSelecionada; }).map(function (c) { return c.horario; });
  horarioSelecionado = '';
  grid.innerHTML = '';
  todosHorarios.forEach(function (hora) {
    const div = document.createElement('div');
    div.classList.add('horario-card');
    div.textContent = hora;
    if (ocupados.includes(hora)) {
      div.classList.add('ocupado');
      div.title = 'Horário ocupado';
    } else {
      div.classList.add('disponivel');
      div.onclick = function () { selecionarHorario(div, hora); };
    }
    grid.appendChild(div);
  });
}

function selecionarHorario(el, hora) {
  document.querySelectorAll('.horario-card').forEach(function (c) { c.classList.remove('selecionado'); });
  el.classList.add('selecionado');
  horarioSelecionado = hora;
}

// ===== SELEÇÃO DE MOTIVO =====
function selecionarMotivo(el, texto) {
  document.querySelectorAll('.motivo-chip').forEach(function (c) { c.classList.remove('selecionado'); });
  el.classList.add('selecionado');
  const motivoEl = document.getElementById('motivo');
  if (motivoEl) motivoEl.value = texto;
}

// ===== ENVIAR EMAIL =====
async function enviarEmail(consulta, dono, pet) {
  try {
    const templateParams = {
      nome_dono: dono.nome,
      email_dono: dono.email,
      nome_pet: pet.nome,
      especie_pet: pet.especie,
      data_consulta: formatarData(consulta.data),
      horario_consulta: consulta.horario,
      motivo_consulta: consulta.motivo
    };

    await emailjs.send('Petconsulta', 'template_ynetch9', templateParams);
    console.log('Email enviado com sucesso!');
  } catch (error) {
    console.log('Erro ao enviar email:', error);
  }
}

// ===== CONFIRMAR AGENDAMENTO =====
async function confirmarAgendamento() {
  const dono = JSON.parse(localStorage.getItem('dadosDono') || 'null');
  const pet = JSON.parse(localStorage.getItem('dadosPet') || 'null');
  const dataConsulta = document.getElementById('dataConsulta') ? document.getElementById('dataConsulta').value : '';
  const motivo = document.getElementById('motivo') ? document.getElementById('motivo').value.trim() : '';

  const erro = document.getElementById('alertaErro');
  const msg = document.getElementById('mensagemErro');

  function mostrarErro(texto) {
    if (erro && msg) { msg.textContent = texto; erro.classList.remove('d-none'); }
    else alert(texto);
  }

  if (!dono) { mostrarErro('Cadastre seus dados antes de agendar.'); return; }
  if (!pet) { mostrarErro('Cadastre seu pet antes de agendar.'); return; }
  if (!dataConsulta) { mostrarErro('Selecione a data da consulta.'); return; }
  if (!horarioSelecionado) { mostrarErro('Selecione um horário disponível.'); return; }
  if (!motivo) { mostrarErro('Informe o motivo da consulta.'); return; }

  if (erro) erro.classList.add('d-none');

  // Mostra loading no botão
  const btn = document.querySelector('[onclick="confirmarAgendamento()"]');
  if (btn) { btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Enviando...'; btn.disabled = true; }

  const consulta = {
    id: Date.now(),
    nomeDono: dono.nome,
    telefoneDono: dono.telefone,
    emailDono: dono.email,
    nomePet: pet.nome,
    especiePet: pet.especie,
    racaPet: pet.raca,
    data: dataConsulta,
    horario: horarioSelecionado,
    motivo: motivo,
    status: 'Confirmado'
  };

  const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  consultas.push(consulta);
  localStorage.setItem('consultas', JSON.stringify(consultas));
  localStorage.setItem('ultimaConsulta', JSON.stringify(consulta));

  // Envia o email
  await enviarEmail(consulta, dono, pet);

  window.location.href = 'confirmacao.html';
}

// ===== CARREGAR CONFIRMAÇÃO =====
function carregarConfirmacao() {
  const c = JSON.parse(localStorage.getItem('ultimaConsulta') || 'null');
  if (!c) { window.location.href = 'index.html'; return; }

  const foto = localStorage.getItem('fotoPet');
  const fotoEl = document.getElementById('conf-foto');
  if (fotoEl && foto) { fotoEl.src = foto; fotoEl.classList.remove('d-none'); }

  const campos = {
    'conf-nomeDono': c.nomeDono,
    'conf-nomePet': c.nomePet,
    'conf-especie': c.especiePet,
    'conf-data': formatarData(c.data),
    'conf-horario': c.horario,
    'conf-motivo': c.motivo,
    'conf-status': c.status
  };

  Object.keys(campos).forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = campos[id];
  });
}

// ===== CARREGAR PAINEL =====
function carregarConsultas() {
  const lista = document.getElementById('listaConsultas');
  const vazia = document.getElementById('listaVazia');
  if (!lista) return;

  const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  const foto = localStorage.getItem('fotoPet');

  if (consultas.length === 0) {
    if (vazia) vazia.classList.remove('d-none');
    return;
  }

  if (vazia) vazia.classList.add('d-none');

  lista.innerHTML = consultas.slice().reverse().map(function (c) {
    const fotoHTML = foto
      ? '<img src="' + foto + '" class="pet-foto-mini" alt="Foto do pet"/>'
      : '<div class="pet-avatar-placeholder">🐾</div>';

    return '<div class="consulta-card fade-in">' +
      '<div class="consulta-header">' +
        '<span class="badge-espec">' + c.especiePet + '</span>' +
        '<span class="badge-status">' + c.status + '</span>' +
      '</div>' +
      '<div class="d-flex align-items-center gap-3 mt-3">' +
        fotoHTML +
        '<div><h5 class="fw-bold mb-0">' + c.nomePet + '</h5>' +
        '<small style="color:var(--text-muted)">' + c.nomeDono + '</small></div>' +
      '</div>' +
      '<hr style="border-color:var(--border)">' +
      '<p class="mb-1"><i class="bi bi-calendar3 me-2 text-primary"></i>' + formatarData(c.data) + ' às ' + c.horario + '</p>' +
      '<p class="mb-1"><i class="bi bi-chat-left-text me-2 text-primary"></i>' + c.motivo + '</p>' +
      '<p class="mb-3"><i class="bi bi-telephone me-2 text-primary"></i>' + c.telefoneDono + '</p>' +
      '<button class="btn-cancelar" onclick="cancelarConsulta(' + c.id + ')">' +
        '<i class="bi bi-x-circle me-2"></i>Cancelar Consulta' +
      '</button></div>';
  }).join('');

  ativarFadeIns();
}

function cancelarConsulta(id) {
  if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;
  let consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  consultas = consultas.filter(function (c) { return c.id !== id; });
  localStorage.setItem('consultas', JSON.stringify(consultas));
  carregarConsultas();
}

// ===== UTILITÁRIOS =====
function formatarData(data) {
  if (!data) return '';
  const partes = data.split('-');
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
  // Inicializa EmailJS
  emailjs.init('Rzyh4-PwNLHtD1fd2');

  aplicarTema();
  iniciarSplash();
  gerarPatas('patasHero');
  gerarPatas('patasCta');
  ativarFadeIns();
  carregarResumo();
  carregarConsultas();
  carregarConfirmacao();

  const dataInput = document.getElementById('dataConsulta');
  if (dataInput) {
    dataInput.addEventListener('change', function () { renderizarHorarios(this.value); });
    dataInput.min = new Date().toISOString().split('T')[0];
  }
});