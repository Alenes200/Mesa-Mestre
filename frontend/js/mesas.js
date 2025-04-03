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

const nomeMesa = document.getElementById('nomeMesa');
const idText = document.getElementById('idText');
const codigoInput = document.getElementById('codigoInput');

export async function configurarLocais() {
  try {
    const response = await fetch('/api/mesas/local/locais/Todos');
    if (!response.ok) throw new Error('Erro ao buscar locais');

    const locais = await response.json();
    preencherTabelaLocais(locais);
  } catch (error) {
    console.error('Erro:', error);
  }
}

function preencherTabelaLocais(locais) {
  const tabela = document.querySelector('#tabela-locais tbody');
  tabela.innerHTML = ''; // Limpa antes de adicionar os novos dados

  locais.forEach((local) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${local.loc_descricao}</td>
      <td class="opcoes">
        <button class="editar" data-id="${local.loc_id}">✏️</button>
        <button class="deletar" data-id="${local.loc_id}">🗑️</button>
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
  if (!novoNome) return;

  try {
    const response = await fetch(`/api/mesas/local/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao: novoNome }),
    });

    if (!response.ok) throw new Error('Erro ao editar local');
    configurarLocais(); // Atualiza a lista
  } catch (error) {
    console.error('Erro:', error);
  }
}

export async function deletarLocal(id) {
  if (!confirm('Tem certeza que deseja excluir este local?')) return;

  try {
    const response = await fetch(`/api/mesas/local/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir local');

    configurarLocais(); // Atualiza a lista
  } catch (error) {
    console.error('Erro:', error);
  }
}

export function abrirModal(titulo, conteudo) {
  const modal = document.getElementById('modalGenerico');
  const tituloModal = document.getElementById('tituloModalGenerico');
  const corpoModal = document.getElementById('conteudoModalGenerico');

  tituloModal.textContent = titulo;
  corpoModal.innerHTML = conteudo; // Adiciona conteúdo dinâmico

  modal.style.display = 'flex';
}

export function fecharModal() {
  document.getElementById('modalGenerico').style.display = 'none';
}

export function adicionar() {
  const capacidadeAtual = capacidade.value;
  const descricaoAtual = descricao.value;
  const localAtual = setor.value;
  const nomeAtual = nomeMesa.value;

  const salvarStatus = document.getElementById('statusInputAdicionar');
  const codigoInput = document.getElementById('codigoInputAdicionar');

  const codigoAtual = codigoInput.value;
  const status = salvarStatus.value;

  console.log(capacidadeAtual);
  console.log(descricaoAtual);
  console.log(localAtual);
  console.log(nomeAtual);
  console.log(codigoAtual);
  console.log(status);

  // Verifica se os campos estão preenchidos
  if (
    !status ||
    status == 'selecionar' ||
    !capacidadeAtual ||
    !descricaoAtual ||
    !localAtual ||
    localAtual == 'selecionar' ||
    !nomeAtual ||
    !codigoAtual
  ) {
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
      nome: nomeAtual,
      codigo: codigoAtual,
      descricao: descricaoAtual,
      capacidade: Number(capacidadeAtual),
      status: Number(statusInput.value),
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

      if (data.mesa.loc_descricao == 'Todas') {
        carregarMesasModal(carregarTodasMesasAtivas);
        return;
      }

      // if (data.mesa.loc_descricao == 'Inativas') {
      //   carregarMesasModal(carregarTodasMesasInativas);
      //   return;
      // }

      carregarMesasModal(carregarMesas, data.mesa.loc_descricao);
    })
    .catch((error) => {
      // Trata os erros
      console.error(error);
      alert('Erro ao desativar mesa.');
    });
}

// export function buscar() {
//   const pesquisa = pesquisar.value.trim();
//   const mes_id = pesquisa.match(/\d+/) ? pesquisa.match(/\d+/)[0] : null; // Extrai apenas o número

//   const locais = document.getElementsByClassName('locais');

//   let localPesquisa;

//   // Obtém o local selecionado e o id do local
//   Array.from(locais).forEach(function (local, index) {
//     if (local.style.color == 'rgb(255, 99, 71)') {
//       localPesquisa = local.dataset.local;
//     }
//   });

//   if (!pesquisa && localPesquisa === 'Ativas') {
//     carregarMesasModal(carregarTodasMesasAtivas);
//     return;
//   }

//   if (!pesquisa && localPesquisa === 'Inativas') {
//     carregarMesasModal(carregarTodasMesasInativas);
//     return;
//   }

//   if (!pesquisa) {
//     carregarMesasModal(carregarMesas, localPesquisa);
//     return;
//   }

//   carregarMesasPesquisa(mes_id, pesquisa, localPesquisa).then(funcoesModal);
// }

export function salvar() {
  const mesaId = Number(idText.dataset.id);

  const capacidadeAtual = capacidade.value;
  const descricaoAtual = descricao.value;
  const localAtual = setor.value;
  const nomeAtual = nomeMesa.value;
  const codigoAtual = codigoInput.value;
  const status = statusInput.value;

  // Verifica se os campos estão preenchidos
  if (
    !status ||
    status == 'selecionar' ||
    !capacidadeAtual ||
    !descricaoAtual ||
    !localAtual ||
    localAtual == 'selecionar' ||
    !nomeAtual ||
    !codigoAtual
  ) {
    alert('Todos os campos são obrigatórios!');
    return;
  }

  fetch(`/api/mesas/${mesaId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao buscar os dados da mesa');
      }
      return response.json();
    })
    .then((mesa) => {
      console.log('Mesa encontrada:', mesa);

      // Pegando o loc_id da mesa
      const locId = mesa.loc_id;
      console.log('loc_id:', locId);

      if (!locId) {
        throw new Error('locId está indefinido!');
      }

      // Coletando os dados dos campos
      const data = {
        nome: nomeAtual,
        codigo: codigoAtual,
        descricao: descricaoAtual,
        capacidade: Number(capacidadeAtual),
        status: Number(statusInput.value),
        local: Number(localAtual),
      };

      // Atualizar a mesa
      return fetch(`/api/mesas/${mesaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Erro ao atualizar a mesa');
          return response.json();
        })
        .then((data) => {
          console.log('Mesa atualizada com sucesso', data);
          alert('Mesa atualizada com sucesso!');

          // Agora faz o segundo fetch para pegar o local
          return fetch(`/api/mesas/local/${locId}`);
        });
    })
    .then((localResponse) => {
      if (!localResponse.ok) throw new Error('Erro ao buscar o local');
      return localResponse.json();
    })
    .then((localJson) => {
      console.log(localJson.loc_descricao);

      const locais = document.querySelectorAll('.locais');
      let retornou = false;

      locais.forEach(function (elemento) {
        const estiloElemento = window.getComputedStyle(elemento);

        if (
          estiloElemento.color === 'rgb(255, 99, 71)' &&
          elemento.dataset.local === 'Todas'
        ) {
          carregarMesasModal(carregarTodasMesasAtivas);
          retornou = true;
          return;
        }

        // if (
        //   estiloElemento.color === 'rgb(255, 99, 71)' &&
        //   elemento.dataset.local === 'Inativas'
        // ) {
        //   carregarMesasModal(carregarTodasMesasInativas);
        //   retornou = true;
        //   return;
        // }
      });

      if (!retornou) {
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
    tituloModal.textContent = `EDITAR - ${dados.mes_nome}`;
    idText.innerText = dados.mes_id ?? '';
    idText.dataset.id = dados.mes_id ?? '';
    nomeMesa.value = dados.mes_nome ?? '';
    codigoInput.value = dados.mes_codigo ?? '';
    descricao.value = dados.mes_descricao ?? '';
    capacidade.value = dados.mes_capacidade ?? 1;

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
    statusInput.value = dados.mes_status ?? '';
    return dados;
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar os dados da mesa.');
  }
}

// export async function carregarMesasPesquisa(id, descricao, local) {
//   try {
//     let url = `/api/mesas/pesquisa/area?mes_id=${id}&mes_descricao=${descricao}&loc_descricao=${local}`;

//     if (local === 'Ativas') {
//       url = `/api/mesas/pesquisa/ativas?mes_id=${id}&mes_descricao=${descricao}`;
//     } else if (local === 'Inativas') {
//       url = `/api/mesas/pesquisa/inativas?mes_id=${id}&mes_descricao=${descricao}`;
//     }

//     const response = await fetch(url);
//     // if (!response.ok)
//     //   throw new Error(`Erro ao carregar a mesa do local ${local}`);

//     const mesas = await response.json();
//     containerMesas.innerHTML = ''; // Limpa as mesas antes de renderizar

//     if (mesas.length === 0) {
//       // Caso não haja mesas, apenas limpa e deixa vazio
//       return;
//     }

//     mesas.forEach((mesa) => {
//       const divMesa = document.createElement('div');
//       divMesa.classList.add('card-mesa');
//       divMesa.dataset.id = mesa.mes_id;
//       divMesa.innerHTML = `<p>Mesa ${mesa.mes_id}</p>`;
//       containerMesas.appendChild(divMesa);
//     });
//   } catch (error) {
//     console.error(error);
//     containerMesas.innerHTML = '';
//   }
// }

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
    `;

    // Selecionando os contêineres
    const containerDisponiveis = document.querySelector('#mesas-disponiveis');
    const containerOcupadas = document.querySelector('#mesas-ocupadas');

    // Limpando as seções antes de renderizar
    containerDisponiveis.innerHTML = '';
    containerOcupadas.innerHTML = '';

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
        case 0:
          containerDisponiveis.appendChild(divMesa);
          break;
        case 1:
          containerOcupadas.appendChild(divMesa);
          divMesa.style.backgroundColor = '#90FF98';
          break;
        case 2:
          containerOcupadas.appendChild(divMesa);
          divMesa.style.backgroundColor = '#D9BB29';
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
            +
        </div>
    </div>

    <h2>Disponíveis</h2>
    <div class="mesas-container" id="mesas-disponiveis"></div>

    <h2>Ocupadas</h2>
    <div class="mesas-container" id="mesas-ocupadas"></div>
    `;

    // Selecionando os contêineres
    const containerDisponiveis = document.querySelector('#mesas-disponiveis');
    const containerOcupadas = document.querySelector('#mesas-ocupadas');

    // Limpando as seções antes de renderizar
    containerDisponiveis.innerHTML = '';
    containerOcupadas.innerHTML = '';

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
        case 0:
          containerDisponiveis.appendChild(divMesa);
          break;
        case 1:
          containerOcupadas.appendChild(divMesa);
          divMesa.style.backgroundColor = '#90FF98';
          break;
        case 2:
          containerOcupadas.appendChild(divMesa);
          divMesa.style.backgroundColor = '#D9BB29';
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
    '<div class="mesas-container" id="mesas-inativas"></div>';
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

        if (local.loc_descricao == 'Todas') {
          carregarMesasModal(carregarTodasMesasAtivas);
          return;
        }

        // if (local.loc_descricao == 'Inativas') {
        //   carregarMesasModal(carregarTodasMesasInativas);
        //   return;
        // }

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
