// ===== VARIÁVEIS GLOBAIS =====
var especialidadeSelecionada = '';
var horarioSelecionado = '';
var HORARIOS = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'];

// ===== TEMA CLARO/ESCURO =====
function aplicarTema() {
  var tema = localStorage.getItem('tema') || 'claro';
  document.body.setAttribute('data-theme', tema);
  document.documentElement.setAttribute('data-theme', tema);
  var btn = document.getElementById('btnTema');
  if (btn) btn.innerHTML = tema === 'escuro' ? '☀️' : '🌙';
}

function alternarTema() {
  var atual = localStorage.getItem('tema') || 'claro';
  var novo = atual === 'claro' ? 'escuro' : 'claro';
  localStorage.setItem('tema', novo);
  aplicarTema();
}

// ===== UTILITÁRIOS =====
function formatarData(data) {
  if (!data) return '';
  var partes = data.split('-');
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function formatarCPF(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatarTelefone(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

function formatarCEP(valor) {
  return valor.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
}

function nomeEspecie(valor) {
  var mapa = { cao: 'Cão', gato: 'Gato', passaro: 'Pássaro', roedor: 'Roedor', reptil: 'Réptil', outro: 'Outro' };
  return mapa[valor] || valor || '';
}

function mostrarErro(msg) {
  var alerta = document.getElementById('alertaErro');
  var texto = document.getElementById('mensagemErro');
  if (alerta && texto) {
    texto.textContent = msg;
    alerta.classList.remove('d-none');
    alerta.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function esconderErro() {
  var alerta = document.getElementById('alertaErro');
  if (alerta) alerta.classList.add('d-none');
}

// ===== ETAPAS (agendar.html original) =====
function irEtapa2() {
  var nome = document.getElementById('nome').value.trim();
  var telefone = document.getElementById('telefone').value.trim();
  var nascimento = document.getElementById('nascimento').value;
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
  document.querySelectorAll('.espec-card').forEach(function(c) { c.classList.remove('selecionado'); });
  el.classList.add('selecionado');
  especialidadeSelecionada = nome;
}

// ===== SELEÇÃO DE HORÁRIO =====
function selecionarHorario(el, hora) {
  document.querySelectorAll('.horario-card').forEach(function(c) { c.classList.remove('selecionado'); });
  el.classList.add('selecionado');
  horarioSelecionado = hora;
}
// ===== SELEÇÃO DE MOTIVO =====
function selecionarMotivo(el, texto) {
  document.querySelectorAll('.motivo-chip').forEach(function(c) { c.classList.remove('selecionado'); });
  el.classList.add('selecionado');
  var motivoEl = document.getElementById('motivo');
  if (motivoEl) motivoEl.value = texto;
}

// ===== BUSCA CEP =====
function buscarCep() {
  var cepEl = document.getElementById('cep');
  var status = document.getElementById('cepStatus');
  if (!cepEl || !status) return;
  var cep = cepEl.value.replace(/\D/g, '');
  if (cep.length !== 8) {
    status.textContent = 'CEP inválido. Informe 8 dígitos.';
    status.style.color = 'red';
    return;
  }
  status.textContent = 'Buscando...';
  status.style.color = 'var(--text-muted)';
  fetch('https://viacep.com.br/ws/' + cep + '/json/')
    .then(function(res) { return res.json(); })
    .then(function(dados) {
      if (dados.erro) {
        status.textContent = 'CEP não encontrado.';
        status.style.color = 'red';
        return;
      }
      if (document.getElementById('endereco')) document.getElementById('endereco').value = dados.logradouro || '';
      if (document.getElementById('bairro'))   document.getElementById('bairro').value   = dados.bairro || '';
      if (document.getElementById('cidade'))   document.getElementById('cidade').value   = dados.localidade || '';
      status.textContent = '✓ Endereço preenchido automaticamente.';
      status.style.color = 'green';
    })
    .catch(function() {
      status.textContent = 'Erro ao buscar CEP. Tente novamente.';
      status.style.color = 'red';
    });
}

// ===== CADASTRO DONO =====
function salvarDono() {
  esconderErro();
  var nome         = document.getElementById('nome')         ? document.getElementById('nome').value.trim()         : '';
  var cpf          = document.getElementById('cpf')          ? document.getElementById('cpf').value.trim()           : '';
  var nascimento   = document.getElementById('nascimento')   ? document.getElementById('nascimento').value           : '';
  var telefone     = document.getElementById('telefone')     ? document.getElementById('telefone').value.trim()      : '';
  var email        = document.getElementById('email')        ? document.getElementById('email').value.trim()         : '';
  var cep          = document.getElementById('cep')          ? document.getElementById('cep').value.trim()           : '';
  var endereco     = document.getElementById('endereco')     ? document.getElementById('endereco').value.trim()      : '';
  var bairro       = document.getElementById('bairro')       ? document.getElementById('bairro').value.trim()        : '';
  var cidade       = document.getElementById('cidade')       ? document.getElementById('cidade').value.trim()        : '';
  var comoConheceu = document.getElementById('comoConheceu') ? document.getElementById('comoConheceu').value         : '';

  if (!nome)                                              return mostrarErro('Informe seu nome completo.');
  if (!cpf || cpf.replace(/\D/g, '').length !== 11)      return mostrarErro('Informe um CPF válido (11 dígitos).');
  if (!nascimento)                                        return mostrarErro('Informe sua data de nascimento.');
  if (!telefone || telefone.replace(/\D/g, '').length < 10) return mostrarErro('Informe um telefone válido.');
  if (!email || email.indexOf('@') === -1)                return mostrarErro('Informe um e-mail válido.');
  if (!cep)                                               return mostrarErro('Informe o CEP.');
  if (!endereco)                                          return mostrarErro('Informe o endereço completo.');
  if (!bairro)                                            return mostrarErro('Informe o bairro.');
  if (!cidade)                                            return mostrarErro('Informe a cidade.');

  localStorage.setItem('dadosDono', JSON.stringify({
    nome: nome, cpf: cpf, nascimento: nascimento, telefone: telefone,
    email: email, cep: cep, endereco: endereco, bairro: bairro,
    cidade: cidade, comoConheceu: comoConheceu
  }));

  window.location.href = 'cadastro-pet.html';
}

// ===== CADASTRO PET =====
function selecionarSexo(valor) {
  var hidden = document.getElementById('sexoPet');
  if (hidden) hidden.value = valor;
  document.querySelectorAll('.sexo-option').forEach(function(el) { el.classList.remove('selecionado'); });
  var opt = document.getElementById('opt-' + valor);
  if (opt) opt.classList.add('selecionado');
}

function selecionarOpcao(campo, valor, el) {
  var hidden = document.getElementById(campo);
  if (hidden) hidden.value = valor;
  el.parentElement.querySelectorAll('.radio-option').forEach(function(o) { o.classList.remove('selecionado'); });
  el.classList.add('selecionado');
}

function salvarPet() {
  esconderErro();
  var nomePet       = document.getElementById('nomePet')       ? document.getElementById('nomePet').value.trim()       : '';
  var especie       = document.getElementById('especie')       ? document.getElementById('especie').value               : '';
  var raca          = document.getElementById('raca')          ? document.getElementById('raca').value.trim()           : '';
  var sexoPet       = document.getElementById('sexoPet')       ? document.getElementById('sexoPet').value               : '';
  var nascimentoPet = document.getElementById('nascimentoPet') ? document.getElementById('nascimentoPet').value         : '';
  var cor           = document.getElementById('cor')           ? document.getElementById('cor').value.trim()            : '';
  var peso          = document.getElementById('peso')          ? document.getElementById('peso').value                  : '';
  var castrado      = document.getElementById('castrado')      ? document.getElementById('castrado').value              : '';
  var vacinas       = document.getElementById('vacinas')       ? document.getElementById('vacinas').value               : '';
  var observacoes   = document.getElementById('observacoes')   ? document.getElementById('observacoes').value.trim()    : '';

  if (!nomePet)       return mostrarErro('Informe o nome do pet.');
  if (!especie)       return mostrarErro('Selecione a espécie do pet.');
  if (!sexoPet)       return mostrarErro('Selecione o sexo do pet.');
  if (!nascimentoPet) return mostrarErro('Informe a data de nascimento/idade aproximada.');
  if (!castrado)      return mostrarErro('Informe se o pet é castrado.');
  if (!vacinas)       return mostrarErro('Informe se as vacinas estão em dia.');

  localStorage.setItem('dadosPet', JSON.stringify({
    nome: nomePet, especie: especie, raca: raca, sexo: sexoPet,
    nascimentoPet: nascimentoPet, cor: cor, peso: peso,
    castrado: castrado, vacinas: vacinas, observacoes: observacoes
  }));

  window.location.href = 'agendar.html';
}

// ===== AGENDAMENTO =====
function verificarHorarios(dataSelecionada) {
  var consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  return consultas
    .filter(function(c) { return c.data === dataSelecionada; })
    .map(function(c) { return c.horario; });
}

function renderizarHorarios() {
  var dataEl = document.getElementById('dataConsulta');
  var grid   = document.getElementById('horariosGrid');
  if (!grid) return;
  var data = dataEl ? dataEl.value : '';
  horarioSelecionado = '';
  var ocupados = data ? verificarHorarios(data) : [];
  grid.innerHTML = HORARIOS.map(function(hora) {
    var isOcupado = ocupados.indexOf(hora) !== -1;
    var cls = isOcupado ? 'ocupado' : 'disponivel';
    var onclick = isOcupado ? '' : 'onclick="selecionarHorario(this,\'' + hora + '\')"';
    var label = isOcupado ? hora + '<br><small style="font-size:0.7rem">Ocupado</small>' : hora;
    return '<div class="horario-card ' + cls + '" ' + onclick + '>' + label + '</div>';
  }).join('');
}

function confirmarAgendamento() {
  esconderErro();
  var dataEl   = document.getElementById('dataConsulta');
  var obsEl    = document.getElementById('obs');
  var motivoEl = document.getElementById('motivo');
  var data     = dataEl   ? dataEl.value   : '';
  var motivo   = motivoEl ? motivoEl.value.trim() : (obsEl ? obsEl.value.trim() : '');

  // Modo antigo (form direto)
  var nomeEl = document.getElementById('nome');
  if (nomeEl && !document.getElementById('horariosGrid')) {
    if (!data)               return alert('Por favor, selecione a data da consulta.');
    if (!horarioSelecionado) return alert('Por favor, selecione um horário.');
    var consulta = {
      id: Date.now(), nome: nomeEl.value.trim(),
      telefone: document.getElementById('telefone') ? document.getElementById('telefone').value.trim() : '',
      nascimento: document.getElementById('nascimento') ? document.getElementById('nascimento').value : '',
      especialidade: especialidadeSelecionada,
      data: data, horario: horarioSelecionado, obs: motivo, status: 'Confirmado'
    };
    var lista = JSON.parse(localStorage.getItem('consultas') || '[]');
    lista.push(consulta);
    localStorage.setItem('consultas', JSON.stringify(lista));
    localStorage.setItem('ultimaConsulta', JSON.stringify(consulta));
    window.location.href = 'confirmacao.html';
    return;
  }

  // Modo PetConsulta
  var dono = JSON.parse(localStorage.getItem('dadosDono') || 'null');
  var pet  = JSON.parse(localStorage.getItem('dadosPet')  || 'null');
  if (!dono)               return mostrarErro('Cadastro do tutor não encontrado. Volte e cadastre seus dados.');
  if (!pet)                return mostrarErro('Cadastro do pet não encontrado. Volte e cadastre seu pet.');
  if (!data)               return mostrarErro('Selecione uma data para a consulta.');
  if (!horarioSelecionado) return mostrarErro('Selecione um horário disponível.');
  if (!motivo)             return mostrarErro('Informe o motivo da consulta.');

  var nova = {
    id: Date.now(), nomeDono: dono.nome, nomePet: pet.nome,
    especiePet: pet.especie, data: data, horario: horarioSelecionado,
    motivo: motivo, status: 'Confirmado'
  };
  var lista = JSON.parse(localStorage.getItem('consultas') || '[]');
  lista.push(nova);
  localStorage.setItem('consultas', JSON.stringify(lista));
  localStorage.setItem('ultimaConsulta', JSON.stringify(nova));
  window.location.href = 'confirmacao.html';
}

// ===== PAINEL =====
function carregarConsultas() {
  var lista = document.getElementById('listaConsultas');
  var vazia = document.getElementById('listaVazia');
  if (!lista) return;
  var consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  var foto = localStorage.getItem('fotoPet');

  if (consultas.length === 0) {
    lista.innerHTML = '';
    if (vazia) vazia.classList.remove('d-none');
    else lista.innerHTML = '<div class="text-center py-5 text-muted"><i class="bi bi-calendar-x" style="font-size:3rem"></i><p class="mt-3">Nenhuma consulta agendada ainda.</p><a href="agendar.html" class="btn btn-primary-blue mt-2">Agendar agora</a></div>';
    return;
  }

  if (vazia) vazia.classList.add('d-none');
  var ordenadas = consultas.slice().reverse();

  lista.innerHTML = ordenadas.map(function(c) {
    if (c.nomePet) {
      var fotoHTML = foto
        ? '<img src="' + foto + '" class="pet-foto-mini" alt="Foto"/>'
        : '<div class="pet-avatar-placeholder"><i class="bi bi-emoji-smile"></i></div>';
      return '<div class="consulta-card" id="card-' + c.id + '">'
        + '<div class="consulta-header mb-2"><div class="d-flex align-items-center gap-2">' + fotoHTML
        + '<div><div class="fw-bold">' + c.nomePet + '</div>'
        + '<div style="font-size:0.8rem;color:var(--text-muted)">' + nomeEspecie(c.especiePet) + '</div></div></div>'
        + '<span class="badge-status">' + c.status + '</span></div>'
        + '<div class="mb-1" style="font-size:0.9rem"><i class="bi bi-person me-1 text-primary"></i>' + c.nomeDono + '</div>'
        + '<div class="mb-1" style="font-size:0.9rem"><i class="bi bi-calendar me-1 text-primary"></i>' + formatarData(c.data) + ' às ' + c.horario + '</div>'
        + '<div class="mb-3" style="font-size:0.9rem"><i class="bi bi-chat-left-text me-1 text-primary"></i>' + c.motivo + '</div>'
        + '<button class="btn-cancelar" onclick="cancelarConsulta(' + c.id + ')"><i class="bi bi-x-circle me-1"></i>Cancelar consulta</button></div>';
    }
    return '<div class="consulta-card">'
      + '<div class="consulta-header"><span class="badge-espec">' + c.especialidade + '</span><span class="badge-status">' + c.status + '</span></div>'
      + '<h5 class="fw-bold mt-2">' + c.nome + '</h5>'
      + '<p class="mb-1"><i class="bi bi-calendar3 me-2 text-primary"></i>' + formatarData(c.data) + ' às ' + c.horario + '</p>'
      + '<p class="mb-1"><i class="bi bi-telephone me-2 text-primary"></i>' + c.telefone + '</p>'
      + (c.obs ? '<p class="mb-0 text-muted"><i class="bi bi-chat-left-text me-2"></i>' + c.obs + '</p>' : '')
      + '<button class="btn btn-danger btn-sm mt-3 w-100" onclick="cancelarConsulta(' + c.id + ')"><i class="bi bi-x-circle me-2"></i>Cancelar Consulta</button></div>';
  }).join('');
}

function cancelarConsulta(id) {
  if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;
  var consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  consultas = consultas.filter(function(c) { return c.id !== id; });
  localStorage.setItem('consultas', JSON.stringify(consultas));
  carregarConsultas();
}

// ===== CONFIRMAÇÃO =====
function carregarConfirmacao() {
  var c    = JSON.parse(localStorage.getItem('ultimaConsulta') || 'null');
  var foto = localStorage.getItem('fotoPet');
  if (!c) return;

  var campos = {
    'conf-nomeDono': c.nomeDono, 'conf-nomePet': c.nomePet,
    'conf-especie': nomeEspecie(c.especiePet), 'conf-data': formatarData(c.data),
    'conf-horario': c.horario, 'conf-motivo': c.motivo, 'conf-status': c.status
  };
  Object.keys(campos).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = campos[id] || '—';
  });
  if (foto) {
    var imgEl = document.getElementById('conf-foto');
    if (imgEl) { imgEl.src = foto; imgEl.classList.remove('d-none'); }
  }

  // Modo antigo
  var div = document.getElementById('dadosConfirmacao');
  if (div && c.nome) {
    div.innerHTML = '<p><i class="bi bi-person-fill me-2 text-primary"></i><strong>Paciente:</strong> ' + c.nome + '</p>'
      + '<p><i class="bi bi-hospital-fill me-2 text-primary"></i><strong>Especialidade:</strong> ' + c.especialidade + '</p>'
      + '<p><i class="bi bi-calendar3 me-2 text-primary"></i><strong>Data:</strong> ' + formatarData(c.data) + '</p>'
      + '<p><i class="bi bi-clock me-2 text-primary"></i><strong>Horário:</strong> ' + c.horario + '</p>'
      + '<p><i class="bi bi-telephone me-2 text-primary"></i><strong>Telefone:</strong> ' + c.telefone + '</p>'
      + (c.obs ? '<p><i class="bi bi-chat-left-text me-2 text-primary"></i><strong>Observação:</strong> ' + c.obs + '</p>' : '');
  }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
  aplicarTema();
  carregarConsultas();
  carregarConfirmacao();

  // Máscaras
  var cpfInput = document.getElementById('cpf');
  var telInput = document.getElementById('telefone');
  var cepInput = document.getElementById('cep');
  if (cpfInput) cpfInput.addEventListener('input', function(e) { e.target.value = formatarCPF(e.target.value); });
  if (telInput) telInput.addEventListener('input', function(e) { e.target.value = formatarTelefone(e.target.value); });
  if (cepInput) cepInput.addEventListener('input', function(e) { e.target.value = formatarCEP(e.target.value); });

  // Foto do pet
  var inputFoto = document.getElementById('fotoPet');
  if (inputFoto) {
    inputFoto.addEventListener('change', function() {
      var file = this.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        localStorage.setItem('fotoPet', e.target.result);
        var preview     = document.getElementById('previewFoto');
        var placeholder = document.getElementById('fotoPlaceholder');
        if (preview) { preview.src = e.target.result; preview.classList.remove('d-none'); }
        if (placeholder) placeholder.classList.add('d-none');
      };
      reader.readAsDataURL(file);
    });
  }

  // Agendamento novo
  var dataInput = document.getElementById('dataConsulta');
  var horariosGrid = document.getElementById('horariosGrid');
  if (dataInput && horariosGrid) {
    var hoje = new Date().toISOString().split('T')[0];
    dataInput.min = hoje;
    dataInput.addEventListener('change', renderizarHorarios);
    var dono = JSON.parse(localStorage.getItem('dadosDono') || 'null');
    var pet  = JSON.parse(localStorage.getItem('dadosPet')  || 'null');
    var foto = localStorage.getItem('fotoPet');
    var resumoDono = document.getElementById('resumoDono');
    var resumoPet  = document.getElementById('resumoPet');
    if (resumoDono && dono) resumoDono.innerHTML = '<strong>' + dono.nome + '</strong> &bull; ' + dono.telefone;
    if (resumoPet && pet) {
      var fotoHTML = foto
        ? '<img src="' + foto + '" class="pet-foto-mini me-2" alt="Foto"/>'
        : '<i class="bi bi-emoji-smile me-2 text-primary" style="font-size:1.4rem;"></i>';
      resumoPet.innerHTML = '<div class="d-flex align-items-center">' + fotoHTML + '<span><strong>' + pet.nome + '</strong> &bull; ' + nomeEspecie(pet.especie) + '</span></div>';
    }
    renderizarHorarios();
  }
});