// ===== EMAILJS CONFIG =====
var EMAILJS_SERVICE = 'Petconsulta';
var EMAILJS_TEMPLATE = 'template_ynetch9';
var EMAILJS_KEY = 'Rzyh4-PwNLHtD1fd2';

// ===== TEMA =====
function aplicarTema() {
  var tema = localStorage.getItem('tema') || 'claro';
  document.body.setAttribute('data-theme', tema);
  var btn = document.getElementById('btnTema');
  if (btn) btn.innerHTML = tema === 'escuro' ? '☀️' : '🌙';
}

function alternarTema() {
  var atual = localStorage.getItem('tema') || 'claro';
  var novo = atual === 'claro' ? 'escuro' : 'claro';
  localStorage.setItem('tema', novo);
  aplicarTema();
}

// ===== SPLASH =====
function iniciarSplash() {
  var splash = document.getElementById('splash');
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
  var container = document.getElementById(containerId);
  if (!container) return;
  for (var i = 0; i < 10; i++) {
    var pata = document.createElement('div');
    pata.classList.add('pata-float');
    pata.innerText = '🐾';
    pata.style.left = Math.random() * 100 + '%';
    pata.style.animationDuration = (6 + Math.random() * 8) + 's';
    pata.style.animationDelay = (Math.random() * 6) + 's';
    pata.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    container.appendChild(pata);
  }
}

// ===== FADE-IN =====
function ativarFadeIns() {
  var elementos = document.querySelectorAll('.fade-in');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  elementos.forEach(function (el) { observer.observe(el); });
}

// ===== FORMATAÇÕES =====
function formatarCPF(input) {
  var v = input.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}

function formatarTelefone(input) {
  var v = input.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{2})(\d)/, '($1) $2');
  v = v.replace(/(\d{5})(\d)/, '$1-$2');
  input.value = v;
}

function formatarCEP(input) {
  var v = input.value.replace(/\D/g, '').slice(0, 8);
  v = v.replace(/(\d{5})(\d)/, '$1-$2');
  input.value = v;
}

// ===== BUSCA CEP =====
async function buscarCEP() {
  var cepInput = document.getElementById('cep');
  var cep = cepInput.value.replace(/\D/g, '');
  if (cep.length !== 8) return;
  try {
    var res = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
    var data = await res.json();
    if (data.erro) { alert('CEP não encontrado.'); return; }
    document.getElementById('endereco').value = data.logradouro || '';
    document.getElementById('bairro').value = data.bairro || '';
    document.getElementById('cidade').value = data.localidade || '';
  } catch (e) { console.log('Erro CEP'); }
}

// ===== DONO — VERIFICAR =====
function verificarCadastroDono() {
  var dono = JSON.parse(localStorage.getItem('dadosDono') || 'null');
  var cardExistente = document.getElementById('cardExistente');
  var formCadastro = document.getElementById('formCadastro');
  if (!cardExistente || !formCadastro) return;

  if (dono) {
    cardExistente.classList.remove('d-none');
    formCadastro.classList.add('d-none');
    var nomeEl = document.getElementById('nomeExistente');
    var textoEl = document.getElementById('textoExistente');
    if (nomeEl) nomeEl.textContent = dono.nome;
    if (textoEl) textoEl.textContent = dono.email + ' • ' + dono.telefone + ' • ' + dono.cidade;
  } else {
    cardExistente.classList.add('d-none');
    formCadastro.classList.remove('d-none');
  }
}

function continuarCadastroExistente() {
  window.location.href = 'cadastro-pet.html';
}

function editarCadastro() {
  var dono = JSON.parse(localStorage.getItem('dadosDono') || 'null');
  document.getElementById('cardExistente').classList.add('d-none');
  document.getElementById('formCadastro').classList.remove('d-none');
  var btnVoltar = document.getElementById('btnVoltarDono');
  if (btnVoltar) btnVoltar.style.display = 'block !important';

  if (dono) {
    document.getElementById('nome').value = dono.nome || '';
    document.getElementById('cpf').value = dono.cpf || '';
    document.getElementById('nascimento').value = dono.nascimento || '';
    document.getElementById('telefone').value = dono.telefone || '';
    document.getElementById('email').value = dono.email || '';
    document.getElementById('cep').value = dono.cep || '';
    document.getElementById('endereco').value = dono.endereco || '';
    document.getElementById('bairro').value = dono.bairro || '';
    document.getElementById('cidade').value = dono.cidade || '';
    var como = document.getElementById('comoConheceu');
    if (como) como.value = dono.comoConheceu || '';
  }
}

function apagarDono() {
  if (!confirm('Tem certeza que deseja excluir seu cadastro? Todos os dados do tutor serão removidos.')) return;
  localStorage.removeItem('dadosDono');
  verificarCadastroDono();
}

// ===== DONO — SALVAR =====
function salvarDono() {
  var campos = ['nome', 'cpf', 'nascimento', 'telefone', 'email', 'cep', 'endereco', 'bairro', 'cidade'];
  for (var i = 0; i < campos.length; i++) {
    var el = document.getElementById(campos[i]);
    if (!el || !el.value.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      if (el) el.focus();
      return;
    }
  }

  var dono = {
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

// ===== PETS — LISTA =====
function verificarCadastroPet() {
  var pets = JSON.parse(localStorage.getItem('listaPets') || '[]');
  var listaPetsSection = document.getElementById('listaPetsSection');
  var formPet = document.getElementById('formPet');
  if (!listaPetsSection || !formPet) return;

  if (pets.length > 0) {
    listaPetsSection.classList.remove('d-none');
    formPet.classList.add('d-none');
    renderizarListaPets(pets);
  } else {
    listaPetsSection.classList.add('d-none');
    formPet.classList.remove('d-none');
  }
}

function renderizarListaPets(pets) {
  var lista = document.getElementById('listaPets');
  if (!lista) return;

  lista.innerHTML = pets.map(function (pet) {
    var foto = pet.foto
      ? '<img src="' + pet.foto + '" class="pet-foto-mini" alt="Foto"/>'
      : '<div class="pet-avatar-placeholder">🐾</div>';

    return '<div class="pet-card-lista">' +
      '<div class="d-flex align-items-center gap-3">' +
        foto +
        '<div style="flex:1">' +
          '<h6 class="fw-bold mb-0">' + pet.nome + '</h6>' +
          '<small style="color:var(--text-muted)">' + pet.especie + ' • ' + pet.raca + ' • ' + pet.peso + 'kg</small>' +
        '</div>' +
      '</div>' +
      '<div class="pet-card-acoes mt-3">' +
        '<button class="btn-selecionar-pet" onclick="selecionarPet(\'' + pet.id + '\')">' +
          '<i class="bi bi-check-circle me-1"></i>Selecionar' +
        '</button>' +
        '<button class="btn-editar-pet" onclick="editarPetId(\'' + pet.id + '\')">' +
          '<i class="bi bi-pencil me-1"></i>Editar' +
        '</button>' +
        '<button class="btn-excluir-pet" onclick="excluirPet(\'' + pet.id + '\')">' +
          '<i class="bi bi-trash me-1"></i>Excluir' +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function selecionarPet(id) {
  var pets = JSON.parse(localStorage.getItem('listaPets') || '[]');
  var pet = pets.find(function (p) { return p.id === id; });
  if (!pet) return;
  localStorage.setItem('dadosPet', JSON.stringify(pet));
  if (pet.foto) localStorage.setItem('fotoPet', pet.foto);
  window.location.href = 'agendar.html';
}

function excluirPet(id) {
  if (!confirm('Tem certeza que deseja excluir este pet?')) return;
  var pets = JSON.parse(localStorage.getItem('listaPets') || '[]');
  pets = pets.filter(function (p) { return p.id !== id; });
  localStorage.setItem('listaPets', JSON.stringify(pets));

  // Limpa pet selecionado se for o excluído
  var petAtual = JSON.parse(localStorage.getItem('dadosPet') || 'null');
  if (petAtual && petAtual.id === id) {
    localStorage.removeItem('dadosPet');
    localStorage.removeItem('fotoPet');
  }

  verificarCadastroPet();
}

function editarPetId(id) {
  var pets = JSON.parse(localStorage.getItem('listaPets') || '[]');
  var pet = pets.find(function (p) { return p.id === id; });
  if (!pet) return;

  mostrarFormPet();
  document.getElementById('petIdEditando').value = id;
  var titulo = document.getElementById('tituloPet');
  if (titulo) titulo.innerHTML = '<i class="bi bi-pencil me-2 text-primary"></i>Editar Pet';

  document.getElementById('nomePet').value = pet.nome || '';
  document.getElementById('especie').value = pet.especie || '';
  document.getElementById('raca').value = pet.raca || '';
  document.getElementById('nascimentoPet').value = pet.nascimento || '';
  document.getElementById('cor').value = pet.cor || '';
  document.getElementById('peso').value = pet.peso || '';
  document.getElementById('observacoesPet').value = pet.observacoes || '';

  if (pet.sexo) {
    var btnSexo = document.querySelector('[data-grupo="sexo"][data-valor="' + pet.sexo + '"]');
    if (btnSexo) { btnSexo.classList.add('selecionado'); document.getElementById('input_sexo').value = pet.sexo; }
  }
  if (pet.castrado) {
    var btnCast = document.querySelector('[data-grupo="castrado"][data-valor="' + pet.castrado + '"]');
    if (btnCast) { btnCast.classList.add('selecionado'); document.getElementById('input_castrado').value = pet.castrado; }
  }
  if (pet.vacinas) {
    var btnVac = document.querySelector('[data-grupo="vacinas"][data-valor="' + pet.vacinas + '"]');
    if (btnVac) { btnVac.classList.add('selecionado'); document.getElementById('input_vacinas').value = pet.vacinas; }
  }
  if (pet.foto) {
    var preview = document.getElementById('previewFoto');
    var placeholder = document.getElementById('fotoPlaceholder');
    if (preview) { preview.src = pet.foto; preview.classList.remove('d-none'); }
    if (placeholder) placeholder.classList.add('d-none');
  }
}

function mostrarFormPet() {
  document.getElementById('listaPetsSection').classList.add('d-none');
  document.getElementById('formPet').classList.remove('d-none');
  document.getElementById('petIdEditando').value = '';
  var titulo = document.getElementById('tituloPet');
  if (titulo) titulo.innerHTML = '<i class="bi bi-emoji-smile me-2 text-primary"></i>Cadastro do Pet';
}

function voltarListaPets() {
  var pets = JSON.parse(localStorage.getItem('listaPets') || '[]');
  if (pets.length > 0) {
    document.getElementById('formPet').classList.add('d-none');
    document.getElementById('listaPetsSection').classList.remove('d-none');
    renderizarListaPets(pets);
  } else {
    window.location.href = 'cadastro-dono.html';
  }
}

// ===== OPÇÕES (sexo, castrado, vacinas) =====
function selecionarOpcao(grupo, valor, el) {
  document.querySelectorAll('[data-grupo="' + grupo + '"]').forEach(function (btn) {
    btn.classList.remove('selecionado');
  });
  if (el) el.classList.add('selecionado');
  var input = document.getElementById('input_' + grupo);
  if (input) input.value = valor;
}

// ===== FOTO =====
function previewFoto() {
  var input = document.getElementById('fotoPet');
  var preview = document.getElementById('previewFoto');
  var placeholder = document.getElementById('fotoPlaceholder');
  var area = document.getElementById('uploadArea');
  if (!input.files || !input.files[0]) return;

  var reader = new FileReader();
  reader.onload = function (e) {
    if (preview) { preview.src = e.target.result; preview.classList.remove('d-none'); }
    if (placeholder) placeholder.classList.add('d-none');
    if (area) area.style.borderColor = 'var(--primary)';
    // Salva foto temporariamente
    localStorage.setItem('fotoTemp', e.target.result);
  };
  reader.readAsDataURL(input.files[0]);
}

// ===== SALVAR PET =====
function salvarPet() {
  var obrigatorios = ['nomePet', 'especie', 'raca', 'nascimentoPet', 'cor', 'peso', 'observacoesPet'];
  for (var i = 0; i < obrigatorios.length; i++) {
    var el = document.getElementById(obrigatorios[i]);
    if (!el || !el.value.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      if (el) el.focus();
      return;
    }
  }

  var sexo = document.getElementById('input_sexo') ? document.getElementById('input_sexo').value : '';
  var castrado = document.getElementById('input_castrado') ? document.getElementById('input_castrado').value : '';
  var vacinas = document.getElementById('input_vacinas') ? document.getElementById('input_vacinas').value : '';

  if (!sexo) { alert('Por favor, selecione o sexo do pet.'); return; }
  if (!castrado) { alert('Por favor, informe se o pet é castrado.'); return; }
  if (!vacinas) { alert('Por favor, informe se as vacinas estão em dia.'); return; }

  var idEditando = document.getElementById('petIdEditando') ? document.getElementById('petIdEditando').value : '';
  var fotoTemp = localStorage.getItem('fotoTemp') || '';

  var pet = {
    id: idEditando || 'pet_' + Date.now(),
    nome: document.getElementById('nomePet').value.trim(),
    especie: document.getElementById('especie').value,
    raca: document.getElementById('raca').value.trim(),
    sexo: sexo,
    nascimento: document.getElementById('nascimentoPet').value,
    cor: document.getElementById('cor').value.trim(),
    peso: document.getElementById('peso').value.trim(),
    castrado: castrado,
    vacinas: vacinas,
    observacoes: document.getElementById('observacoesPet').value.trim(),
    foto: fotoTemp || (idEditando ? obterFotoPet(idEditando) : '')
  };

  // Salva na lista de pets
  var pets = JSON.parse(localStorage.getItem('listaPets') || '[]');
  if (idEditando) {
    pets = pets.map(function (p) { return p.id === idEditando ? pet : p; });
  } else {
    pets.push(pet);
  }
  localStorage.setItem('listaPets', JSON.stringify(pets));
  localStorage.removeItem('fotoTemp');

  // Define como pet selecionado
  localStorage.setItem('dadosPet', JSON.stringify(pet));
  if (pet.foto) localStorage.setItem('fotoPet', pet.foto);

  window.location.href = 'agendar.html';
}

function obterFotoPet(id) {
  var pets = JSON.parse(localStorage.getItem('listaPets') || '[]');
  var pet = pets.find(function (p) { return p.id === id; });
  return pet ? pet.foto : '';
}

// ===== RESUMO NO AGENDAR =====
function carregarResumo() {
  var dono = JSON.parse(localStorage.getItem('dadosDono') || 'null');
  var pet = JSON.parse(localStorage.getItem('dadosPet') || 'null');
  var resumoDono = document.getElementById('resumoDono');
  var resumoPet = document.getElementById('resumoPet');
  if (resumoDono) resumoDono.textContent = dono ? dono.nome : 'Tutor não cadastrado';
  if (resumoPet) resumoPet.textContent = pet ? pet.nome + ' (' + pet.especie + ')' : 'Pet não cadastrado';
}

// ===== HORÁRIOS =====
var horarioSelecionado = '';
var todosHorarios = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

function renderizarHorarios(dataSelecionada) {
  var grid = document.getElementById('horariosGrid');
  if (!grid) return;
  var consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  var ocupados = consultas.filter(function (c) { return c.data === dataSelecionada; }).map(function (c) { return c.horario; });
  horarioSelecionado = '';
  grid.innerHTML = '';
  todosHorarios.forEach(function (hora) {
    var div = document.createElement('div');
    div.classList.add('horario-card');
    div.textContent = hora;
    if (ocupados.includes(hora)) {
      div.classList.add('ocupado');
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

// ===== MOTIVO =====
function selecionarMotivo(el, texto) {
  document.querySelectorAll('.motivo-chip').forEach(function (c) { c.classList.remove('selecionado'); });
  el.classList.add('selecionado');
  var motivoEl = document.getElementById('motivo');
  if (motivoEl) motivoEl.value = texto;
}

// ===== ENVIAR EMAIL =====
async function enviarEmail(consulta, dono, pet) {
  try {
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
      nome_dono: dono.nome,
      email_dono: dono.email,
      nome_pet: pet.nome,
      especie_pet: pet.especie,
      data_consulta: formatarData(consulta.data),
      horario_consulta: consulta.horario,
      motivo_consulta: consulta.motivo
    });
  } catch (e) { console.log('Erro email:', e); }
}

// ===== CONFIRMAR AGENDAMENTO =====
async function confirmarAgendamento() {
  var dono = JSON.parse(localStorage.getItem('dadosDono') || 'null');
  var pet = JSON.parse(localStorage.getItem('dadosPet') || 'null');
  var dataConsulta = document.getElementById('dataConsulta') ? document.getElementById('dataConsulta').value : '';
  var motivo = document.getElementById('motivo') ? document.getElementById('motivo').value.trim() : '';

  var erro = document.getElementById('alertaErro');
  var msg = document.getElementById('mensagemErro');

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

  var btn = document.querySelector('[onclick="confirmarAgendamento()"]');
  if (btn) { btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Enviando...'; btn.disabled = true; }

  var consulta = {
    id: Date.now(),
    nomeDono: dono.nome,
    telefoneDono: dono.telefone,
    emailDono: dono.email,
    nomePet: pet.nome,
    especiePet: pet.especie,
    racaPet: pet.raca,
    petId: pet.id || '',
    data: dataConsulta,
    horario: horarioSelecionado,
    motivo: motivo,
    status: 'Confirmado'
  };

  var consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  consultas.push(consulta);
  localStorage.setItem('consultas', JSON.stringify(consultas));
  localStorage.setItem('ultimaConsulta', JSON.stringify(consulta));

  await enviarEmail(consulta, dono, pet);
  window.location.href = 'confirmacao.html';
}

// ===== CONFIRMAÇÃO =====
function carregarConfirmacao() {
  var c = JSON.parse(localStorage.getItem('ultimaConsulta') || 'null');
  if (!c) { window.location.href = 'index.html'; return; }

  var foto = localStorage.getItem('fotoPet');
  var fotoEl = document.getElementById('conf-foto');
  if (fotoEl && foto) { fotoEl.src = foto; fotoEl.classList.remove('d-none'); }

  var campos = {
    'conf-nomeDono': c.nomeDono,
    'conf-nomePet': c.nomePet,
    'conf-especie': c.especiePet,
    'conf-data': formatarData(c.data),
    'conf-horario': c.horario,
    'conf-motivo': c.motivo,
    'conf-status': c.status
  };

  Object.keys(campos).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = campos[id];
  });
}

// ===== PAINEL =====
function carregarConsultas() {
  var lista = document.getElementById('listaConsultas');
  var vazia = document.getElementById('listaVazia');
  if (!lista) return;

  var consultas = JSON.parse(localStorage.getItem('consultas') || '[]');

  if (consultas.length === 0) {
    if (vazia) vazia.classList.remove('d-none');
    return;
  }

  if (vazia) vazia.classList.add('d-none');

  lista.innerHTML = consultas.slice().reverse().map(function (c) {
    // Tenta pegar foto do pet específico
    var foto = '';
    if (c.petId) {
      var pets = JSON.parse(localStorage.getItem('listaPets') || '[]');
      var petDaConsulta = pets.find(function (p) { return p.id === c.petId; });
      if (petDaConsulta && petDaConsulta.foto) foto = petDaConsulta.foto;
    }
    if (!foto) foto = localStorage.getItem('fotoPet') || '';

    var fotoHTML = foto
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
  var consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  consultas = consultas.filter(function (c) { return c.id !== id; });
  localStorage.setItem('consultas', JSON.stringify(consultas));
  carregarConsultas();
}

// ===== UTILITÁRIOS =====
function formatarData(data) {
  if (!data) return '';
  var partes = data.split('-');
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
  emailjs.init(EMAILJS_KEY);
  aplicarTema();
  iniciarSplash();
  gerarPatas('patasHero');
  gerarPatas('patasCta');
  ativarFadeIns();
  verificarCadastroDono();
  verificarCadastroPet();
  carregarResumo();
  carregarConsultas();
  carregarConfirmacao();

  var dataInput = document.getElementById('dataConsulta');
  if (dataInput) {
    dataInput.addEventListener('change', function () { renderizarHorarios(this.value); });
    dataInput.min = new Date().toISOString().split('T')[0];
  }
});