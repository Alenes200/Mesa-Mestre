const containerMesas = document.querySelector('.mesas');
const btnAdicionarMesa = document.querySelector('.adicionar-mesa'); // Corrigido: remover o ponto
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

export function adicionar() {
  const capacidadeAtual = capacidade.value;
  const descricaoAtual = descricao.value;
  const localAtual = setor.value;

  // Verifica se os campos estão preenchidos
  if (!capacidadeAtual || !descricaoAtual || !localAtual) {
    alert('Todos os campos são obrigatórios!');
    return;
  }

  // Faz a requisição POST para criar a nova mesa
  fetch('/api/mesas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      capacidade: capacidadeAtual,
      descricao: descricaoAtual,
      local: Number(localAtual),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Mesa criada:', data);
      alert('Mesa criada com sucesso!');
      carregarMesasModal(carregarTodasMesasAtivas);
    })
    .catch((error) => {
      console.error('Erro:', error);
      alert('Erro ao criar a mesa');
    });
}

export function desativar() {
  const mesaId = Number(tituloModal.innerText.match(/\d+/)?.[0]);
  // Realiza a requisição DELETE utilizando fetch
  fetch(`/api/mesas/${mesaId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        return Promise.reject('Erro ao desativar a mesa.');
      }
      // Converte a resposta para JSON
      return response.json();
    })
    .then((data) => {
      // Exibe a mensagem de sucesso
      alert(data.message);
      console.log(data.mesa); // Exibe os dados da mesa desativada no console

      if (data.mesa.loc_descricao == 'Ativas') {
        carregarMesasModal(carregarTodasMesasAtivas);
        return;
      }

      if (data.mesa.loc_descricao == 'Inativas') {
        carregarMesasModal(carregarTodasMesasInativas);
        return;
      }

      carregarMesasModal(carregarMesas, data.mesa.loc_descricao);
    })
    .catch((error) => {
      // Trata os erros
      console.error(error);
      alert('Erro ao desativar mesa.');
    });
}

export function buscar() {
  const pesquisa = pesquisar.value.trim();
  const mes_id = pesquisa.match(/\d+/) ? pesquisa.match(/\d+/)[0] : null; // Extrai apenas o número

  const locais = document.getElementsByClassName('locais');

  let localPesquisa;

  // Obtém o local selecionado e o id do local
  Array.from(locais).forEach(function (local, index) {
    if (local.style.color == 'rgb(255, 99, 71)') {
      localPesquisa = local.dataset.local;
    }
  });

  if (!pesquisa && localPesquisa === 'Ativas') {
    carregarMesasModal(carregarTodasMesasAtivas);
    return;
  }

  if (!pesquisa && localPesquisa === 'Inativas') {
    carregarMesasModal(carregarTodasMesasInativas);
    return;
  }

  if (!pesquisa) {
    carregarMesasModal(carregarMesas, localPesquisa);
    return;
  }

  carregarMesasPesquisa(mes_id, pesquisa, localPesquisa).then(funcoesModal);
}

export function salvar() {
  const mesaId = Number(tituloModal.innerText.match(/\d+/)?.[0]);

  let locId;

  fetch(`/api/mesas/${mesaId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao buscar os dados da mesa');
      }
      return response.json(); // Converte a resposta em JSON
    })
    .then((mesa) => {
      console.log('Mesa encontrada:', mesa);

      // Pegando o loc_id da mesa
      locId = mesa.loc_id;
      console.log('loc_id:', locId);

      // Aqui você pode usar o loc_id como precisar
    })
    .catch((error) => {
      console.error('Erro:', error);
    });

  // Coletando os dados dos campos
  const data = {
    descricao: descricao.value,
    capacidade: Number(capacidade.value),
    status: Number(statusInput.value),
    local: Number(setor.value),
  };

  // Fazendo a requisição para atualizar os dados da mesa
  fetch(`/api/mesas/${mesaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Erro ao atualizar a mesa');
      return response.json(); // Converte a resposta em JSON
    })
    .then((data) => {
      console.log('Mesa atualizada com sucesso', data);
      alert('Mesa atualizada com sucesso!');

      // Agora faz o segundo fetch para pegar o local
      return fetch(`/api/mesas/local/${locId}`);
    })
    .then((localResponse) => {
      if (!localResponse.ok) throw new Error('Erro ao buscar o local');
      return localResponse.json(); // Converte a resposta em JSON
    })
    .then((localJson) => {
      console.log(localJson.loc_descricao);

      const locais = document.querySelectorAll('.locais');

      let retornou = false;

      locais.forEach(function (elemento) {
        const estiloElemento = window.getComputedStyle(elemento); // Pega o estilo computado

        if (
          estiloElemento.color === 'rgb(255, 99, 71)' &&
          elemento.dataset.local === 'Ativas'
        ) {
          carregarMesasModal(carregarTodasMesasAtivas);
          retornou = true;
          return;
        }

        if (
          estiloElemento.color === 'rgb(255, 99, 71)' &&
          elemento.dataset.local === 'Inativas'
        ) {
          carregarMesasModal(carregarTodasMesasInativas);
          retornou = true;
          return;
        }
      });

      if (retornou == false) {
        carregarMesasModal(carregarMesas, localJson.loc_descricao);
      }
    })
    .catch((error) => {
      console.error('Erro:', error);
      alert('Erro ao atualizar a mesa');
    });
}

export function carregarMesasModal(carregar, local = null) {
  carregar(local).then(funcoesModal);
}

export function funcoesModal() {
  // Modal functionality remains the same
  const cardMesas = document.querySelectorAll('.card-mesa');
  const modal = document.querySelector('.modal-mesa');
  const closeIcon = document.querySelector('#fechar-modal-mesas');
  const overlay = document.querySelector('.overlay');

  cardMesas.forEach((card) => {
    card.addEventListener('click', async () => {
      modal.style.display = 'flex';

      if (card.classList.contains('adicionar-mesa')) {
        tituloModal.textContent = 'ADICIONAR MESA';
        descricao.value = '';
        capacidade.value = '';

        fetch(`/api/mesas/local/locais/Restritos`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Erro ao buscar dados dos locais');
            }
            return response.json(); // Converte a resposta para JSON
          })
          .then((locaisSelect) => {
            setor.innerHTML = `<option value="selecionar">Selecionar</option>`;

            locaisSelect.forEach((local, index) => {
              const option = document.createElement('option');
              option.value = index + 1;
              option.textContent = local.loc_descricao;

              setor.appendChild(option);
            });
          })
          .catch((error) => {
            console.error('Erro:', error);
          });

        statusText.innerText = '1';

        salvarStatus.style.display = 'None';
        adicionarStatus.style.display = 'Block';

        botaoSalvar.style.display = 'None';
        botaoAdicionar.style.display = 'Block';
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
    console.error(error);
    alert('Erro ao buscar descrição do local.');
  }
}

export async function buscarDadosMesa(mesaId) {
  try {
    const response = await fetch(`/api/mesas/${mesaId}`);
    if (!response.ok) throw new Error('Erro ao buscar dados da mesa');

    const locais = await fetch(`/api/mesas/local/locais/Restritos`);
    if (!locais.ok) throw new Error('Erro ao buscar dados dos locais');

    const locaisSelect = await locais.json();

    const dados = await response.json();

    const descricaoLocal = await buscarDescricaoLocal(dados.loc_id);

    console.log(dados);
    // Aqui você pode preencher os campos do seu modal com os dados da mesa
    tituloModal.textContent = `EDITAR - MESA ${dados.mes_id}`;
    descricao.value = dados.mes_descricao || '';
    capacidade.value = dados.mes_capacidade || 1;

    setor.innerHTML = '';

    locaisSelect.forEach(function (local, index) {
      const option = document.createElement('option');
      option.value = index + 1;
      option.textContent = local.loc_descricao;

      if (descricaoLocal == local.loc_descricao) {
        option.selected = true;
      }

      setor.appendChild(option);
    });

    // setor.innerHTML = `<option value="${dados.loc_id}">${descricaoLocal}</option>`;
    statusInput.value = dados.mes_status || '';
    return dados;
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar os dados da mesa.');
  }
}

export async function carregarMesasPesquisa(id, descricao, local) {
  try {
    let url = `/api/mesas/pesquisa/area?mes_id=${id}&mes_descricao=${descricao}&loc_descricao=${local}`;

    if (local === 'Ativas') {
      url = `/api/mesas/pesquisa/ativas?mes_id=${id}&mes_descricao=${descricao}`;
    } else if (local === 'Inativas') {
      url = `/api/mesas/pesquisa/inativas?mes_id=${id}&mes_descricao=${descricao}`;
    }

    const response = await fetch(url);
    // if (!response.ok)
    //   throw new Error(`Erro ao carregar a mesa do local ${local}`);

    const mesas = await response.json();
    containerMesas.innerHTML = ''; // Limpa as mesas antes de renderizar

    if (mesas.length === 0) {
      // Caso não haja mesas, apenas limpa e deixa vazio
      return;
    }

    mesas.forEach((mesa) => {
      const divMesa = document.createElement('div');
      divMesa.classList.add('card-mesa');
      divMesa.dataset.id = mesa.mes_id;
      divMesa.innerHTML = `<p>Mesa ${mesa.mes_id}</p>`;
      containerMesas.appendChild(divMesa);
    });
  } catch (error) {
    console.error(error);
    containerMesas.innerHTML = '';
  }
}

export async function carregarMesas(local) {
  console.log(local);
  try {
    const response = await fetch(`/api/mesas/local/descricao/${local}`);
    const mesas = await response.json();

    containerMesas.innerHTML = `
    <h2>Disponíveis</h2>
    <div class="mesas-container" id="mesas-disponiveis"></div>

    <h2>Ocupadas</h2>
    <div class="mesas-container" id="mesas-ocupadas"></div>

    <h2>Aguardando Pagamento</h2>
    <div class="mesas-container" id="mesas-aguardando"></div>
    `;

    // Selecionando os contêineres
    const containerDisponiveis = document.querySelector('#mesas-disponiveis');
    const containerOcupadas = document.querySelector('#mesas-ocupadas');
    const containerAguardando = document.querySelector('#mesas-aguardando');

    // Limpando as seções antes de renderizar
    containerDisponiveis.innerHTML = '';
    containerOcupadas.innerHTML = '';
    containerAguardando.innerHTML = '';

    if (mesas.length === 0) {
      return; // Se não há mesas, não faz nada
    }

    mesas.forEach((mesa) => {
      const divMesa = document.createElement('div');
      divMesa.classList.add('card-mesa');
      divMesa.dataset.id = mesa.mes_id;
      divMesa.innerHTML = `<p>${mesa.mes_nome}</p>`;

      // Distribuir a mesa conforme o status
      switch (mesa.mes_status) {
        case 'disponível':
          containerDisponiveis.appendChild(divMesa);
          break;
        case 'ocupada':
          containerOcupadas.appendChild(divMesa);
          break;
        case 'aguardando pagamento':
          containerAguardando.appendChild(divMesa);
          break;
        default:
          console.warn(`Status desconhecido: ${mesa.mes_status}`);
      }
    });
  } catch (error) {
    console.error(error);
    containerMesas.innerHTML = `

    <h2>Disponíveis</h2>
    <div class="mesas-container" id="mesas-disponiveis"></div>

    <h2>Ocupadas</h2>
    <div class="mesas-container" id="mesas-ocupadas"></div>

    <h2>Aguardando Pagamento</h2>
    <div class="mesas-container" id="mesas-aguardando"></div>
    `;
  }
}

export async function carregarTodasMesasAtivas() {
  try {
    const response = await fetch(`/api/mesas`);
    const mesas = await response.json();

    containerMesas.innerHTML = `
    <div class="mesas-container">
        <div class="card-mesa adicionar-mesa">
            <p>+</p>
        </div>
    </div>

    <h2>Disponíveis</h2>
    <div class="mesas-container" id="mesas-disponiveis"></div>

    <h2>Ocupadas</h2>
    <div class="mesas-container" id="mesas-ocupadas"></div>

    <h2>Aguardando Pagamento</h2>
    <div class="mesas-container" id="mesas-aguardando"></div>
    `;

    // Selecionando os contêineres
    const containerDisponiveis = document.querySelector('#mesas-disponiveis');
    const containerOcupadas = document.querySelector('#mesas-ocupadas');
    const containerAguardando = document.querySelector('#mesas-aguardando');

    // Limpando as seções antes de renderizar
    containerDisponiveis.innerHTML = '';
    containerOcupadas.innerHTML = '';
    containerAguardando.innerHTML = '';

    if (mesas.length === 0) {
      return; // Se não há mesas, não faz nada
    }

    mesas.forEach((mesa) => {
      const divMesa = document.createElement('div');
      divMesa.classList.add('card-mesa');
      divMesa.dataset.id = mesa.mes_id;
      divMesa.innerHTML = `<p>${mesa.mes_nome}</p>`;

      // Distribuir a mesa conforme o status
      switch (mesa.mes_status) {
        case 'disponível':
          containerDisponiveis.appendChild(divMesa);
          break;
        case 'ocupada':
          containerOcupadas.appendChild(divMesa);
          break;
        case 'aguardando pagamento':
          containerAguardando.appendChild(divMesa);
          break;
        default:
          console.warn(`Status desconhecido: ${mesa.mes_status}`);
      }
    });
  } catch (error) {
    console.error(error);
    containerMesas.innerHTML = `
    <div class="mesas-container" class="adicionar-mesa">
        <div class="card-mesa">
            <p>+</p>
        </div>
    </div>

    <h2>Disponíveis</h2>
    <div class="mesas-container" id="mesas-disponiveis"></div>

    <h2>Ocupadas</h2>
    <div class="mesas-container" id="mesas-ocupadas"></div>

    <h2>Aguardando Pagamento</h2>
    <div class="mesas-container" id="mesas-aguardando"></div>
    `;
  }
}

export async function carregarTodasMesasInativas() {
  try {
    const response = await fetch('/api/mesas/inativas');
    // if (!response.ok) throw new Error('Erro ao buscar mesas');

    const mesas = await response.json();

    containerMesas.innerHTML =
      '<div class="mesas-container" id="mesas-inativas"></div>';

    const containerInativas = document.querySelector('#mesas-inativas');

    if (mesas.length === 0) {
      // Caso não haja mesas, apenas limpa e deixa vazio
      return;
    }

    mesas.forEach((mesa) => {
      const divMesa = document.createElement('div');
      divMesa.classList.add('card-mesa');
      divMesa.dataset.id = mesa.mes_id;
      divMesa.innerHTML = `<p>Mesa ${mesa.mes_id}</p>`;
      containerInativas.appendChild(divMesa);
    });
  } catch (error) {
    console.error(error);
    containerMesas.innerHTML = `
    <h2>Disponíveis</h2>
    <div class="mesas-container" id="mesas-disponiveis"></div>

    <h2>Ocupadas</h2>
    <div class="mesas-container" id="mesas-ocupadas"></div>

    <h2>Aguardando Pagamento</h2>
    <div class="mesas-container" id="mesas-aguardando"></div>
    `;
  }
}

export async function carregarLocais() {
  try {
    const response = await fetch('/api/mesas/local/locais/Todos');
    // if (!response.ok) throw new Error('Erro ao buscar locais distintos');

    const locais = await response.json();

    const opcoesDiv = document.getElementById('locais'); // Seleciona a div que conterá os h2
    opcoesDiv.innerHTML = ''; // Limpa o conteúdo antes de adicionar novos elementos

    if (locais.length === 0) {
      // Caso não haja locais, apenas limpa e deixa vazio
      return;
    }

    locais.forEach((local, index) => {
      const h2 = document.createElement('h2');
      h2.classList.add('locais');
      h2.textContent = local.loc_descricao; // Preenche com o nome da área
      h2.dataset.local = local.loc_descricao; // Adiciona um atributo data-local

      if (index == 0) {
        h2.style.color = '#FF6347';
      }
      opcoesDiv.appendChild(h2);

      h2.addEventListener('click', async function () {
        document.querySelectorAll('.locais').forEach(function (elemento) {
          elemento.style.color = '#000';
        });

        h2.style.color = '#FF6347';

        if (local.loc_descricao == 'Ativas') {
          carregarMesasModal(carregarTodasMesasAtivas);
          return;
        }

        if (local.loc_descricao == 'Inativas') {
          carregarMesasModal(carregarTodasMesasInativas);
          return;
        }

        carregarMesasModal(carregarMesas, local.loc_descricao);
      });
    });
  } catch (error) {
    console.error(error);
    containerMesas.innerHTML = '';
  }
}

export async function CarregarOcupadas(params) {
  containerMesas;
}
