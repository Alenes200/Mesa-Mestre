import { showModal, openConfirmModal } from './modal.js';
import { carregarLocais, carregarMesasModal, carregarTodasMesasAtivas, salvar, adicionar, desativar, abrirModal, fecharModal, adicionarLocal, } from './mesas.js';
import { listarFuncionarios, buscarFuncionarios } from './funcionario.js';
import { carregarGraficoComandas } from './grafico.js';

import { escapeHTML } from '../utils/sanitizacao.js';

const token = localStorage.getItem('token');

let userData;
let userId;

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('op_mesa').classList.remove('op_ativa');
  document.getElementById('op_grafico').classList.add('op_ativa');
  document.querySelector('.conteudo-mesas').style.display = 'none';
  const conteudoGraficos = document.querySelector(
    '.conteudo-graficos-container'
  );
  const conteudoMesas = document.querySelector('.conteudo-mesas');
  conteudoGraficos.style.display = 'block';

  carregarLocais();
  carregarMesasModal(carregarTodasMesasAtivas);

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

    if (userData.userType !== 1) {
      window.location.href = '../pages/login_adm.html';
      return;
    }

    userId = userData.id;

    try {
      await carregarGraficoComandas(token);
    } catch (error) {
      console.error('Erro ao carregar gráficos:', error);
      showModal(
        'Erro ao carregar gráficos. Tente novamente mais tarde.',
        'error'
      );
    }

    document
      .getElementById('search-button-func')
      .addEventListener('click', () => {
        buscarFuncionarios(token, userId);
      });
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    localStorage.removeItem('token');
    window.location.href = '../pages/login_adm.html'; 
    return;
  }

  const configuracao = document.getElementById('configuracao');
  configuracao.addEventListener('click', function () {
    abrirModal('Locais');
  });

  document
    .getElementById('fecharModalGenerico')
    .addEventListener('click', fecharModal);
  document
    .getElementById('overlayGenerico')
    .addEventListener('click', fecharModal);
  document
    .getElementById('botaoAdicionarLocal')
    .addEventListener('click', adicionarLocal);

  const botaoSalvar = document.getElementById('salvar-alteracoes');
  botaoSalvar.addEventListener('click', salvar);

  const botaoAdicionar = document.getElementById('adicionar');
  botaoAdicionar.addEventListener('click', adicionar);

  const botaoDesativar = document.getElementById('desativar');
  botaoDesativar.addEventListener('click', desativar);

  // New content switching functionality
  const menuCardapio = document.querySelector('.opcao:nth-child(1)');
  const menuMesas = document.querySelector('.opcao:nth-child(5)');
  const conteudoCardapio = document.querySelector('.conteudo-cardapio');

  const botaoLogout = document.querySelector('.sair');

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
        showModal(
          'Erro ao fazer logout. Tente novamente.' + errorData.error,
          'error'
        );
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

    document.querySelectorAll('.direita > div').forEach((div) => {
      if (div !== conteudoCardapio) {
        div.style.display = 'none';
      }
    });

    conteudoCardapio.style.display = 'flex';
  });

  menuMesas.addEventListener('click', () => {
    removeActiveClass();
    document.getElementById('op_mesa').classList.add('op_ativa');

    document.querySelectorAll('.direita > div').forEach((div) => {
      if (div !== conteudoMesas) {
        div.style.display = 'none';
      }
    });

    conteudoMesas.style.display = 'block';
    carregarMesasModal(carregarTodasMesasAtivas);
  });

  const menuFuncionarios = document.getElementById('op_funcionario');
  const conteudoFuncionarios = document.querySelector('.conteudo-funcionarios');

  menuFuncionarios.addEventListener('click', () => {
    removeActiveClass();
    document.getElementById('op_funcionario').classList.add('op_ativa');

    document.querySelectorAll('.direita > div').forEach((div) => {
      if (div !== conteudoFuncionarios) {
        div.style.display = 'none';
      }
    });

    conteudoFuncionarios.style.display = 'flex';

    listarFuncionarios(token, userId);
  });

  const menuGraficos = document.getElementById('op_grafico');

  menuGraficos.addEventListener('click', async () => {
    removeActiveClass();
    menuGraficos.classList.add('op_ativa');

    document.querySelectorAll('.direita > div').forEach((div) => {
      if (div !== conteudoGraficos) {
        div.style.display = 'none';
      }
    });

    conteudoGraficos.style.display = 'block';
    conteudoGraficos.style.opacity = '0'; 

    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const token = localStorage.getItem('token');
      await carregarGraficoComandas(token);
      conteudoGraficos.style.opacity = '1';
    } catch (error) {
      console.error('Erro ao carregar gráficos:', error);
      conteudoGraficos.innerHTML = `
        <div class="graficos-error">
          <p>Erro ao carregar gráficos. Tente novamente.</p>
          <button id="retry-graficos">Tentar Novamente</button>
        </div>
      `;
      conteudoGraficos.style.opacity = '1';
    }
  });

  const btnAdicionarFuncionario = document.getElementById(
    'btn-adicionar-funcionario'
  );
  const funcionarioFormContainer = document.getElementById(
    'funcionario-form-container'
  );
  const btnCancelarFuncionario = document.getElementById(
    'btn-cancelar-funcionario'
  );

  btnAdicionarFuncionario.addEventListener('click', () => {
    funcionarioFormContainer.classList.add('aberto');
  });

  btnCancelarFuncionario.addEventListener('click', () => {
    funcionarioFormContainer.classList.remove('aberto');
  });
});

const btnSalvarFuncionario = document.getElementById('btn-salvar-funcionario');

aplicarMascaraTelefone('telefone-funcionario');

btnSalvarFuncionario.addEventListener('click', async () => {
  const nome = document.getElementById('nome-funcionario').value.trim();
  const email = document.getElementById('email-funcionario').value.trim();
  const telefone = document.getElementById('telefone-funcionario').value.trim();
  const tipo = document.getElementById('tipo-funcionario').value;
  const senha = document.getElementById('senha-funcionario').value.trim();
  const funcionarioFormContainer = document.getElementById(
    'funcionario-form-container'
  );

  const erros = [];

  if (!nome || nome.length < 3 || nome.length > 255) {
    erros.push('Nome deve ter entre 3 e 255 caracteres, ');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    erros.push('Formato de e-mail inválido,');
  }

  const senhaRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!senhaRegex.test(senha)) {
    erros.push(
      'Senha deve ter pelo menos 8 caracteres, 1 letra maiúscula e 1 número'
    );
  }

  if (erros.length > 0) {
    showModal(erros.join('\n\n'), 'warning');
    return;
  }

  if (!nome || !email || !senha) {
    showModal('Por favor, preencha todos os campos obrigatórios.', 'warning');
    return;
  }

  const novoFuncionario = {
    nome: nome,
    email: email,
    telefone: telefone || null,
    tipo: parseInt(tipo),
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
      showModal('Funcionário adicionado com sucesso!', 'success');
      listarFuncionarios(token, userId);
      funcionarioFormContainer.classList.remove('aberto');
    } else {
      const errorData = await response.json();
      showModal('Erro ao adicionar funcionário: ' + errorData.error, 'error');
    }
  } catch (error) {
    showModal(
      'Erro ao adicionar funcionário. Tente novamente mais tarde.',
      'error'
    );
  }
});

function aplicarMascaraTelefone(inputId = 'editar-telefone-funcionario') {
  const telefoneInput = document.getElementById(inputId);

  telefoneInput.addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');
    let formato = '';

    if (valor.length > 10) {
      formato = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 5) {
      formato = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
      formato = valor.replace(/(\d{0,2})(\d{0,4})/, '($1) $2');
    } else {
      formato = valor.replace(/(\d{0,2})/, '($1');
    }

    formato = formato.replace(/\(\)/g, '').replace(/\(-\)/g, '');

    const posicaoOriginal = e.target.selectionStart;
    const posicaoAtual = Math.max(
      posicaoOriginal + (formato.length - e.target.value.length),
      1
    );

    e.target.value = formato;
    e.target.setSelectionRange(posicaoAtual, posicaoAtual);
  });

  telefoneInput.addEventListener('blur', function (e) {
    const valor = e.target.value.replace(/\D/g, '');
    if (valor.length === 0) {
      e.target.value = '';
      return;
    }

    const valido = valor.length === 10 || valor.length === 11;
    e.target.classList.toggle('input-error', !valido);

    if (!valido) {
      showModal(
        'Telefone inválido! Formato esperado: (00) 0000-0000 ou (00) 00000-0000',
        'warning',
        3000
      );
    }
  });
}

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

      document.getElementById('editar-nome-funcionario').value =
        funcionario.usr_nome;
      document.getElementById('editar-email-funcionario').value =
        funcionario.usr_email;
      document.getElementById('editar-telefone-funcionario').value =
        funcionario.usr_telefone || '';
      document.getElementById('editar-tipo-funcionario').value =
        funcionario.usr_tipo || '';
      document.getElementById('editar-status-funcionario').value =
        funcionario.usr_status;

      const modalEdicao = document.getElementById('editar-funcionario-modal');
      modalEdicao.style.display = 'flex';

      aplicarMascaraTelefone();

      document
        .getElementById('btn-cancelar-edicao')
        .removeEventListener('click', closeModalEdicao);
      modalEdicao.removeEventListener('click', closeModalEdicaoOutside);
      document
        .getElementById('btn-salvar-edicao')
        .removeEventListener('click', salvarEdicao);
      document
        .getElementById('btn-cancelar-edicao')
        .addEventListener('click', closeModalEdicao);
      document
        .getElementById('close-modal-editar')
        .addEventListener('click', closeModalEdicao);
      modalEdicao.addEventListener('click', closeModalEdicaoOutside);
      document
        .getElementById('btn-salvar-edicao')
        .addEventListener('click', salvarEdicao);

      async function salvarEdicao() {
        const nome = document
          .getElementById('editar-nome-funcionario')
          .value.trim();
        const email = document
          .getElementById('editar-email-funcionario')
          .value.trim();
        const telefone = document
          .getElementById('editar-telefone-funcionario')
          .value.trim();
        const tipo = parseInt(
          document.getElementById('editar-tipo-funcionario').value
        );
        const status = parseInt(
          document.getElementById('editar-status-funcionario').value
        );

        const erros = [];

        if (!nome || nome.length < 3 || nome.length > 100) {
          erros.push('Nome deve ter entre 3 e 100 caracteres');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          erros.push('E-mail inválido');
        }

        if (erros.length > 0) {
          showModal(erros.join('\n'), 'warning');
          return;
        }

        if (!nome || !email) {
          showModal(
            'Por favor, preencha todos os campos obrigatórios.',
            'warning'
          );
          return;
        }

        const dadosAtualizados = {
          nome: nome,
          email: email,
          telefone: telefone || null,
          tipo: tipo,
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
            showModal('Funcionário atualizado com sucesso!', 'success');
            listarFuncionarios(token, userId);
            closeModalEdicao();
          } else {
            const errorData = await response.json();
            showModal(
              'Erro ao atualizar funcionário: ' + errorData.error,
              'error'
            );
          }
        } catch (error) {
          showModal(
            'Erro ao atualizar funcionário. Tente novamente mais tarde.',
            'error'
          );
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
    showModal(
      'Erro ao buscar funcionário. Tente novamente mais tarde.',
      'error'
    );
  }
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('deletar-funcionario')) {
    const funcionarioId = event.target.getAttribute('data-id');

    openConfirmModal(
      'Tem certeza de que deseja deletar este funcionário?',
      async () => {
        try {
          const response = await fetch(`/api/users/${funcionarioId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Funcionário deletado com sucesso:', data);
            showModal('Funcionário deletado com sucesso!', 'success');
            listarFuncionarios(token, userId); // Atualiza a lista de funcionários
          } else {
            const errorData = await response.json();
            console.error('Erro ao deletar funcionário:', errorData);
            showModal(
              'Erro ao deletar funcionário: ' + errorData.error,
              'error'
            );
          }
        } catch (error) {
          console.error('Erro na requisição:', error);
          showModal(
            'Erro ao deletar funcionário. Tente novamente mais tarde.',
            'error'
          );
        }
      }
    );
  }
});

function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('descricao-produto').value = '';
  document.getElementById('local').value = '';
  document.getElementById('preco').value = '';
  document.querySelector('.allergen-select').value = '';

  const imagemInput = document.getElementById('imagem');
  imagemInput.value = '';

  const placeholder = document.querySelector('.image-placeholder');
  placeholder.innerHTML = `<span class="placeholder-text">Foto do Produto</span>`;
}

document
  .getElementById('btn-adicionar-produto')
  .addEventListener('click', async () => {
    const nome = document.getElementById('nome').value.trim();
    const descricao = document.getElementById('descricao-produto').value.trim();
    const local = document.getElementById('local').value.trim();
    const precoInput = document.getElementById('preco').value.trim();
    const preco = parseFloat(precoInput.replace(',', '.'));
    const imagemInput = document.getElementById('imagem');
    const tipo = document.querySelector('.allergen-select').value.trim();

    if (!nome) {
      showModal('Nome é obrigatório.', 'warning');
      return;
    }
    if (!descricao) {
      showModal('Descrição é obrigatória.', 'warning');
      return;
    }
    if (!local) {
      showModal('Local é obrigatório.', 'warning');
      return;
    }
    if (!precoInput || isNaN(preco) || preco <= 0) {
      showModal('Preço deve ser um número positivo.', 'warning');
      return;
    }
    if (!tipo) {
      showModal('Tipo é obrigatório.', 'warning');
      return;
    }
    if (!imagemInput.files.length) {
      showModal('Imagem é obrigatória.', 'warning');
      return;
    }

    if (nome.length > 255) {
      showModal('Nome não pode exceder 255 caracteres.', 'warning');
      return;
    }

    const precoRegex = /^\d+(\.\d{1,2})?$/;
    if (!precoRegex.test(preco.toString())) {
      showModal('Preço deve ter até duas casas decimais.', 'warning');
      return;
    }

    const arquivo = imagemInput.files[0];
    const mimeTypesPermitidos = ['image/jpeg', 'image/png', 'image/gif'];
    if (!mimeTypesPermitidos.includes(arquivo.type)) {
      showModal('Tipo de imagem inválido. Use JPEG, PNG ou GIF.', 'warning');
      return;
    }
    const tamanhoMaximo = 2 * 1024 * 1024; // 2MB
    if (arquivo.size > tamanhoMaximo) {
      showModal('Imagem excede o tamanho máximo permitido (2MB).', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('local', local);
    formData.append('preco', preco);
    formData.append('tipo', tipo);
    formData.append('imagem', imagemInput.files[0]);

    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        showModal('Produto adicionado com sucesso!', 'success');
        listarProdutos();
        limparFormulario();
      } else {
        const errorData = await response.json();
        showModal('Erro ao adicionar produto: ' + errorData.error, 'error');
      }
    } catch (error) {
      showModal(
        'Erro ao adicionar produto. Tente novamente mais tarde.',
        'error'
      );
    }
  });

document.getElementById('imagem').addEventListener('change', (event) => {
  const fileInput = event.target;
  const file = fileInput.files[0];
  const placeholder = document.querySelector('.image-placeholder');

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = (e) => {
      placeholder.innerHTML = `<img src="${e.target.result}" alt="Pré-visualização da imagem" class="preview-image" />`;
    };

    reader.readAsDataURL(file);
  } else {
    placeholder.innerHTML = `<span class="placeholder-text">Foto do Produto</span>`;
    showModal('Por favor, selecione um arquivo de imagem válido.', 'warning');
  }
});

document.getElementById('upload-button').addEventListener('click', () => {
  document.getElementById('imagem').click();
});

document.getElementById('imagem').addEventListener('change', (event) => {
  const fileInput = event.target;
  const file = fileInput.files[0];
  const placeholder = document.querySelector('.image-placeholder');

  if (file) {
    placeholder.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Pré-visualização da imagem" class="preview-image" />`;
  } else {
    placeholder.innerHTML = `<span class="placeholder-text">Foto do Produto</span>`;
  }
});

function preencherFormulario(produto) {
  document.getElementById('nome').value = produto.pro_nome;
  document.getElementById('descricao-produto').value = produto.pro_descricao;
  document.getElementById('local').value = produto.pro_local;
  document.getElementById('preco').value = produto.pro_preco
    .toString()
    .replace('.', ',');
  document.querySelector('.allergen-select').value = produto.pro_tipo;

  const placeholder = document.querySelector('.image-placeholder');
  placeholder.innerHTML = `<img src="/uploads/${escapeHTML(produto.pro_imagem)}" alt="Pré-visualização da imagem" class="preview-image" />`;

  document
    .getElementById('btn-adicionar-produto')
    .setAttribute('data-id', produto.pro_id);
}

function adicionarEventosTabela() {
  const linhas = document.querySelectorAll('.menu-table tbody tr');
  linhas.forEach((linha) => {
    linha.addEventListener('click', () => {
      const produtoId = linha.getAttribute('data-id');
      buscarProdutoPorId(produtoId);
    });
  });
}

async function buscarProdutoPorId(id) {
  try {
    const response = await fetch(`/api/produtos/${id}`);
    if (response.ok) {
      const produto = await response.json();
      preencherFormulario(produto);
    } else {
      showModal('Erro ao buscar produto.', 'error');
    }
  } catch (error) {
    showModal('Erro ao buscar produto. Tente novamente mais tarde.', 'error');
  }
}

async function listarProdutos() {
  try {
    const response = await fetch('/api/produtos');
    if (response.ok) {
      const produtos = await response.json();
      const tabelaProdutos = document.querySelector('.menu-table tbody');
      tabelaProdutos.innerHTML = '';

      produtos.forEach((produto) => {
        const linha = document.createElement('tr');
        linha.setAttribute('data-id', escapeHTML(produto.pro_id));
        linha.innerHTML = `
          <td class="nome-column">${escapeHTML(produto.pro_nome)}</td>
          <td class="local-column">
            <span class="location-tag">${escapeHTML(produto.pro_local)}</span>
          </td>
        `;
        tabelaProdutos.appendChild(linha);
      });

      adicionarEventosTabela();
    } else {
      showModal('Erro ao buscar produtos.', 'error');
    }
  } catch (error) {
    showModal('Erro ao buscar produtos. Tente novamente mais tarde.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', listarProdutos);

document.querySelector('.btn-save').addEventListener('click', async () => {
  const produtoId = document
    .getElementById('btn-adicionar-produto')
    .getAttribute('data-id');

  if (!produtoId) {
    showModal('Nenhum produto selecionado para atualizar.', 'warning');
    return;
  }

  const nome = document.getElementById('nome').value.trim();
  const descricao = document.getElementById('descricao-produto').value.trim();
  const local = document.getElementById('local').value.trim();
  const precoInput = document.getElementById('preco').value.trim();
  const preco = parseFloat(precoInput.replace(',', '.'));
  const imagemInput = document.getElementById('imagem');
  const tipo = document.querySelector('.allergen-select').value.trim();

  if (!nome || !descricao || !local || !preco || !tipo) {
    showModal('Por favor, preencha todos os campos obrigatórios.', 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('descricao', descricao);
  formData.append('local', local);
  formData.append('preco', preco);
  formData.append('tipo', tipo);

  if (imagemInput.files.length > 0) {
    formData.append('imagem', imagemInput.files[0]);
  }

  try {
    const response = await fetch(`/api/produtos/${produtoId}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      showModal('Produto atualizado com sucesso!', 'success');
      listarProdutos();
      limparFormulario();
    } else {
      const errorData = await response.json();
      showModal('Erro ao atualizar produto: ' + errorData.error, 'error');
    }
  } catch (error) {
    showModal(
      'Erro ao atualizar produto. Tente novamente mais tarde.',
      'error'
    );
  }
});

document.querySelector('.btn-delete').addEventListener('click', async () => {
  const produtoId = document
    .getElementById('btn-adicionar-produto')
    .getAttribute('data-id');

  if (!produtoId) {
    showModal('Nenhum produto selecionado para deletar.', 'warning');
    return;
  }

  openConfirmModal(
    'Tem certeza de que deseja deletar este produto?',
    async () => {
      try {
        const response = await fetch(`/api/produtos/${produtoId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const data = await response.json();
          showModal('Produto deletado com sucesso!', 'success');
          listarProdutos();
          limparFormulario();
        } else {
          const errorData = await response.json();
          showModal('Erro ao deletar produto: ' + errorData.error, 'error');
        }
      } catch (error) {
        showModal(
          'Erro ao deletar produto. Tente novamente mais tarde.',
          'error'
        );
      }
    }
  );
});