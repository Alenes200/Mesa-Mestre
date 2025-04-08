const containerMesas = document.querySelector('.mesas');
const btnAdicionarMesa = document.querySelector('.adicionar-mesa');
const tituloModal = document.getElementById('titulo-modal');
const descricao = document.getElementById('descricao');
const capacidade = document.getElementById('capacidade');
const statusInput = document.getElementById('statusInput');
const statusText = document.getElementById('statusText');
const setor = document.getElementById('setor');
const pesquisar = document.getElementById('pesquisar');
const botaoSalvar = document.getElementById('salvar-alteracoes');
const botaoAdicionar = document.getElementById('adicionar');
const salvarStatus = document.getElementById('salvarStatus');
const adicionarStatus = document.getElementById('adicionarStatus');

const nomeMesa = document.getElementById('nomeMesa');
const idText = document.getElementById('idText');
const codigoInput = document.getElementById('codigoInput');
const codigoInputAdicionar = document.getElementById('codigoInputAdicionar');

import { escapeHTML } from '../utils/sanitizacao.js';
import { showModal } from './modal.js';

// Funções de sanitização
function sanitizarTexto(texto) {
  if (typeof texto !== 'string') return '';
  return texto.replace(/<[^>]*>?/gm, ''); // Remove tags HTML
}

function sanitizarNumero(numero) {
  if (typeof numero === 'number') return numero;
  const num = Number(numero);
  return isNaN(num) ? 0 : num;
}

function sanitizarSelect(valor, opcoesValidas = []) {
  if (opcoesValidas.includes(Number(valor))) return valor;
  return opcoesValidas[0] || '';
}

// Validações comuns
function validarTexto(texto, campo, min = 2, max = 100) {
  const textoSanitizado = sanitizarTexto(texto);
  if (
    !textoSanitizado ||
    textoSanitizado.length < min ||
    textoSanitizado.length > max
  ) {
    showModal(`O campo ${campo} deve ter entre ${min} e ${max} caracteres`);
    return false;
  }
  return true;
}

function validarNumero(numero, campo, min = 1, max = 100) {
  const numeroSanitizado = sanitizarNumero(numero);
  if (isNaN(numeroSanitizado)) {
    showModal(`O campo ${campo} deve ser um número válido`);
    return false;
  }
  if (numeroSanitizado < min || numeroSanitizado > max) {
    showModal(`O campo ${campo} deve estar entre ${min} e ${max}`);
    return false;
  }
  return true;
}

function validarSelect(valor, campo) {
  if (!valor || valor === 'selecionar') {
    showModal(`Por favor, selecione um valor válido para ${campo}`);
    return false;
  }
  return true;
}

export async function configurarLocais() {
  try {
    const response = await fetch('/api/mesas/local/locais/Todos');
    if (!response.ok) throw new Error('Erro ao buscar locais');

    const locais = await response.json();
    preencherTabelaLocais(locais);
  } catch (error) {
    showModal('Erro ao carregar locais. Tente novamente mais tarde.');
  }
}

function preencherTabelaLocais(locais) {
  const tabela = document.querySelector('#tabela-locais tbody');
  tabela.innerHTML = '';

  locais.forEach((local) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHTML(local.loc_descricao)}</td>
      <td class="opcoes">
        <button class="editar" data-id="${escapeHTML(local.loc_id)}">✏️</button>
        <button class="deletar" data-id="${escapeHTML(local.loc_id)}">🗑️</button>
      </td>
    `;
    tabela.appendChild(row);
  });

  adicionarEventosBotoes();
}

function adicionarEventosBotoes() {
  document.querySelectorAll('.editar').forEach((botao) => {
    botao.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      editarLocal(id);
    });
  });

  document.querySelectorAll('.deletar').forEach((botao) => {
    botao.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      deletarLocal(id);
    });
  });
}

export async function editarLocal(id) {
  const novoNome = prompt('Digite o novo nome do local:');
  if (!novoNome || !validarTexto(novoNome, 'nome do local')) return;

  try {
    const response = await fetch(`/api/mesas/local/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao: novoNome }),
    });

    if (!response.ok) throw new Error('Erro ao editar local');
    configurarLocais();
  } catch (error) {
    showModal('Erro ao editar local. Tente novamente.');
  }
}

export async function deletarLocal(id) {
  const confirmacao = confirm('Tem certeza que deseja excluir este local?');
  if (!confirmacao) return;

  try {
    const response = await fetch(`/api/mesas/local/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir local');

    configurarLocais();
  } catch (error) {
    showModal('Erro ao excluir local. Tente novamente.');
  }
}

export function abrirModal(titulo, conteudo) {
  const modal = document.getElementById('modalGenerico');
  const tituloModal = document.getElementById('tituloModalGenerico');
  const corpoModal = document.getElementById('conteudoModalGenerico');

  tituloModal.textContent = titulo;
  corpoModal.innerHTML = configurarLocais();
  modal.style.display = 'flex';
}

export function fecharModal() {
  document.getElementById('modalGenerico').style.display = 'none';
}

export function adicionar() {
  const nomeAtual = sanitizarTexto(nomeMesa.value);
  const codigoAtual = sanitizarTexto(codigoInputAdicionar.value);
  const descricaoAtual = sanitizarTexto(descricao.value);
  const capacidadeAtual = sanitizarNumero(capacidade.value);
  const localAtual = sanitizarSelect(setor.value, [1, 2, 3]);
  const status = sanitizarSelect(statusInput.value, [0, 1, 2]);

  // Validações
  if (!validarTexto(nomeAtual, 'nome da mesa', 1, 10)) return;
  if (!validarTexto(codigoAtual, 'código', 1, 20)) return;
  if (!validarTexto(descricaoAtual, 'descrição')) return;
  if (!validarNumero(capacidadeAtual, 'capacidade', 1, 20)) return;
  if (!validarSelect(localAtual, 'local')) return;
  if (!validarSelect(status, 'status')) return;

  fetch('/api/mesas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: nomeAtual,
      codigo: codigoAtual,
      descricao: descricaoAtual,
      capacidade: Number(capacidadeAtual),
      status: Number(statusInput.value),
      local: Number(localAtual),
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Erro ao criar mesa');
      return response.json();
    })
    .then(() => {
      showModal('Mesa criada com sucesso!');
      closeModal();
      carregarMesasModal(carregarTodasMesasAtivas);
    })
    .catch(() => {
      showModal('Erro ao criar a mesa. Verifique os dados e tente novamente.');
    });
}

export function desativar() {
  const mesaId = Number(tituloModal.innerText.match(/\d+/)?.[0]);
  if (!mesaId) {
    showModal('Não foi possível identificar a mesa para desativar.');
    return;
  }

  fetch(`/api/mesas/${mesaId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) throw new Error('Erro ao desativar a mesa');
      return response.json();
    })
    .then((data) => {
      showModal(data.message || 'Mesa desativada com sucesso');

      if (data.mesa?.loc_descricao === 'Todas') {
        carregarMesasModal(carregarTodasMesasAtivas);
        return;
      }

      carregarMesasModal(carregarMesas, data.mesa?.loc_descricao);
    })
    .catch(() => {
      showModal('Erro ao desativar mesa. Tente novamente.');
    });
}

export function salvar() {
  const mesaId = Number(idText.dataset.id);
  if (!mesaId) {
    showModal('Não foi possível identificar a mesa para editar.');
    return;
  }

  const nomeAtual = sanitizarTexto(nomeMesa.value);
  const codigoAtual = sanitizarTexto(codigoInput.value);
  const descricaoAtual = sanitizarTexto(descricao.value);
  const capacidadeAtual = sanitizarNumero(capacidade.value);
  const localAtual = sanitizarSelect(setor.value, [1, 2, 3]);
  const status = sanitizarSelect(statusInput.value, [0, 1, 2]);

  // Validações
  if (!validarTexto(nomeAtual, 'nome da mesa', 1, 10)) return;
  if (!validarTexto(codigoAtual, 'código', 1, 20)) return;
  if (!validarTexto(descricaoAtual, 'descrição')) return;
  if (!validarNumero(capacidadeAtual, 'capacidade', 1, 20)) return;
  if (!validarSelect(localAtual, 'local')) return;
  if (!validarSelect(status, 'status')) return;

  // Flag para controlar se deve fechar o modal
  let deveFecharModal = true;

  fetch(`/api/mesas/${mesaId}`)
    .then((response) => {
      if (!response.ok) {
        deveFecharModal = false;
        throw new Error('Erro ao buscar os dados da mesa');
      }
      return response.json();
    })
    .then((mesa) => {
      const locId = mesa.loc_id;
      if (!locId) {
        deveFecharModal = false;
        throw new Error('Local da mesa não identificado');
      }

      const data = {
        nome: nomeAtual,
        codigo: codigoAtual,
        descricao: descricaoAtual,
        capacidade: Number(capacidadeAtual),
        status: Number(statusInput.value),
        local: Number(localAtual),
      };

      return fetch(`/api/mesas/${mesaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    })
    .then((response) => {
      if (!response.ok) {
        deveFecharModal = false;
        throw new Error('Erro ao atualizar a mesa');
      }
      showModal('Mesa atualizada com sucesso!');
      return response.json();
    })
    .then((data) => {
      // Só busca o local se a atualização foi bem sucedida
      return fetch(`/api/mesas/local/${data.loc_id || locId}`);
    })
    .then((localResponse) => {
      if (!localResponse.ok) {
        return null;
      }
      return localResponse.json();
    })
    .then((localJson) => {
      if (localJson) {
        const locais = document.querySelectorAll('.locais');
        let retornou = false;

        locais.forEach((elemento) => {
          const estiloElemento = window.getComputedStyle(elemento);
          if (
            estiloElemento.color === 'rgb(255, 99, 71)' &&
            elemento.dataset.local === 'Todas'
          ) {
            carregarMesasModal(carregarTodasMesasAtivas);
            retornou = true;
          }
        });

        if (!retornou) {
          carregarMesasModal(carregarMesas, localJson.loc_descricao);
        }
      }
    })
    .catch((error) => {
      showModal(error.message || 'Erro ao atualizar a mesa. Tente novamente.');
    })
    .finally(() => {
      // Fecha o modal apenas se não houve erros
      if (deveFecharModal) {
        closeModal();
      }
    });
}

export function closeModal() {
  const modal = document.querySelector('.modal-mesa');
  modal.style.display = 'none';
}

export function carregarMesasModal(carregar, local = null) {
  carregar(local).then(funcoesModal);
}

export function funcoesModal() {
  const cardMesas = document.querySelectorAll('.card-mesa');
  const modal = document.querySelector('.modal-mesa');
  const closeIcon = document.querySelector('#fechar-modal-mesas');
  const overlay = document.querySelector('.overlay');

  cardMesas.forEach((card) => {
    card.addEventListener('click', async () => {
      modal.style.display = 'flex';

      if (card.classList.contains('adicionar-mesa')) {
        idText.textContent = '';
        idText.dataset.id = '';
        nomeMesa.value = '';
        tituloModal.textContent = 'ADICIONAR MESA';
        descricao.value = '';
        capacidade.value = '';

        salvarStatus.style.display = 'None';
        adicionarStatus.style.display = 'Block';

        botaoSalvar.style.display = 'None';
        botaoAdicionar.style.display = 'Block';

        fetch('/api/mesas/local/locais/Restritos')
          .then((response) => {
            if (!response.ok)
              throw new Error('Erro ao buscar dados dos locais');
            return response.json();
          })
          .then((locaisSelect) => {
            setor.innerHTML = '<option value="selecionar">Selecionar</option>';
            locaisSelect.forEach((local, index) => {
              const option = document.createElement('option');
              option.value = index + 1;
              option.textContent = local.loc_descricao;
              setor.appendChild(option);
            });
          })
          .catch(() => {
            showModal('Erro ao carregar locais. Tente novamente.');
          });
        return;
      }

      salvarStatus.style.display = 'Block';
      adicionarStatus.style.display = 'None';

      botaoSalvar.style.display = 'Block';
      botaoAdicionar.style.display = 'None';
      await buscarDadosMesa(card.dataset.id);
    });
  });

  const closeModal = () => {
    modal.style.display = 'none';
  };

  closeIcon.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}

async function buscarDescricaoLocal(locId) {
  try {
    const response = await fetch(`/api/mesas/local/${locId}`);
    if (!response.ok) throw new Error('Erro ao buscar descrição do local');
    const local = await response.json();
    return local.loc_descricao;
  } catch (error) {
    showModal('Erro ao buscar descrição do local.');
    return null;
  }
}

export async function buscarDadosMesa(mesaId) {
  try {
    const [response, locais] = await Promise.all([
      fetch(`/api/mesas/${mesaId}`),
      fetch('/api/mesas/local/locais/Restritos'),
    ]);

    if (!response.ok) throw new Error('Erro ao buscar dados da mesa');
    if (!locais.ok) throw new Error('Erro ao buscar dados dos locais');

    const [dados, locaisSelect] = await Promise.all([
      response.json(),
      locais.json(),
    ]);

    const descricaoLocal = await buscarDescricaoLocal(dados.loc_id);

    tituloModal.textContent = `EDITAR - ${dados.mes_nome}`;
    idText.innerText = dados.mes_id ?? '';
    idText.dataset.id = dados.mes_id ?? '';
    nomeMesa.value = dados.mes_nome ?? '';
    codigoInput.value = dados.mes_codigo ?? '';
    descricao.value = dados.mes_descricao ?? '';
    capacidade.value = dados.mes_capacidade ?? 1;

    setor.innerHTML = '';

    locaisSelect.forEach((local, index) => {
      const option = document.createElement('option');
      option.value = index + 1;
      option.textContent = local.loc_descricao;

      if (descricaoLocal === local.loc_descricao) {
        option.selected = true;
      }

      setor.appendChild(option);
    });

    statusInput.value = dados.mes_status ?? '';
    return dados;
  } catch (error) {
    showModal('Erro ao carregar os dados da mesa.');
    return null;
  }
}

export async function carregarMesas(local) {
  try {
    const response = await fetch(`/api/mesas/local/descricao/${local}`);
    const mesas = await response.json();

    containerMesas.innerHTML = `
      <h2>Disponíveis</h2>
      <div class="mesas-container" id="mesas-disponiveis"></div>
      <h2>Ocupadas</h2>
      <div class="mesas-container" id="mesas-ocupadas"></div>
    `;

    const containerDisponiveis = document.querySelector('#mesas-disponiveis');
    const containerOcupadas = document.querySelector('#mesas-ocupadas');

    containerDisponiveis.innerHTML = '';
    containerOcupadas.innerHTML = '';

    if (!mesas.length) return;

    mesas.forEach((mesa) => {
      const divMesa = document.createElement('div');
      divMesa.classList.add('card-mesa');
      divMesa.dataset.id = mesa.mes_id;
      divMesa.innerHTML = `<p>${escapeHTML(mesa.mes_nome)}</p>`;

      switch (mesa.mes_status) {
        case 0:
          containerDisponiveis.appendChild(divMesa);
          break;
        case 1:
          containerOcupadas.appendChild(divMesa);
          divMesa.style.backgroundColor = 'tomato';
          break;
        case 2:
          containerOcupadas.appendChild(divMesa);
          divMesa.style.backgroundColor = '#D9BB29';
          break;
      }
    });
  } catch (error) {
    showModal('Erro ao carregar mesas. Tente novamente.');
    containerMesas.innerHTML = `
      <h2>Disponíveis</h2>
      <div class="mesas-container" id="mesas-disponiveis"></div>
      <h2>Ocupadas</h2>
      <div class="mesas-container" id="mesas-ocupadas"></div>
    `;
  }
}

export async function carregarTodasMesasAtivas() {
  try {
    const response = await fetch('/api/mesas');
    const mesas = await response.json();

    containerMesas.innerHTML = `
      <div class="mesas-container">
        <div class="card-mesa adicionar-mesa">+</div>
      </div>
      <h2>Disponíveis</h2>
      <div class="mesas-container" id="mesas-disponiveis"></div>
      <h2>Ocupadas</h2>
      <div class="mesas-container" id="mesas-ocupadas"></div>
    `;

    const containerDisponiveis = document.querySelector('#mesas-disponiveis');
    const containerOcupadas = document.querySelector('#mesas-ocupadas');

    containerDisponiveis.innerHTML = '';
    containerOcupadas.innerHTML = '';

    if (!mesas.length) return;

    mesas.forEach((mesa) => {
      const divMesa = document.createElement('div');
      divMesa.classList.add('card-mesa');
      divMesa.dataset.id = mesa.mes_id;
      divMesa.innerHTML = `<p>${mesa.mes_nome}</p>`;

      switch (mesa.mes_status) {
        case 0:
          containerDisponiveis.appendChild(divMesa);
          break;
        case 1:
          containerOcupadas.appendChild(divMesa);
          divMesa.style.backgroundColor = 'tomato';
          break;
        case 2:
          containerOcupadas.appendChild(divMesa);
          divMesa.style.backgroundColor = '#D9BB29';
          break;
      }
    });
  } catch (error) {
    showModal('Erro ao carregar mesas ativas. Tente novamente.');
    containerMesas.innerHTML = `
      <div class="mesas-container">
        <div class="card-mesa adicionar-mesa">+</div>
      </div>
      <h2>Disponíveis</h2>
      <div class="mesas-container" id="mesas-disponiveis"></div>
      <h2>Ocupadas</h2>
      <div class="mesas-container" id="mesas-ocupadas"></div>
    `;
  }
}

export async function carregarTodasMesasInativas() {
  try {
    const response = await fetch('/api/mesas/inativas');
    const mesas = await response.json();

    containerMesas.innerHTML =
      '<div class="mesas-container" id="mesas-inativas"></div>';
    const containerInativas = document.querySelector('#mesas-inativas');

    if (!mesas.length) return;

    mesas.forEach((mesa) => {
      const divMesa = document.createElement('div');
      divMesa.classList.add('card-mesa');
      divMesa.dataset.id = mesa.mes_id;
      divMesa.innerHTML = `<p>Mesa ${mesa.mes_id}</p>`;
      containerInativas.appendChild(divMesa);
    });
  } catch (error) {
    showModal('Erro ao carregar mesas inativas. Tente novamente.');
    containerMesas.innerHTML =
      '<div class="mesas-container" id="mesas-inativas"></div>';
  }
}

export async function carregarLocais() {
  try {
    const response = await fetch('/api/mesas/local/locais/Todos');
    const locais = await response.json();

    const opcoesDiv = document.getElementById('locais');
    opcoesDiv.innerHTML = '';

    if (!locais.length) return;

    locais.forEach((local, index) => {
      const h2 = document.createElement('h2');
      h2.classList.add('locais');
      h2.textContent = local.loc_descricao;
      h2.dataset.local = local.loc_descricao;

      if (index === 0) {
        h2.style.color = '#FF6347';
      }
      opcoesDiv.appendChild(h2);

      h2.addEventListener('click', async () => {
        document.querySelectorAll('.locais').forEach((elemento) => {
          elemento.style.color = '#000';
        });

        h2.style.color = '#FF6347';

        if (local.loc_descricao === 'Todas') {
          carregarMesasModal(carregarTodasMesasAtivas);
          return;
        }

        carregarMesasModal(carregarMesas, local.loc_descricao);
      });
    });
  } catch (error) {
    showModal('Erro ao carregar locais. Tente novamente.');
    containerMesas.innerHTML = '';
  }
}

export async function CarregarOcupadas() {
  // Implementação futura
}
