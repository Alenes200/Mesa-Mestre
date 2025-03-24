import { showModal, openConfirmModal } from './modal.js';
import {
  carregarLocais,
  carregarMesasModal,
  salvar,
  buscar,
  adicionar,
} from './mesas.js';

document.addEventListener('DOMContentLoaded', () => {
  // Mesas
  carregarLocais();
  carregarMesasModal('Externa');

  const botaoSalvar = document.getElementById('salvar-alteracoes');

  botaoSalvar.addEventListener('click', salvar);

  const botaoAdicionar = document.getElementById('adicionar');

  botaoAdicionar.addEventListener('click', adicionar);

  const pesquisar = document.getElementById('pesquisar');

  pesquisar.addEventListener('input', buscar);

  // New content switching functionality
  const menuCardapio = document.querySelector('.opcao:nth-child(1)');
  const menuMesas = document.querySelector('.opcao:nth-child(5)');
  const conteudoCardapio = document.querySelector('.conteudo-cardapio');
  const conteudoMesas = document.querySelector('.conteudo-mesas');

  const botaoLogout = document.querySelector('.sair');

  // Adiciona um evento de clique ao botão de logout
  botaoLogout.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        window.location.href = '../pages/login_adm.html';
      } else {
        const errorData = await response.json();
        console.error('Erro ao fazer logout:', errorData);
        // alert('Erro ao fazer logout. Tente novamente.');
        showModal(
          'Erro ao fazer logout. Tente novamente.' + errorData.error,
          'error'
        );
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      // alert('Erro ao fazer logout. Tente novamente.');
      showModal('Erro ao fazer logout. Tente novamente.', 'error');
    }
  });

  const removeActiveClass = () => {
    document.querySelectorAll('.opcao').forEach((opcao) => {
      opcao.classList.remove('op_ativa');
    });
  };

  const minimizarBtn = document.querySelector('.minimizar');
  const divTop = document.querySelector('.top');
  const esquerda = document.querySelector('.esquerda');
  const botaoExpandir = document.createElement('div');
  botaoExpandir.classList.add('botao-expandir');
  botaoExpandir.innerHTML =
    '<img src="../images/icon-maximizar.svg" alt="expandir opções" />';
  divTop.appendChild(botaoExpandir);

  minimizarBtn.addEventListener('click', () => {
    esquerda.classList.toggle('minimizado');
  });

  botaoExpandir.addEventListener('click', () => {
    esquerda.classList.remove('minimizado');
  });

  menuCardapio.addEventListener('click', () => {
    removeActiveClass();
    document.getElementById('op_cardapio').classList.add('op_ativa');
    conteudoMesas.style.display = 'none';
    conteudoCardapio.style.display = 'flex';
  });

  menuMesas.addEventListener('click', () => {
    removeActiveClass();
    document.getElementById('op_mesa').classList.add('op_ativa');
    conteudoCardapio.style.display = 'none';
    conteudoMesas.style.display = 'block';
  });
});

function limparFormulario() {
  // Limpa os campos de texto
  document.getElementById('nome').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('local').value = '';
  document.getElementById('preco').value = '';
  document.querySelector('.allergen-select').value = '';

  // Limpa o campo de upload de imagem
  const imagemInput = document.getElementById('imagem');
  imagemInput.value = ''; // Limpa o input de arquivo

  // Limpa a pré-visualização da imagem
  const placeholder = document.querySelector('.image-placeholder');
  placeholder.innerHTML = `<span class="placeholder-text">Foto do Produto</span>`;
}

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
      // alert(
      //   'Por favor, preencha todos os campos obrigatórios antes de adicionar o produto.'
      // );
      showModal(
        'Por favor, preencha todos os campos obrigatórios antes de adicionar o produto.',
        'warning'
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
        // alert('Produto adicionado com sucesso!');
        showModal('Produto adicionado com sucesso!', 'success');
        listarProdutos(); // Atualiza a lista de produtos após a adição
        limparFormulario();
      } else {
        const errorData = await response.json();
        console.error('Erro ao adicionar produto:', errorData);
        // alert('Erro ao adicionar produto: ' + errorData.error);
        showModal('Erro ao adicionar produto: ' + errorData.error, 'error');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      // alert('Erro ao adicionar produto. Tente novamente mais tarde.');
      showModal(
        'Erro ao adicionar produto. Tente novamente mais tarde.',
        'error'
      );
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
    // alert('Por favor, selecione um arquivo de imagem válido.');
    showModal('Por favor, selecione um arquivo de imagem válido.', 'warning');
  }
});

document.getElementById('upload-button').addEventListener('click', () => {
  // Dispara o clique no input de arquivo
  document.getElementById('imagem').click();
});

document.getElementById('imagem').addEventListener('change', (event) => {
  const fileInput = event.target;
  const file = fileInput.files[0]; // Obtém o arquivo selecionado
  const placeholder = document.querySelector('.image-placeholder');

  // Verifica se um arquivo foi selecionado
  if (file) {
    // Atualiza o placeholder com o nome do arquivo ou uma pré-visualização
    placeholder.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Pré-visualização da imagem" class="preview-image" />`;
  } else {
    // Restaura o texto padrão se nenhum arquivo for selecionado
    placeholder.innerHTML = `<span class="placeholder-text">Foto do Produto</span>`;
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
      // alert('Erro ao buscar produto.');
      showModal('Erro ao buscar produto.', 'error');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    // alert('Erro ao buscar produto. Tente novamente mais tarde.');
    showModal('Erro ao buscar produto. Tente novamente mais tarde.', 'error');
  }
}

// Função para listar produtos e exibir na tabela
async function listarProdutos() {
  try {
    // Faz a requisição GET para o backend
    const response = await fetch('/api/produtos');
    if (response.ok) {
      const produtos = await response.json(); // Converte a resposta para JSON
      // console.log('Produtos:', produtos);

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
      // alert('Erro ao buscar produtos.');
      showModal('Erro ao buscar produtos.', 'error');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    // alert('Erro ao buscar produtos. Tente novamente mais tarde.');
    showModal('Erro ao buscar produtos. Tente novamente mais tarde.', 'error');
  }
}

// Chama a função para listar os produtos ao carregar a página
document.addEventListener('DOMContentLoaded', listarProdutos);

//  Função para atualizar um produto no backend
document.querySelector('.btn-save').addEventListener('click', async () => {
  const produtoId = document
    .getElementById('btn-adicionar-produto')
    .getAttribute('data-id'); // Obtém o ID do produto

  if (!produtoId) {
    // alert('Nenhum produto selecionado para atualizar.');
    showModal('Nenhum produto selecionado para atualizar.', 'warning');
    return;
  }

  // Captura os valores dos campos do formulário
  const nome = document.getElementById('nome').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const local = document.getElementById('local').value.trim();
  const precoInput = document.getElementById('preco').value.trim();
  const preco = parseFloat(precoInput.replace(',', '.')); // Converte para float
  const imagemInput = document.getElementById('imagem'); // Campo de upload de imagem
  const tipo = document.querySelector('.allergen-select').value.trim();

  if (!nome || !descricao || !local || !preco || !tipo) {
    // alert('Por favor, preencha todos os campos obrigatórios.');
    showModal('Por favor, preencha todos os campos obrigatórios.', 'warning');
    return;
  }

  // Cria um objeto FormData para enviar os dados, incluindo o arquivo de imagem
  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('descricao', descricao);
  formData.append('local', local);
  formData.append('preco', preco);
  formData.append('tipo', tipo);

  if (imagemInput.files.length > 0) {
    formData.append('imagem', imagemInput.files[0]); // Adiciona o arquivo de imagem, se houver
  }

  try {
    // Faz a requisição PUT para o backend
    const response = await fetch(`/api/produtos/${produtoId}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Produto atualizado com sucesso:', data);
      // alert('Produto atualizado com sucesso!');
      showModal('Produto atualizado com sucesso!', 'success');
      listarProdutos(); // Atualiza a lista de produtos
      limparFormulario();
    } else {
      const errorData = await response.json();
      console.error('Erro ao atualizar produto:', errorData);
      // alert('Erro ao atualizar produto: ' + errorData.error);
      showModal('Erro ao atualizar produto: ' + errorData.error, 'error');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    // alert('Erro ao atualizar produto. Tente novamente mais tarde.');
    showModal(
      'Erro ao atualizar produto. Tente novamente mais tarde.',
      'error'
    );
  }
});

document.querySelector('.btn-delete').addEventListener('click', async () => {
  const produtoId = document
    .getElementById('btn-adicionar-produto')
    .getAttribute('data-id'); // Obtém o ID do produto

  if (!produtoId) {
    showModal('Nenhum produto selecionado para deletar.', 'warning');
    return;
  }

  // Abre o modal de confirmação
  openConfirmModal(
    'Tem certeza de que deseja deletar este produto?',
    async () => {
      try {
        // Faz a requisição DELETE para o backend
        const response = await fetch(`/api/produtos/${produtoId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Produto deletado com sucesso:', data);
          showModal('Produto deletado com sucesso!', 'success');
          listarProdutos(); // Atualiza a lista de produtos
          limparFormulario();
        } else {
          const errorData = await response.json();
          console.error('Erro ao deletar produto:', errorData);
          showModal('Erro ao deletar produto: ' + errorData.error, 'error');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        showModal(
          'Erro ao deletar produto. Tente novamente mais tarde.',
          'error'
        );
      }
    }
  );
});
