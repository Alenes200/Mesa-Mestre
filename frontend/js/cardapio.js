async function fetchProdutos() {
  try {
    const response = await fetch('/api/produtos');
    if (!response.ok) {
      throw new Error('Erro ao obter produtos.');
    }
    const produtos = await response.json();
    displayProdutos(produtos);
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    alert('Erro ao obter produtos. Verifique o console para mais detalhes.');
  }
}

function displayProdutos(produtos) {
  const produtosContainer = document.getElementById('produtos-container');
  produtosContainer.innerHTML = '';

  produtos.forEach((produto) => {
    const produtoElement = document.createElement('div');
    produtoElement.className = 'produto';
    produtoElement.innerHTML = `
            <h3>${produto.pro_nome}</h3>
            <p>${produto.pro_descricao}</p>
            <p>Preço: R$ ${produto.pro_preco.toFixed(2)}</p>
        `;
    produtosContainer.appendChild(produtoElement);
  });
}

document.addEventListener('DOMContentLoaded', fetchProdutos);
