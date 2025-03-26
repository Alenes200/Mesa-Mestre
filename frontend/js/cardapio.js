let allProdutos = [];
let carrinho = [];

// Função para buscar os produtos do backend
async function fetchProdutos() {
  try {
    // Faz uma requisição GET para o endpoint /api/produtos
    const response = await fetch('/api/produtos');
    if (!response.ok) {
      throw new Error('Erro ao obter produtos.');
    }
    // Converte a resposta para JSON
    allProdutos = await response.json();
    // Exibe todos os produtos inicialmente
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

  // Obtém os tipos únicos de produtos
  const tipos = [...new Set(produtos.map((produto) => produto.pro_tipo))];

  // Para cada tipo de produto, cria uma seção
  tipos.forEach((tipo) => {
    const tipoSection = document.createElement('section');
    tipoSection.className = 'tipo-section';
    tipoSection.id = tipo.toLowerCase().replace(/\s+/g, '-'); // Adiciona um ID baseado no tipo
    tipoSection.innerHTML = `<h2>${tipo}</h2>`;

    // Filtra os produtos pelo tipo atual
    const tipoProdutos = produtos.filter(
      (produto) => produto.pro_tipo === tipo
    );

    // Para cada produto do tipo atual, cria um elemento de produto
    tipoProdutos.forEach((produto) => {
      const produtoElement = document.createElement('div');
      produtoElement.className = 'card-produto'; // Adiciona a classe de estilo
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
      // Adiciona o elemento de produto à seção do tipo
      tipoSection.appendChild(produtoElement);
    });

    // Adiciona a seção do tipo ao container de produtos
    produtosContainer.appendChild(tipoSection);
  });
}

// Função para exibir produtos de um tipo específico
function displayProdutosPorTipo(tipo) {
  const produtosContainer = document.getElementById('produtos-container');
  produtosContainer.innerHTML = '';

  // Filtra os produtos pelo tipo selecionado
  const tipoProdutos = allProdutos.filter(
    (produto) => produto.pro_tipo === tipo
  );

  // Para cada produto do tipo selecionado, cria um elemento de produto
  tipoProdutos.forEach((produto) => {
    const produtoElement = document.createElement('div');
    produtoElement.className = 'card-produto'; // Adiciona a classe de estilo
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
  console.log('Abrindo modal para o produto:', produto); // Log para depuração
  document.getElementById('modal-nome').innerText = produto.pro_nome;
  document.getElementById('modal-imagem').src =
    `../images/${produto.pro_imagem}`;
  document.getElementById('modal-descricao').innerText = produto.pro_descricao;
  document.getElementById('modal-preco').innerText =
    typeof produto.pro_preco === 'number'
      ? `R$ ${produto.pro_preco.toFixed(2)}`
      : 'Preço indisponível';
  modal.style.display = 'block';

  // Adiciona o evento para o botão "Adicionar ao carrinho"
  document.getElementById('adicionar-carrinho').onclick = () => {
    addToCart(produto);
    closeModal();
  };
}

// Função para fechar o modal do produto
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
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
    // Cria um novo pedido
    const responsePedido = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao: 'Pedido do carrinho', status: 1 }),
    });

    const pedido = await responsePedido.json();
    const pedidoId = pedido.ped_id;

    // Adiciona os produtos ao pedido
    for (const item of carrinho) {
      await fetch('/api/pedido_produto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ped_id: pedidoId,
          pro_id: item.pro_id,
          quantidade: item.quantidade,
        }),
      });
    }

    // Atualiza o pedido com o preço total
    const total = carrinho.reduce(
      (acc, item) => acc + item.pro_preco * item.quantidade,
      0
    );
    await fetch(`/api/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ped_preco_total: total }),
    });

    alert('Pedido enviado com sucesso!');
    carrinho = [];
    closeCarrinho();
  } catch (error) {
    console.error('Erro ao enviar pedidos:', error);
    alert('Erro ao enviar pedidos. Verifique o console para mais detalhes.');
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
    // Obtém o tipo de produto do atributo data-tipo
    const tipo = navItem.getAttribute('data-tipo');
    // Exibe os produtos do tipo selecionado
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
