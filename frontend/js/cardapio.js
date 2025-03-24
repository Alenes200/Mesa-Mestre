let allProdutos = [];

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

  const tipoProdutos = allProdutos.filter(
    (produto) => produto.pro_tipo === tipo
  );

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

// Função para abrir o modal
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

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// Função para adicionar o item ao carrinho
function addToCart(produto) {
  const quantidade = document.getElementById('quantidade').value;
  console.log(
    `Adicionado ao carrinho: ${produto.pro_nome}, Quantidade: ${quantidade}`
  );
  // Aqui você pode adicionar a lógica para adicionar o item ao carrinho
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
