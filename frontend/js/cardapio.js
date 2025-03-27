let allProdutos = [];
let carrinho = [];
let mesaId; // Defina o ID da mesa dinamicamente

// Função para buscar os produtos do backend
async function fetchProdutos() {
  try {
    const response = await fetch('/api/produtos');
    if (!response.ok) {
      throw new Error('Erro ao obter produtos.');
    }
    allProdutos = await response.json();
    displayProdutos(allProdutos);
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    alert('Erro ao obter produtos. Verifique o console para mais detalhes.');
  }
}

// Função para exibir os produtos na página
function displayProdutos(produtos) {
  const produtosContainer = document.getElementById('produtos-container');
  produtosContainer.innerHTML = '';

  const tipos = [...new Set(produtos.map((produto) => produto.pro_tipo))];

  tipos.forEach((tipo) => {
    const tipoSection = document.createElement('section');
    tipoSection.className = 'tipo-section';
    tipoSection.id = tipo.toLowerCase().replace(/\s+/g, '-');
    tipoSection.innerHTML = `<h2>${tipo}</h2>`;

    const tipoProdutos = produtos.filter(
      (produto) => produto.pro_tipo === tipo
    );

    tipoProdutos.forEach((produto) => {
      const produtoElement = document.createElement('div');
      produtoElement.className = 'card-produto';
      const preco =
        typeof produto.pro_preco === 'number'
          ? `R$ ${produto.pro_preco.toFixed(2)}`
          : 'Preço indisponível';
      produtoElement.innerHTML = `
                  <h3>${produto.pro_nome}</h3>
                  <p>${produto.pro_descricao}</p>
                  <p>${preco}</p>
              `;
      produtoElement.addEventListener('click', () => openModal(produto));
      tipoSection.appendChild(produtoElement);
    });

    produtosContainer.appendChild(tipoSection);
  });
}

// Função para exibir produtos de um tipo específico
function displayProdutosPorTipo(tipo) {
  const produtosContainer = document.getElementById('produtos-container');
  produtosContainer.innerHTML = '';

  const tipoProdutos = allProdutos.filter(
    (produto) => produto.pro_tipo === tipo
  );

  tipoProdutos.forEach((produto) => {
    const produtoElement = document.createElement('div');
    produtoElement.className = 'card-produto';
    const preco =
      typeof produto.pro_preco === 'number'
        ? `R$ ${produto.pro_preco.toFixed(2)}`
        : 'Preço indisponível';
    produtoElement.innerHTML = `
              <h3>${produto.pro_nome}</h3>
              <p>${produto.pro_descricao}</p>
              <p>${preco}</p>
          `;
    produtoElement.addEventListener('click', () => openModal(produto));
    produtosContainer.appendChild(produtoElement);
  });
}

// Função para abrir o modal do produto
function openModal(produto) {
  const modal = document.getElementById('modal');
  console.log('Abrindo modal para o produto:', produto);
  document.getElementById('modal-nome').innerText = produto.pro_nome;
  document.getElementById('modal-imagem').src =
    `../images/${produto.pro_imagem}`;
  document.getElementById('modal-descricao').innerText = produto.pro_descricao;
  document.getElementById('modal-preco').innerText =
    typeof produto.pro_preco === 'number'
      ? `R$ ${produto.pro_preco.toFixed(2)}`
      : 'Preço indisponível';
  modal.style.display = 'block';

  document.getElementById('adicionar-carrinho').onclick = () => {
    addToCart(produto);
    closeModal();
  };
}

// Função para fechar o modal do produto
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  document.getElementById('quantidade').value = 1; // Redefine a quantidade para 1
}

// Função para adicionar o item ao carrinho
function addToCart(produto) {
  const quantidade = parseInt(document.getElementById('quantidade').value, 10);
  const itemCarrinho = carrinho.find((item) => item.pro_id === produto.pro_id);

  if (itemCarrinho) {
    itemCarrinho.quantidade += quantidade;
  } else {
    carrinho.push({ ...produto, quantidade });
  }

  console.log('Carrinho:', carrinho);
  closeModal();
}

// Função para abrir o off-canvas do carrinho
function openCarrinho() {
  const carrinhoOffcanvas = document.getElementById('carrinho-offcanvas');
  const carrinhoContainer = document.getElementById('carrinho-container');
  carrinhoContainer.innerHTML = '';

  let total = 0;

  carrinho.forEach((item) => {
    const subtotal = item.pro_preco * item.quantidade;
    total += subtotal;

    const itemElement = document.createElement('div');
    itemElement.innerHTML = `
      <p>${item.pro_nome} - Quantidade: ${item.quantidade} - Subtotal: R$ ${subtotal.toFixed(2)}</p>
    `;
    carrinhoContainer.appendChild(itemElement);
  });

  const totalElement = document.createElement('div');
  totalElement.innerHTML = `<p>Total: R$ ${total.toFixed(2)}</p>`;
  carrinhoContainer.appendChild(totalElement);

  carrinhoOffcanvas.classList.add('open');
}

function closeCarrinho() {
  const carrinhoOffcanvas = document.getElementById('carrinho-offcanvas');
  carrinhoOffcanvas.classList.remove('open');
}

// Função para enviar os pedidos
async function enviarPedidos() {
  try {
    // Verifica se há itens no carrinho
    if (carrinho.length === 0) {
      alert('O carrinho está vazio!');
      return;
    }

    // Obtenha o ID da mesa dinamicamente
    mesaId = obterMesaId();
    console.log('Mesa ID obtido:', mesaId);

    const comandaId = await verificarOuCriarComanda();
    console.log('Comanda ID obtido:', comandaId);

    const pedidoId = await criarPedido(comandaId);
    console.log('Pedido ID criado:', pedidoId);

    await adicionarProdutosAoPedido(pedidoId);
    console.log('Produtos adicionados ao pedido');

    await atualizarPedidoComPrecoTotal(pedidoId);
    console.log('Preço total atualizado');

    alert('Pedido enviado com sucesso!');
    carrinho = [];
    closeCarrinho();
  } catch (error) {
    console.error('Erro detalhado ao enviar pedidos:', error);
    alert(`Erro ao enviar pedidos: ${error.message}`);
  }
}

async function verificarOuCriarComanda() {
  // Busca todas as comandas ativas
  const responseComandas = await fetch('/api/comandas/active', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!responseComandas.ok) {
    throw new Error('Erro ao buscar comandas ativas.');
  }

  const comandas = await responseComandas.json();
  let comanda = comandas.find((comanda) => comanda.mes_id === mesaId);

  if (!comanda) {
    // Cria uma nova comanda se não existir
    console.log('Criando nova comanda para mesaId:', mesaId);
    const responseNovaComanda = await fetch('/api/comandas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mes_id: mesaId,
        com_data_inicio: new Date().toISOString(), // Adiciona a data de início
        com_status: 1,
      }),
    });

    if (!responseNovaComanda.ok) {
      const errorText = await responseNovaComanda.text();
      console.error('Erro ao criar comanda:', errorText);
      throw new Error('Erro ao criar comanda.');
    }

    comanda = await responseNovaComanda.json();
  }

  console.log('Comanda encontrada/criada:', comanda);
  return comanda.com_id;
}

async function criarPedido(comandaId) {
  console.log('Criando pedido para comandaId:', comandaId);
  const pedidoData = {
    com_id: comandaId,
    ped_descricao: 'Pedido do carrinho', // Alterado de 'descricao' para 'ped_descricao'
    ped_status: 1, // Alterado de 'status' para 'ped_status'
    ped_preco_total: carrinho.reduce(
      (total, item) => total + item.pro_preco * item.quantidade,
      0
    ),
    ped_data: new Date().toISOString(),
  };
  console.log('Dados do pedido:', pedidoData);

  try {
    const responsePedido = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoData),
    });

    if (!responsePedido.ok) {
      const error = await responsePedido.json();
      console.error('Resposta do servidor:', error);
      throw new Error(
        `Erro ao criar pedido: ${error.error || 'Erro desconhecido'}`
      );
    }

    const pedido = await responsePedido.json();
    console.log('Pedido criado:', pedido);

    if (!pedido.ped_id) {
      throw new Error('ID do pedido não retornado pelo servidor');
    }

    return pedido.ped_id;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
}

async function adicionarProdutosAoPedido(pedidoId) {
  try {
    console.log('Iniciando adição de produtos ao pedido:', pedidoId);
    console.log('Carrinho atual:', JSON.stringify(carrinho, null, 2));

    for (const item of carrinho) {
      console.log('----------------------');
      console.log('Processando item:', item.pro_nome);

      // A tabela TBL_PEDIDO_PRODUTO espera apenas esses campos
      const produtoData = {
        ped_id: parseInt(pedidoId),
        pro_id: parseInt(item.pro_id),
        ppr_quantidade: parseInt(item.quantidade), // Alterado para ppr_quantidade conforme tabela
      };

      console.log(
        'Dados do produto a ser enviado:',
        JSON.stringify(produtoData, null, 2)
      );

      const responseProduto = await fetch('/api/pedidos-produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produtoData),
      });

      if (!responseProduto.ok) {
        const errorData = await responseProduto.json();
        console.error('Erro na resposta:', errorData);
        throw new Error(
          `Erro ao adicionar produto: ${JSON.stringify(errorData)}`
        );
      }

      const resultado = await responseProduto.json();
      console.log('Produto adicionado com sucesso:', resultado);
    }

    return true;
  } catch (error) {
    console.error('Erro ao adicionar produtos:', error);
    throw error;
  }
}

async function atualizarPedidoComPrecoTotal(pedidoId) {
  const total = carrinho.reduce(
    (acc, item) => acc + item.pro_preco * item.quantidade,
    0
  );

  const responseAtualizaPedido = await fetch(`/api/pedidos/${pedidoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ped_preco_total: total }),
  });

  if (!responseAtualizaPedido.ok) {
    throw new Error('Erro ao atualizar o pedido.');
  }
}

// Adiciona um event listener para carregar os produtos quando a página for carregada
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  fetchProdutos();
});

// Adiciona event listeners para os itens do menu lateral
document.querySelectorAll('.card-nav').forEach((navItem) => {
  navItem.addEventListener('click', () => {
    const tipo = navItem.getAttribute('data-tipo');
    displayProdutosPorTipo(tipo);
  });
});

// Adiciona um event listener para fechar o modal quando o botão de fechar for clicado
document.querySelector('.close').addEventListener('click', closeModal);

// Adiciona um event listener para fechar o modal quando clicar fora do modal
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
});

// Adiciona um event listener para abrir o carrinho
document
  .getElementById('carrinho-button')
  .addEventListener('click', openCarrinho);

// Adiciona um event listener para enviar os pedidos
document
  .getElementById('enviar-pedidos-button')
  .addEventListener('click', enviarPedidos);

// Função para obter o ID da mesa dinamicamente
function obterMesaId() {
  // Implemente a lógica para obter o ID da mesa dinamicamente
  // Por exemplo, você pode obter o ID da mesa a partir de um elemento HTML ou de uma chamada de API
  return 1; // Exemplo estático, substitua pela lógica real
}
