import { showModal, openConfirmModal } from './modal.js';
import {
  carregarLocais,
  carregarMesasModal,
  carregarMesas,
  carregarTodasMesasAtivas,
  salvar,
  // buscar,
  adicionar,
  desativar,
  abrirModal,
  fecharModal,
  adicionarLocal,
} from './mesas.js';
import { listarFuncionarios, buscarFuncionarios } from './funcionario.js';
import { carregarGraficoComandas, destruirGrafico } from './grafico.js';

import { escapeHTML } from '../utils/sanitizacao.js';

const token = localStorage.getItem('token');

let userData;
let userId;

document.addEventListener('DOMContentLoaded', async () => {
  // Remover a classe ativa das mesas e adicionar aos gráficos
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

    // Esta verificação impede que usuários não administradores acessem a página
    if (userData.userType !== 1) {
      window.location.href = '../pages/login_adm.html';
      return;
    }

    userId = userData.id;

    // Carregar gráficos automaticamente
    try {
      await carregarGraficoComandas(token);
    } catch (error) {
      showModal(
        'Erro ao carregar gráficos. Tente novamente mais tarde.',
        'error'
      );
    }

    // Configuração do evento de pesquisa
    document
      .getElementById('search-button-func')
      .addEventListener('click', () => {
        buscarFuncionarios(token, userId);
      });
  } catch (error) {
    localStorage.removeItem('token'); // Remove o token inválido
    window.location.href = '../pages/login_adm.html'; // Redireciona para login
    return;
  }

  const configuracao = document.getElementById('configuracao');
  configuracao.addEventListener('click', function () {
    abrirModal('Locais');
  });

  // Eventos de fechamento
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

  // const pesquisar = document.getElementById('pesquisar');

  // pesquisar.addEventListener('input', buscar);

  // New content switching functionality
  const menuCardapio = document.querySelector('.opcao:nth-child(1)');
  const menuMesas = document.querySelector('.opcao:nth-child(5)');
  const conteudoCardapio = document.querySelector('.conteudo-cardapio');

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
        showModal(
          'Erro ao fazer logout. Tente novamente.' + errorData.error,
          'error'
        );
      }
    } catch (error) {
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

    // Esconder outros conteúdos
    document.querySelectorAll('.direita > div').forEach((div) => {
      if (div !== conteudoGraficos) {
        div.style.display = 'none';
      }
    });

    // Mostrar container antes de carregar
    conteudoGraficos.style.display = 'block';
    conteudoGraficos.style.opacity = '0'; // Usar opacity em vez de visibility

    // Pequeno delay para o browser processar
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const token = localStorage.getItem('token');
      await carregarGraficoComandas(token);
      conteudoGraficos.style.opacity = '1'; // Mostrar gradualmente
    } catch (error) {
      conteudoGraficos.innerHTML = `
        <div class="graficos-error">
          <p>Erro ao carregar gráficos. Tente novamente.</p>
          <button id="retry-graficos">Tentar Novamente</button>
        </div>
      `;
      conteudoGraficos.style.opacity = '1';
    }
  });

  // Abrir/Fechar o formulário de adicionar funcionário
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
  // Sanitização dos dados
  const nome = sanitizarTexto(
    document.getElementById('nome-funcionario').value.trim()
  );
  const email = sanitizarTexto(
    document.getElementById('email-funcionario').value.trim().toLowerCase()
  );
  const telefone = document
    .getElementById('telefone-funcionario')
    .value.replace(/\D/g, '');

  const funcao = sanitizarTexto(
    document.getElementById('funcao-funcionario').value
  );
  const senha = document.getElementById('senha-funcionario').value.trim();

  // Validações
  const erros = [];

  // Validação do nome (3-100 caracteres)
  if (!nome || nome.length < 3 || nome.length > 100) {
    erros.push('Nome deve ter entre 3 e 100 caracteres, ');
  }

  // Validação de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    erros.push('Formato de e-mail inválido,');
  }

  // Validação de telefone (opcional, mas se preenchido 10 ou 11 dígitos)
  if (telefone && (telefone.length < 10 || telefone.length > 11)) {
    erros.push('Telefone deve ter 10 ou 11 dígitos (com DDD),');
  }

  // Validação de função (opcional, até 50 caracteres)
  if (funcao && funcao.length > 50) {
    erros.push('Função deve ter no máximo 50 caracteres,');
  }

  // Validação de senha (mínimo 8 caracteres, 1 letra maiúscula, 1 número)
  const senhaRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!senhaRegex.test(senha)) {
    erros.push(
      'Senha deve ter pelo menos 8 caracteres, 1 letra maiúscula e 1 número'
    );
  }

  // Exibir erros se houver
  if (erros.length > 0) {
    showModal(erros.join('\n\n'), 'warning');
    return;
  }

  // Montar objeto com dados sanitizados
  const novoFuncionario = {
    nome: nome,
    email: email,
    telefone: telefone || null, // Enviar null se vazio
    funcao: funcao,
    senha: senha,
  };

  const funcionarioFormContainer = document.getElementById(
    'funcionario-form-container'
  );

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
      listarFuncionarios(token, userId); // Atualiza a lista de funcionários
      funcionarioFormContainer.classList.remove('aberto'); // Fecha o formulário
    } else {
      const errorData = await response.json();
      showModal(
        'Erro ao adicionar funcionário: ' +
          (errorData.message || 'Erro desconhecido'),
        'error'
      );
    }
  } catch (error) {
    showModal(
      'Erro ao adicionar funcionário. Tente novamente mais tarde.',
      'error'
    );
  }
});

// Função de máscara para telefone
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

    // Remove parênteses vazios
    formato = formato.replace(/\(\)/g, '').replace(/\(-\)/g, '');

    // Mantém o cursor na posição correta
    const posicaoOriginal = e.target.selectionStart;
    const posicaoAtual = Math.max(
      posicaoOriginal + (formato.length - e.target.value.length),
      1
    );

    e.target.value = formato;
    e.target.setSelectionRange(posicaoAtual, posicaoAtual);
  });

  // Validação melhorada
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

function sanitizarTexto(texto) {
  return texto.replace(/<[^>]*>?/gm, ''); // Remove tags HTML
}

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
      document.getElementById('editar-nome-funcionario').value =
        funcionario.usr_nome;
      document.getElementById('editar-email-funcionario').value =
        funcionario.usr_email;
      document.getElementById('editar-telefone-funcionario').value =
        funcionario.usr_telefone || '';
      document.getElementById('editar-funcao-funcionario').value =
        funcionario.usr_tipo || '';
      document.getElementById('editar-status-funcionario').value =
        funcionario.usr_status;

      // Exibe o modal
      const modalEdicao = document.getElementById('editar-funcionario-modal');
      modalEdicao.style.display = 'flex';

      // Aplicar máscara ao campo de telefone
      aplicarMascaraTelefone();

      // Aplicar máscara ao campo de telefone
      const telefone = funcionario.usr_telefone || '';
      document.getElementById('editar-telefone-funcionario').value =
        telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');

      // Remove eventos anteriores
      document
        .getElementById('btn-cancelar-edicao')
        .removeEventListener('click', closeModalEdicao);
      modalEdicao.removeEventListener('click', closeModalEdicaoOutside);
      document
        .getElementById('btn-salvar-edicao')
        .removeEventListener('click', salvarEdicao);

      // Fechar modal ao clicar no botão de cancelar ou fora do modal
      document
        .getElementById('btn-cancelar-edicao')
        .addEventListener('click', closeModalEdicao);
      document
        .getElementById('close-modal-editar')
        .addEventListener('click', closeModalEdicao);
      modalEdicao.addEventListener('click', closeModalEdicaoOutside);

      // Salvar edição
      document
        .getElementById('btn-salvar-edicao')
        .addEventListener('click', salvarEdicao);

      async function salvarEdicao() {
        // Sanitização dos campos
        const nome = sanitizarTexto(
          document.getElementById('editar-nome-funcionario').value.trim()
        );
        const email = sanitizarTexto(
          document
            .getElementById('editar-email-funcionario')
            .value.trim()
            .toLowerCase()
        );
        const telefone = document
          .getElementById('editar-telefone-funcionario')
          .value.replace(/\D/g, '');
        const funcao = sanitizarTexto(
          document.getElementById('editar-funcao-funcionario').value
        );
        const status = parseInt(
          document.getElementById('editar-status-funcionario').value
        );

        // Validações
        const erros = [];

        // Validação do nome
        if (!nome || nome.length < 3 || nome.length > 100) {
          erros.push('Nome deve ter entre 3 e 100 caracteres');
        }

        // Validação do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          erros.push('E-mail inválido');
        }

        // Validação do telefone (se preenchido)
        if (telefone.length > 0) {
          if (telefone.length < 10 || telefone.length > 11) {
            erros.push('Telefone inválido');
          }
        }

        // Validação da função
        if (funcao && funcao.length > 50) {
          erros.push('Função deve ter no máximo 50 caracteres');
        }

        // Validação do status
        if (isNaN(status) || ![0, 1].includes(status)) {
          erros.push('Status inválido');
        }

        if (erros.length > 0) {
          showModal(erros.join('\n'), 'warning');
          return;
        }

        const dadosAtualizados = {
          nome: nome,
          email: email,
          telefone: telefone || null, // Enviar null se vazio
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
            showModal('Funcionário atualizado com sucesso!', 'success');
            listarFuncionarios(token, userId); // Atualiza a lista de funcionários
            closeModalEdicao(); // Fecha o modal
          } else {
            const errorData = await response.json();
            showModal(
              'Erro ao atualizar funcionário: ' + errorData.message,
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
      showModal('Erro ao buscar funcionário.', 'error');
    }
  } catch (error) {
    showModal(
      'Erro ao buscar funcionário. Tente novamente mais tarde.',
      'error'
    );
  }
}

// Deletar funcionário
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
            showModal('Funcionário deletado com sucesso!', 'success');
            listarFuncionarios(token, userId); // Atualiza a lista de funcionários
          } else {
            const errorData = await response.json();
            showModal(
              'Erro ao deletar funcionário: ' + errorData.error,
              'error'
            );
          }
        } catch (error) {
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
    // Substitui vírgula por ponto e converte para float
    const preco = parseFloat(precoInput.replace(',', '.'));
    const imagemInput = document.getElementById('imagem'); // Campo de upload de imagem
    const tipo = document.querySelector('.allergen-select').value.trim();

    // Valida se os campos obrigatórios estão preenchidos
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

    // Validação de limite de caracteres
    if (nome.length > 255) {
      showModal('Nome não pode exceder 255 caracteres.', 'warning');
      return;
    }
    // Aqui você pode adicionar validações similares para descrição e local, caso necessário

    // Validação do formato do preço (até duas casas decimais)
    const precoRegex = /^\d+(\.\d{1,2})?$/;
    if (!precoRegex.test(preco.toString())) {
      showModal('Preço deve ter até duas casas decimais.', 'warning');
      return;
    }

    // Validação de arquivo de imagem: tipo e tamanho
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

    // Cria um objeto FormData para enviar os dados, incluindo o arquivo de imagem
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('local', local);
    formData.append('preco', preco);
    formData.append('tipo', tipo);
    formData.append('imagem', arquivo); // Adiciona o arquivo de imagem

    try {
      // Faz a requisição POST para o backend
      const response = await fetch('/api/produtos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        showModal('Produto adicionado com sucesso!', 'success');
        listarProdutos(); // Atualiza a lista de produtos após a adição
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
  placeholder.innerHTML = `<img src="/uploads/${escapeHTML(produto.pro_imagem)}" alt="Pré-visualização da imagem" class="preview-image" />`;

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
      showModal('Erro ao buscar produto.', 'error');
    }
  } catch (error) {
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

      // Seleciona o corpo da tabela onde os produtos serão exibidos
      const tabelaProdutos = document.querySelector('.menu-table tbody');
      tabelaProdutos.innerHTML = ''; // Limpa a tabela antes de renderizar

      // Itera sobre os produtos e cria as linhas da tabela
      produtos.forEach((produto) => {
        const linha = document.createElement('tr');
        linha.setAttribute('data-id', escapeHTML(produto.pro_id)); // Armazena o ID do produto na linha
        linha.innerHTML = `
          <td class="nome-column">${escapeHTML(produto.pro_nome)}</td>
          <td class="local-column">
            <span class="location-tag">${escapeHTML(produto.pro_local)}</span>
          </td>
        `;
        tabelaProdutos.appendChild(linha);
      });

      adicionarEventosTabela(); // Adiciona os eventos de clique às novas linhas
    } else {
      showModal('Erro ao buscar produtos.', 'error');
    }
  } catch (error) {
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
      showModal('Produto atualizado com sucesso!', 'success');
      listarProdutos(); // Atualiza a lista de produtos
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
          showModal('Produto deletado com sucesso!', 'success');
          listarProdutos(); // Atualiza a lista de produtos
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

function esconderGraficos() {
  // Adicione um pequeno delay para garantir que a transição de tela foi concluída
  setTimeout(() => {
    destruirGrafico();
    const container = document.querySelector('.conteudo-graficos-container');
    if (container) {
      container.style.display = 'none';
      // Limpar o conteúdo para evitar acúmulo de elementos
      container.innerHTML = '';
    }
  }, 100);
}
