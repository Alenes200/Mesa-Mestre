import { showModal, openConfirmModal } from './modal.js';
import { listarFuncionarios, buscarFuncionarios } from './funcionario.js';
import { carregarGraficoComandas, destruirGrafico } from './grafico.js';

const token = localStorage.getItem('token');

let userData;
let userId;

document.addEventListener('DOMContentLoaded', async () => {
  if (!token) {
    window.location.href = '../pages/login_adm.html';
    return;
  }
  try {
    const userResponse = await fetch('/api/auth', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!userResponse.ok) {
      throw new Error('Erro ao obter dados do usuário.');
    }
    userData = await userResponse.json();
    userId = userData.id;

    // Configuração do evento de pesquisa
    document.getElementById('search-button-func').addEventListener('click', () => {
      buscarFuncionarios(token, userId);
    });;
  
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    showModal('Erro ao carregar dados do usuário. Tente novamente mais tarde.', 'error');
  }

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
        localStorage.removeItem('token');
        window.location.href = '../pages/login_adm.html';
      } else {
        const errorData = await response.json();
        console.error('Erro ao fazer logout:', errorData);
        showModal('Erro ao fazer logout. Tente novamente.' + errorData.error, 'error');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      showModal('Erro ao fazer logout. Tente novamente.', 'error');
    }
  });

  const removeActiveClass = () => {
    document.querySelectorAll('.opcao').forEach((opcao) => {
      opcao.classList.remove('op_ativa');
    });
  };

  const minimizarBtn = document.querySelector('.minimizar');
  const divTop = document.querySelector('.top')
  const esquerda = document.querySelector('.esquerda');
  const botaoExpandir = document.createElement('div');
  botaoExpandir.classList.add('botao-expandir');
  botaoExpandir.innerHTML = '<img src="../images/icon-maximizar.svg" alt="expandir opções" />';
  divTop.appendChild(botaoExpandir);

  minimizarBtn.addEventListener('click', () => {
    esquerda.classList.toggle('minimizado');
  });

  botaoExpandir.addEventListener('click', () => {
    esquerda.classList.remove('minimizado');
  });

  menuCardapio.addEventListener('click', () => {
    removeActiveClass();
    document.getElementById("op_cardapio").classList.add("op_ativa");

    document.querySelectorAll('.direita > div').forEach(div => {
      if (div !== conteudoCardapio) {
        div.style.display = 'none';
      }
    });
    esconderGraficos();
    conteudoCardapio.style.display = 'flex';
  });

  menuMesas.addEventListener('click', () => {
    removeActiveClass();
    document.getElementById("op_mesa").classList.add("op_ativa")
    
    document.querySelectorAll('.direita > div').forEach(div => {
      if (div !== conteudoMesas) {
        div.style.display = 'none';
      }
    });
    esconderGraficos();
    conteudoMesas.style.display = 'block';
  });

  const menuFuncionarios = document.getElementById('op_funcionario');
  const conteudoFuncionarios = document.querySelector('.conteudo-funcionarios');

  menuFuncionarios.addEventListener('click', () => {
    removeActiveClass();
    document.getElementById("op_funcionario").classList.add("op_ativa")
    
    document.querySelectorAll('.direita > div').forEach(div => {
      if (div !== conteudoFuncionarios) {
        div.style.display = 'none';
      }
    });
    esconderGraficos();
    conteudoFuncionarios.style.display = 'flex'; 

    listarFuncionarios(token, userId);
  });

  const menuGraficos = document.getElementById('op_grafico');
  const conteudoGraficos = document.createElement('div');
  conteudoGraficos.className = 'conteudo-graficos-container';
  document.querySelector('.direita').appendChild(conteudoGraficos);

  menuGraficos.addEventListener('click', async () => {
    removeActiveClass();
    menuGraficos.classList.add('op_ativa');
    
     // Esconder outros conteúdos
    document.querySelectorAll('.direita > div').forEach(div => {
      if (div !== conteudoGraficos) {
        div.style.display = 'none';
      }
    });
    
    // Limpar e mostrar container
    conteudoGraficos.innerHTML = '';
    conteudoGraficos.style.display = 'block';
    
    // Carregar gráficos
    const token = localStorage.getItem('token');
    await carregarGraficoComandas(token);
    // conteudoGraficos.appendChild(graficoElement);
    // conteudoGraficos.style.display = 'block';
  });

  // Abrir/Fechar o formulário de adicionar funcionário
  const btnAdicionarFuncionario = document.getElementById('btn-adicionar-funcionario');
  const funcionarioFormContainer = document.getElementById('funcionario-form-container');
  const btnCancelarFuncionario = document.getElementById('btn-cancelar-funcionario');

  btnAdicionarFuncionario.addEventListener('click', () => {
    funcionarioFormContainer.classList.add('aberto');
  });

  btnCancelarFuncionario.addEventListener('click', () => {
    funcionarioFormContainer.classList.remove('aberto');
  });
});

const btnSalvarFuncionario = document.getElementById('btn-salvar-funcionario');

btnSalvarFuncionario.addEventListener('click', async () => {
  const nome = document.getElementById('nome-funcionario').value.trim();
  const email = document.getElementById('email-funcionario').value.trim();
  const telefone = document.getElementById('telefone-funcionario').value.trim();
  const funcao = document.getElementById('funcao-funcionario').value.trim();
  const senha = document.getElementById('senha-funcionario').value.trim();
  const funcionarioFormContainer = document.getElementById('funcionario-form-container');

  if (!nome || !email || !senha) {
    showModal('Por favor, preencha todos os campos obrigatórios.', 'warning');
    return;
  }

  const novoFuncionario = {
    nome: nome,
    email: email,
    telefone: telefone,
    funcao: funcao,
    senha: senha,
  };

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoFuncionario),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Funcionário adicionado com sucesso:', data);
      showModal('Funcionário adicionado com sucesso!', 'success');
      listarFuncionarios(token, userId) // Atualiza a lista de funcionários
      funcionarioFormContainer.classList.remove('aberto'); // Fecha o formulário
    } else {
      const errorData = await response.json();
      console.error('Erro ao adicionar funcionário:', errorData);
      showModal('Erro ao adicionar funcionário: ' + errorData.error, 'error');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    showModal('Erro ao adicionar funcionário. Tente novamente mais tarde.', 'error');
  }
});

// Abrir modal de edição
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('editar-funcionario')) {
    const funcionarioId = event.target.getAttribute('data-id');
    abrirModalEdicao(funcionarioId);
  }
});

async function abrirModalEdicao(funcionarioId) {
  try {
    const response = await fetch(`/api/users/${funcionarioId}/ignore-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const funcionario = await response.json();

      // Preenche o modal com os dados do funcionário
      document.getElementById('editar-nome-funcionario').value = funcionario.usr_nome;
      document.getElementById('editar-email-funcionario').value = funcionario.usr_email;
      document.getElementById('editar-telefone-funcionario').value = funcionario.usr_telefone || '';
      document.getElementById('editar-funcao-funcionario').value = funcionario.usr_funcao || '';
      document.getElementById('editar-status-funcionario').value = funcionario.usr_status;

      // Exibe o modal
      const modalEdicao = document.getElementById('editar-funcionario-modal');
      modalEdicao.style.display = 'flex';

      // Remove eventos anteriores
      document.getElementById('btn-cancelar-edicao').removeEventListener('click', closeModalEdicao);
      modalEdicao.removeEventListener('click', closeModalEdicaoOutside);
      document.getElementById('btn-salvar-edicao').removeEventListener('click', salvarEdicao);

      // Fechar modal ao clicar no botão de cancelar ou fora do modal
      document.getElementById('btn-cancelar-edicao').addEventListener('click', closeModalEdicao);
      document.getElementById('close-modal-editar').addEventListener('click', closeModalEdicao)
      modalEdicao.addEventListener('click', closeModalEdicaoOutside);

      // Salvar edição
      document.getElementById('btn-salvar-edicao').addEventListener('click', salvarEdicao);

      async function salvarEdicao() {
        const nome = document.getElementById('editar-nome-funcionario').value.trim();
        const email = document.getElementById('editar-email-funcionario').value.trim();
        const telefone = document.getElementById('editar-telefone-funcionario').value.trim();
        const funcao = document.getElementById('editar-funcao-funcionario').value.trim();
        const status = parseInt(document.getElementById('editar-status-funcionario').value);
      
        if (!nome || !email) {
          showModal('Por favor, preencha todos os campos obrigatórios.', 'warning');
          return;
        }
      
        const dadosAtualizados = {
          nome: nome,
          email: email,
          telefone: telefone,
          funcao: funcao,
          status: status,
        };
      
        try {
          const response = await fetch(`/api/users/${funcionarioId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizados),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log('Funcionário atualizado com sucesso:', data);
            showModal('Funcionário atualizado com sucesso!', 'success');
            listarFuncionarios(token, userId) // Atualiza a lista de funcionários
            closeModalEdicao(); // Fecha o modal
          } else {
            const errorData = await response.json();
            console.error('Erro ao atualizar funcionário:', errorData);
            showModal('Erro ao atualizar funcionário: ' + errorData.error, 'error');
          }
        } catch (error) {
          console.error('Erro na requisição:', error);
          showModal('Erro ao atualizar funcionário. Tente novamente mais tarde.', 'error');
        }
      }

      function closeModalEdicao() {
        modalEdicao.style.display = 'none';
      }

      function closeModalEdicaoOutside(event) {
        if (event.target === modalEdicao) {
          closeModalEdicao();
        }
      }
    } else {
      const errorData = await response.json();
      console.error('Erro ao buscar funcionário:', errorData);
      showModal('Erro ao buscar funcionário.', 'error');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    showModal('Erro ao buscar funcionário. Tente novamente mais tarde.', 'error');
  }
}

// Deletar funcionário
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('deletar-funcionario')) {
    const funcionarioId = event.target.getAttribute('data-id');

    openConfirmModal('Tem certeza de que deseja deletar este funcionário?', async () => {
      try {
        const response = await fetch(`/api/users/${funcionarioId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Funcionário deletado com sucesso:', data);
          showModal('Funcionário deletado com sucesso!', 'success');
          listarFuncionarios(token, userId) // Atualiza a lista de funcionários
        } else {
          const errorData = await response.json();
          console.error('Erro ao deletar funcionário:', errorData);
          showModal('Erro ao deletar funcionário: ' + errorData.error, 'error');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        showModal('Erro ao deletar funcionário. Tente novamente mais tarde.', 'error');
      }
    });
  }
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
document.getElementById('btn-adicionar-produto').addEventListener('click', async () => {
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
      showModal('Por favor, preencha todos os campos obrigatórios antes de adicionar o produto.', 'warning');
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
      showModal('Erro ao adicionar produto. Tente novamente mais tarde.', 'error');
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
    showModal('Erro ao atualizar produto. Tente novamente mais tarde.', 'error');
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
  openConfirmModal('Tem certeza de que deseja deletar este produto?', async () => {
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
      showModal('Erro ao deletar produto. Tente novamente mais tarde.', 'error');
    }
  });
});

function esconderGraficos() {
  destruirGrafico();
  document.querySelector('.conteudo-graficos-container').style.display = 'none';
}