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
  const capacidadeAtual = document.getElementById('capacidade').value;
  const descricaoAtual = document.getElementById('descricao').value;
  const localAtual = document.getElementById('local').value;

  // Verifica se os campos estão preenchidos
  if (!capacidade || !descricao || !local) {
    alert('Todos os campos são obrigatórios!');
    return;
  }

  // Faz a requisição POST para criar a nova mesa
  fetch('http://localhost:3000/api/mesas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      capacidade,
      descricao,
      local,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Mesa criada:', data);
      alert('Mesa criada com sucesso!');
      // Aqui você pode adicionar a lógica para atualizar a lista de mesas ou fechar o modal
    })
    .catch((error) => {
      console.error('Erro:', error);
      alert('Erro ao criar a mesa');
    });
}

export function buscar() {
  const pesquisa = pesquisar.value.match(/\d+/)?.[0].trim(); // Pega o valor digitado e remove espaços extras

  if (!pesquisa) {
    carregarMesasModal('Externa');
    return;
  }

  carregarMesa(pesquisa);
}

export function salvar() {
  const mesaId = Number(tituloModal.innerText.match(/\d+/)?.[0]);

  // Coletando os dados dos campos
  const data = {
    descricao: descricao.value,
    capacidade: Number(capacidade.value),
    status: Number(statusInput.value),
    local: Number(setor.value),
  };

  // Fazendo a requisição para o servidor para atualizar os dados
  fetch(`http://localhost:3000/api/mesas/${mesaId}`, {
    // URL do seu endpoint para atualizar os dados
    method: 'PUT', // Pode ser 'PUT' ou 'PATCH', dependendo da sua implementação
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // Enviando os dados como JSON
  })
    .then((response) => {
      if (!response.ok) throw new Error('Erro ao atualizar a mesa');
      return response.json(); // Retorna a resposta do servidor (se necessário)
    })
    .then((data) => {
      console.log('Mesa atualizada com sucesso', data);
      alert('Mesa atualizada com sucesso!');
    })
    .catch((error) => {
      console.error('Erro:', error);
      alert('Erro ao atualizar a mesa');
    });
}

export function carregarMesasModal(local) {
  carregarMesas(local).then(() => {
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
          setor.innerHTML = `<option value="selecionar">Selecionar</option>`;
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
  });
}

async function buscarDescricaoLocal(locId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/mesas/local/${locId}`
    );
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
    const response = await fetch(`http://localhost:3000/api/mesas/${mesaId}`); // Corrigido: URL para buscar uma mesa específica
    if (!response.ok) throw new Error('Erro ao buscar dados da mesa');

    const dados = await response.json();

    const descricaoLocal = await buscarDescricaoLocal(dados.loc_id);

    console.log(dados);
    // Aqui você pode preencher os campos do seu modal com os dados da mesa
    tituloModal.textContent = `MESA ${dados.mes_id}`;
    descricao.value = dados.mes_descricao || '';
    capacidade.value = dados.mes_capacidade || 1;
    setor.innerHTML = `<option value="${dados.loc_id}">${descricaoLocal}</option>`;
    statusInput.value = dados.mes_status || '';
    return dados;
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar os dados da mesa.');
  }
}

export async function carregarMesa(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/mesas/${id}`);
    if (!response.ok) throw new Error('Erro ao carregar a mesa');

    const mesa = await response.json();
    containerMesas.innerHTML = ''; // Limpa as mesas antes de renderizar

    const divMesa = document.createElement('div');
    divMesa.classList.add('card-mesa');
    divMesa.dataset.id = mesa.mes_id;
    divMesa.innerHTML = `<p>Mesa ${mesa.mes_id}</p>`;
    containerMesas.appendChild(divMesa);

    // Reinsere o botão de adicionar mesa
    containerMesas.appendChild(btnAdicionarMesa);
  } catch (error) {
    console.error(error);
    // alert('Erro ao carregar as mesas.');
  }
}

export async function carregarMesas(local) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/mesas//local/descricao/${local}`
    ); // Corrigido: URL para buscar todas as mesas
    if (!response.ok) throw new Error('Erro ao carregar as mesas');

    const mesas = await response.json();
    containerMesas.innerHTML = ''; // Limpa as mesas antes de renderizar

    mesas.forEach((mesa) => {
      const divMesa = document.createElement('div');
      divMesa.classList.add('card-mesa');
      divMesa.dataset.id = mesa.mes_id;
      divMesa.innerHTML = `<p>Mesa ${mesa.mes_id}</p>`;
      containerMesas.appendChild(divMesa);
    });

    // Reinsere o botão de adicionar mesa
    containerMesas.appendChild(btnAdicionarMesa);
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar as mesas.');
  }
}

export async function carregarLocais() {
  try {
    const response = await fetch(
      'http://localhost:3000/api/mesas/local/locais'
    ); // Ajuste a rota conforme seu backend
    if (!response.ok) throw new Error('Erro ao buscar locais distintos');

    const locais = await response.json();

    const opcoesDiv = document.getElementById('locais'); // Seleciona a div que conterá os h2
    opcoesDiv.innerHTML = ''; // Limpa o conteúdo antes de adicionar novos elementos

    locais.forEach((local) => {
      const h2 = document.createElement('h2');
      h2.classList.add('locais');
      h2.textContent = local.loc_descricao; // Preenche com o nome da área
      opcoesDiv.appendChild(h2);

      h2.addEventListener('click', async function () {
        document.querySelectorAll('.locais').forEach(function (elemento) {
          elemento.style.color = '#000';
        });

        h2.style.color = '#FF6347';
        carregarMesasModal(h2.textContent);
      });
    });
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar as áreas.');
  }
}
