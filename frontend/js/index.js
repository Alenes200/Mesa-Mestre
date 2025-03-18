document.addEventListener('DOMContentLoaded', () => {
  // Modal functionality remains the same
  const cardMesas = document.querySelectorAll('.card-mesa');
  const modal = document.querySelector('.modal-mesa');
  const closeIcon = document.querySelector('#fechar-modal-mesas');
  const overlay = document.querySelector('.overlay');

  cardMesas.forEach((card) => {
    card.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  });

  const closeModal = () => {
    modal.style.display = 'none';
  };

  closeIcon.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // New content switching functionality
  const menuCardapio = document.querySelector('.opcao:nth-child(1)');
  const menuMesas = document.querySelector('.opcao:nth-child(5)');
  const conteudoCardapio = document.querySelector('.conteudo-cardapio');
  const conteudoMesas = document.querySelector('.conteudo-mesas');

  menuCardapio.addEventListener('click', () => {
    console.log('teste');

    conteudoMesas.style.display = 'none';
    conteudoCardapio.style.display = 'flex';
  });

  menuMesas.addEventListener('click', () => {
    console.log('teste');
    conteudoCardapio.style.display = 'none';
    conteudoMesas.style.display = 'block';
  });
});

// Adicione um evento de clique ao botão "Adicionar Produto" enviando uma requisição POST para o backend
document
  .getElementById('btn-adicionar-produto')
  .addEventListener('click', async () => {
    // Captura os valores dos campos do formulário
    const nome = document.getElementById('nome').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const local = document.getElementById('local').value.trim();
    const precoInput = document.getElementById('preco').value.trim();
    const preco = parseFloat(precoInput.replace(',', '.')); // Substitui vírgula por ponto e converte para float
    const imagemInput = document.getElementById('imagem'); // Campo de upload de imagem
    const tipo = document.querySelector('.allergen-select').value.trim();
    console.log(tipo);

    // Verifica se uma imagem foi selecionada
    if (
      !nome ||
      !descricao ||
      !local ||
      !preco ||
      !imagemInput.files.length ||
      !tipo
    ) {
      alert(
        'Por favor, preencha todos os campos obrigatórios antes de adicionar o produto.'
      );
      return;
    }

    // Cria um objeto FormData para enviar os dados, incluindo o arquivo de imagem
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('local', local);
    formData.append('preco', preco);
    formData.append('tipo', tipo);
    formData.append('imagem', imagemInput.files[0]); // Adiciona o arquivo de imagem

    try {
      // Faz a requisição POST para o backend
      const response = await fetch('/api/produtos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Produto adicionado com sucesso:', data);
        alert('Produto adicionado com sucesso!');
        listarProdutos(); // Atualiza a lista de produtos após a adição
      } else {
        const errorData = await response.json();
        console.error('Erro ao adicionar produto:', errorData);
        alert('Erro ao adicionar produto: ' + errorData.error);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao adicionar produto. Tente novamente mais tarde.');
    }
  });

// Adicione um evento de mudança ao campo de upload de imagem para exibir uma pré-visualização da imagem selecionada
document.getElementById('imagem').addEventListener('change', (event) => {
  const fileInput = event.target;
  const file = fileInput.files[0]; // Obtém o arquivo selecionado
  const placeholder = document.querySelector('.image-placeholder');

  // Verifica se um arquivo foi selecionado e se é uma imagem
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    // Quando o arquivo for carregado, cria uma pré-visualização
    reader.onload = (e) => {
      placeholder.innerHTML = `<img src="${e.target.result}" alt="Pré-visualização da imagem" class="preview-image" />`;
    };

    // Lê o arquivo como uma URL de dados
    reader.readAsDataURL(file);
  } else {
    // Caso não seja uma imagem, exibe o texto padrão
    placeholder.innerHTML = `<span class="placeholder-text">Foto do Produto</span>`;
    alert('Por favor, selecione um arquivo de imagem válido.');
  }
});

// Função para preencher o formulário com os dados do produto selecionado
function preencherFormulario(produto) {
  document.getElementById('nome').value = produto.pro_nome;
  document.getElementById('descricao').value = produto.pro_descricao;
  document.getElementById('local').value = produto.pro_local;
  document.getElementById('preco').value = produto.pro_preco
    .toString()
    .replace('.', ','); // Converte para formato com vírgula
  document.querySelector('.allergen-select').value = produto.pro_tipo;

  // Atualiza a pré-visualização da imagem
  const placeholder = document.querySelector('.image-placeholder');
  placeholder.innerHTML = `<img src="/uploads/${produto.pro_imagem}" alt="Pré-visualização da imagem" class="preview-image" />`;

  // Armazena o ID do produto em um atributo do botão "Salvar" para uso posterior
  document
    .getElementById('btn-adicionar-produto')
    .setAttribute('data-id', produto.pro_id);
}

// Adiciona eventos de clique às linhas da tabela
function adicionarEventosTabela() {
  const linhas = document.querySelectorAll('.menu-table tbody tr');
  linhas.forEach((linha) => {
    linha.addEventListener('click', () => {
      const produtoId = linha.getAttribute('data-id'); // Obtém o ID do produto da linha
      buscarProdutoPorId(produtoId); // Busca os dados do produto no backend
    });
  });
}

// Função para buscar os dados de um produto pelo ID
async function buscarProdutoPorId(id) {
  try {
    const response = await fetch(`/api/produtos/${id}`);
    if (response.ok) {
      const produto = await response.json();
      preencherFormulario(produto); // Preenche o formulário com os dados do produto
    } else {
      console.error('Erro ao buscar produto:', response.statusText);
      alert('Erro ao buscar produto.');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro ao buscar produto. Tente novamente mais tarde.');
  }
}

// Função para listar produtos e exibir na tabela
async function listarProdutos() {
  try {
    // Faz a requisição GET para o backend
    const response = await fetch('/api/produtos');
    if (response.ok) {
      const produtos = await response.json(); // Converte a resposta para JSON
      console.log('Produtos:', produtos);

      // Seleciona o corpo da tabela onde os produtos serão exibidos
      const tabelaProdutos = document.querySelector('.menu-table tbody');
      tabelaProdutos.innerHTML = ''; // Limpa a tabela antes de renderizar

      // Itera sobre os produtos e cria as linhas da tabela
      produtos.forEach((produto) => {
        const linha = document.createElement('tr');
        linha.setAttribute('data-id', produto.pro_id); // Armazena o ID do produto na linha
        linha.innerHTML = `
          <td class="nome-column">${produto.pro_nome}</td>
          <td class="local-column">
            <span class="location-tag">${produto.pro_local}</span>
          </td>
        `;
        tabelaProdutos.appendChild(linha);
      });

      adicionarEventosTabela(); // Adiciona os eventos de clique às novas linhas
    } else {
      console.error('Erro ao buscar produtos:', response.statusText);
      alert('Erro ao buscar produtos.');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro ao buscar produtos. Tente novamente mais tarde.');
  }
}

// Chama a função para listar os produtos ao carregar a página
document.addEventListener('DOMContentLoaded', listarProdutos);
