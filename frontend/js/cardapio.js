let allProdutos = [];
let carrinho = [];
let pedidos = [];
let mesaId; // Defina o ID da mesa dinamicamente
let comandaAtivaId = null;

import { escapeHTML } from '../utils/sanitizacao.js';
import { showModal } from './modal.js';

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
    showModal('Erro ao obter produtos.', 'error');
  }
}

// Função para exibir os produtos na página
function displayProdutos(produtos) {
  const produtosContainer = document.getElementById('produtos-container');
  produtosContainer.innerHTML = ''; // Limpa o container antes de adicionar os produtos

  produtos.forEach((produto) => {
    const produtoElement = document.createElement('div');
    produtoElement.className = 'card-produto';

    const preco = `R$ ${produto.pro_preco}`;

    const imagemSrc = (document.getElementById('modal-imagem').src =
      `/uploads/${produto.pro_imagem}`);

    produtoElement.innerHTML = `
    <div class="descricao">
      <h2>${escapeHTML(produto.pro_nome)} <span>${preco}</span></h2>
      <p>${escapeHTML(produto.pro_descricao)}</p>
      <button class="adicionar-carrinho">ADICIONAR AO CARRINHO</button>
    </div>
    <div class="imagem-produto">
      <img src="${escapeHTML(imagemSrc)}" alt="Imagem de ${escapeHTML(produto.pro_nome)}" />
    </div>
  `;

    // Adiciona evento para abrir o modal ao clicar no botão "Adicionar ao carrinho"
    produtoElement
      .querySelector('.adicionar-carrinho')
      .addEventListener('click', () => openModal(produto));

    produtosContainer.appendChild(produtoElement);
  });
}
// Função para exibir produtos de um tipo específico
function displayProdutosPorTipo(tipo) {
  const produtosContainer = document.getElementById('produtos-container');
  produtosContainer.innerHTML = '';

  const produtos = allProdutos.filter((produto) => produto.pro_tipo === tipo);

  produtos.forEach((produto) => {
    const produtoElement = document.createElement('div');
    produtoElement.className = 'card-produto';

    const preco = `R$ ${produto.pro_preco}`;

    const imagemSrc = (document.getElementById('modal-imagem').src =
      `/uploads/${produto.pro_imagem}`);

    produtoElement.innerHTML = `
      <div class="descricao">
        <h2>${escapeHTML(produto.pro_nome)} <span>${preco}</span></h2>
        <p>${escapeHTML(produto.pro_descricao)}</p>
        <button class="adicionar-carrinho">ADICIONAR AO CARRINHO</button>
      </div>
      <div class="imagem-produto">
        <img src="${imagemSrc}" alt="Imagem de ${produto.pro_nome}" />
      </div>
    `;

    // Adiciona evento para abrir o modal ao clicar no botão "Adicionar ao carrinho"
    produtoElement
      .querySelector('.adicionar-carrinho')
      .addEventListener('click', () => openModal(produto));

    produtosContainer.appendChild(produtoElement);
  });
}

// Função para abrir o modal do produto
function openModal(produto) {
  const modal = document.getElementById('modal');
  const quantidadeSpan = document.getElementById('quantidade');
  const precoElement = document.getElementById('modal-preco');
  const numeroElement = document.querySelector('.numero span');

  document.getElementById('modal-nome').innerText = produto.pro_nome;
  document.getElementById('modal-imagem').src =
    `/uploads/${produto.pro_imagem}`;
  document.getElementById('modal-descricao').innerText = produto.pro_descricao;
  precoElement.innerText = `R$ ${produto.pro_preco}`;
  quantidadeSpan.innerText = '1';
  numeroElement.innerText = '1'; // Inicializa a quantidade no elemento com class="numero"

  modal.classList.add('modal-produto-ativo');

  // Event listeners para os botões de aumentar e diminuir
  document.getElementById('mais-produto').onclick = () => {
    let quantidade = parseInt(quantidadeSpan.innerText, 10);
    quantidade += 1;
    quantidadeSpan.innerText = quantidade;
    numeroElement.innerText = quantidade; // Atualiza o valor no elemento com class="numero"
    precoElement.innerText = `R$ ${(produto.pro_preco * quantidade).toFixed(2)}`; // Atualiza o subtotal
  };

  document.getElementById('menos-produto').onclick = () => {
    let quantidade = parseInt(quantidadeSpan.innerText, 10);
    if (quantidade > 1) {
      quantidade -= 1;
      quantidadeSpan.innerText = quantidade;
      numeroElement.innerText = quantidade; // Atualiza o valor no elemento com class="numero"
      precoElement.innerText = `R$ ${(produto.pro_preco * quantidade).toFixed(2)}`; // Atualiza o subtotal
    }
  };

  // Atualiza o botão de adicionar ao carrinho
  document.getElementById('adicionar-carrinho').onclick = () => {
    const quantidade = parseInt(quantidadeSpan.innerText, 10);
    addToCart(produto, quantidade);
    closeModal();
  };
}

// Função para fechar o modal do produto
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('modal-produto-ativo');
  document.getElementById('quantidade').value = 1; // Redefine a quantidade para 1
}

// Função para adicionar o item ao carrinho
function addToCart(produto, quantidade) {
  const itemCarrinho = carrinho.find((item) => item.pro_id === produto.pro_id);

  if (itemCarrinho) {
    itemCarrinho.quantidade += quantidade;
  } else {
    carrinho.push({ ...produto, quantidade });
  }
  closeModal();
}

// Função para abrir o modal do carrinho
function openCarrinho() {
  const carrinhoOffcanvas = document.getElementById('carrinho-offcanvas');
  const carrinhoContainer = document.querySelector('.scroll-produtos');
  carrinhoContainer.innerHTML = ''; // Limpa o container antes de adicionar os itens

  let total = 0;

  carrinho.forEach((item, index) => {
    const subtotal = item.pro_preco * item.quantidade;
    total += subtotal;

    const itemElement = document.createElement('div');
    itemElement.className = 'card-produto';
    itemElement.innerHTML = `
      <img
        src="../images/icon-fechar-cinza.svg"
        alt="Remover produto"
        class="tirar-produto"
        data-index="${escapeHTML(index)}"
      />
      <div class="produto">
        <div class="E-descricao">
          <img
            src="/uploads/${escapeHTML(item.pro_imagem)}"
            alt="${escapeHTML(item.pro_nome)}"
            class="imagem-produto"
          />
          <div class="text-produto">
            <h2>${escapeHTML(item.pro_nome)}</h2>
            <p>${escapeHTML(item.pro_descricao)}</p>
          </div>
        </div>
        <div class="D-descricao">
          <div class="quantidade">
            <button class="btn-quantidade menos" data-index="${escapeHTML(index)}">
              <img src="../images/icon-menos.svg" alt="Diminuir quantidade" />
            </button>
            <span>${escapeHTML(item.quantidade)}</span>
            <button class="btn-quantidade mais" data-index="${escapeHTML(index)}">
              <img src="../images/icon-mais.svg" alt="Aumentar quantidade" />
            </button>
          </div>
          <div class="total-produto">
            <span>R$ ${escapeHTML(subtotal.toFixed(2))}</span>
          </div>
        </div>
      </div>
    `;

    carrinhoContainer.appendChild(itemElement);
  });

  // Atualiza o subtotal no rodapé do carrinho
  const totalElement = document.querySelector('.total-pedido span');
  totalElement.innerText = `R$ ${escapeHTML(total.toFixed(2))}`;

  // Exibe o modal do carrinho
  carrinhoOffcanvas.classList.add('aberto');

  // Adiciona eventos para os botões de quantidade e remover
  document.querySelectorAll('.btn-quantidade.menos').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.closest('button').dataset.index;
      alterarQuantidade(index, -1);
    });
  });

  document.querySelectorAll('.btn-quantidade.mais').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.closest('button').dataset.index;
      alterarQuantidade(index, 1);
    });
  });

  document.querySelectorAll('.tirar-produto').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      removerProduto(index);
    });
  });
}

// Função para alterar a quantidade de um item no carrinho
function alterarQuantidade(index, delta) {
  const item = carrinho[index];
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade <= 0) {
    carrinho.splice(index, 1); // Remove o item se a quantidade for 0
  }

  openCarrinho(); // Recarrega o carrinho
}

// Função para remover um item do carrinho
function removerProduto(index) {
  carrinho.splice(index, 1); // Remove o item do carrinho
  openCarrinho(); // Recarrega o carrinho
}

// Função para fechar o modal do carrinho
function closeCarrinho() {
  const carrinhoOffcanvas = document.getElementById('carrinho-offcanvas');
  carrinhoOffcanvas.classList.remove('aberto');
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <div class="message">${message}</div>
    </div>
  `;
  document.body.appendChild(toast);

  // Força um reflow para garantir que a transição funcione
  toast.offsetHeight;

  // Adiciona a classe active para mostrar o toast
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  // Remove o toast após 3 segundos
  setTimeout(() => {
    toast.style.transform = 'translateX(calc(100% + 30px))';
    toast.style.opacity = '0';

    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}

// Função para enviar os pedidos
async function enviarPedidos() {
  try {
    if (carrinho.length === 0) {
      showToast('O carrinho está vazio!', 'error');
      return;
    }

    mesaId = obterMesaId();

    // Usa a comanda ativa existente ou cria uma nova
    comandaAtivaId = comandaAtivaId || (await verificarOuCriarComanda());

    const pedidoId = await criarPedido(comandaAtivaId);

    await adicionarProdutosAoPedido(pedidoId);
    await atualizarPedidoComPrecoTotal(pedidoId);

    showToast('Pedido enviado com sucesso!');

    // Antes de limpar o carrinho, armazena os itens no array "pedidos"
    pedidos = [...pedidos, ...carrinho];
    exibirPedidosNoModal(); // Exibe os pedidos no modal
    carrinho = []; // Limpa o carrinho
    closeCarrinho(); // Fecha o modal do carrinho
  } catch (error) {
    showToast(`Erro ao enviar pedidos: ${error.message}`, 'error');
  }
}

async function verificarOuCriarComanda() {
  try {
    const responseComandas = await fetch('/api/comandas/active');
    if (!responseComandas.ok) {
      throw new Error('Erro ao buscar comandas ativas.');
    }

    const comandas = await responseComandas.json();

    // Filtra comandas da mesa atual e ordena por data de início (mais recente primeiro)
    const comandasAtivas = comandas
      .filter(
        (comanda) =>
          parseInt(comanda.mes_id) === parseInt(mesaId) &&
          comanda.com_status === 1 &&
          !comanda.com_data_fim
      )
      .sort(
        (a, b) => new Date(b.com_data_inicio) - new Date(a.com_data_inicio)
      );

    if (comandasAtivas.length > 0) {
      const comandaMaisRecente = comandasAtivas[0];
      return parseInt(comandaMaisRecente.com_id);
    }

    // Se não encontrar comanda ativa, cria uma nova
    const responseNovaComanda = await fetch('/api/comandas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mes_id: parseInt(mesaId),
        com_data_inicio: new Date().toISOString(),
        com_status: 1,
      }),
    });

    if (!responseNovaComanda.ok) {
      const error = await responseNovaComanda.json();
      throw new Error(
        `Erro ao criar comanda: ${error.message || 'Erro desconhecido'}`
      );
    }

    const novaComanda = await responseNovaComanda.json();
    return parseInt(novaComanda.com_id);
  } catch (error) {
    throw new Error(`Erro ao gerenciar comanda: ${error.message}`);
  }
}

async function criarPedido(comandaId) {
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

  try {
    const responsePedido = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoData),
    });

    if (!responsePedido.ok) {
      const error = await responsePedido.json();
      throw new Error(
        `Erro ao criar pedido: ${error.error || 'Erro desconhecido'}`
      );
    }

    const pedido = await responsePedido.json();

    if (!pedido.ped_id) {
      throw new Error('ID do pedido não retornado pelo servidor');
    }

    return pedido.ped_id;
  } catch (error) {
    throw error;
  }
}

async function adicionarProdutosAoPedido(pedidoId) {
  try {
    for (const item of carrinho) {
      // A tabela TBL_PEDIDO_PRODUTO espera apenas esses campos
      const produtoData = {
        ped_id: parseInt(pedidoId),
        pro_id: parseInt(item.pro_id),
        ppr_quantidade: parseInt(item.quantidade), // Alterado para ppr_quantidade conforme tabela
      };

      const responseProduto = await fetch('/api/pedidos-produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produtoData),
      });

      if (!responseProduto.ok) {
        const errorData = await responseProduto.json();
        throw new Error(
          `Erro ao adicionar produto: ${JSON.stringify(errorData)}`
        );
      }

      const resultado = await responseProduto.json();
    }

    return true;
  } catch (error) {
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
  if (!mesaId) {
    showToast('Você precisa logar na mesa primeiro.', 'error');
    throw new Error('ID da mesa não definido.');
  }

  return mesaId;
}

// Função para abrir o modal de login da mesa
function openLoginModal() {
  const modalLogin = document.querySelector('.modal-login-mesas');
  modalLogin.classList.add('ativo'); // Adiciona a classe ativo para abrir o modal
}

// Função para fechar o modal de login da mesa
function closeLoginModal() {
  const modalLogin = document.querySelector('.modal-login-mesas');
  modalLogin.classList.remove('ativo'); // Remove a classe ativo para fechar o modal
}

// Função para logar na mesa
async function logarNaMesa() {
  const codigoMesaInput = document.getElementById('codigo-mesa');
  const codigoMesa = codigoMesaInput.value.trim();

  if (!codigoMesa) {
    showToast('Por favor, insira o código da mesa.', 'error');
    return;
  }

  try {
    // Faz a requisição para buscar a mesa pelo código
    const response = await fetch(`/api/mesas/codigo/${codigoMesa}`);
    if (!response.ok) {
      throw new Error('Mesa não encontrada ou código inválido.');
    }

    const mesa = await response.json();

    // Define o ID da mesa globalmente
    mesaId = mesa.mes_id;

    // Atualiza o texto do elemento com o ID "mesa-logada"
    const mesaLogadaElement = document.getElementById('mesa-logada');
    mesaLogadaElement.innerHTML = escapeHTML(mesa.mes_nome);

    showToast(
      `Logado na mesa ${mesa.mes_descricao || mesa.mes_id} com sucesso!`,
      'success'
    );
    closeLoginModal(); // Fecha o modal após o login
  } catch (error) {
    showToast(error.message || 'Erro ao logar na mesa.', 'error');
  }
}

// Adiciona eventos para abrir e fechar o modal de login
document.getElementById('entrar-mesa').addEventListener('click', logarNaMesa);
document
  .querySelector('.modal-login-mesas .fechar-modal')
  .addEventListener('click', closeLoginModal);

// Exemplo: Abre o modal de login ao carregar a página (pode ser ajustado conforme necessário)
document.addEventListener('DOMContentLoaded', () => {
  openLoginModal();
});

function openModalPedidos() {
  const modalPedidos = document.querySelector('.modal-pedidos');
  const numeroPessoasElement = document.getElementById('pessoas-divisao');

  // Redefine o número de pessoas para 1 ao abrir o modal
  numeroPessoasElement.innerText = '1';

  // Atualiza a divisão da conta com o valor inicial
  atualizarDivisaoConta();

  modalPedidos.classList.add('ativo'); // Adiciona a classe ativo para abrir o modal
}

function closeModalPedidos() {
  const modalPedidos = document.querySelector('.modal-pedidos');
  const numeroPessoasElement = document.getElementById('pessoas-divisao');

  // Redefine o número de pessoas para 1 ao fechar o modal
  numeroPessoasElement.innerText = '1';

  modalPedidos.classList.remove('ativo'); // Remove a classe ativo para fechar o modal
}

// Função para exibir os pedidos no modal
function exibirPedidosNoModal() {
  const pedidosContainer = document.getElementById('itens-pedidos');
  const resultadoPessoaElement = document.getElementById('resultado-pessoa');
  pedidosContainer.innerHTML = ''; // Limpa o container antes de adicionar os pedidos

  let total = 0;

  pedidos.forEach((item) => {
    const subtotal = item.pro_preco * item.quantidade;
    total += subtotal;

    const pedidoElement = document.createElement('div');
    pedidoElement.className = 'card-iten';
    pedidoElement.innerHTML = `
    <div class="esquerda">
      <div class="hora">
        <p>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div class="qtde">
        <p>${escapeHTML(item.quantidade)}x</p>
      </div>
      <div class="item">
        <p>${escapeHTML(item.pro_nome)}</p>
      </div>
    </div>
    <div class="direita">
      <div class="unidade">
        <p>R$ ${escapeHTML(item.pro_preco)}</p>
      </div>
      <div class="valor">
        <p>R$ ${escapeHTML(subtotal.toFixed(2))}</p>
      </div>
    </div>
  `;

    pedidosContainer.appendChild(pedidoElement);
  });

  // Atualiza o total no modal
  const totalElement = document.getElementById('total-pedidos');

  resultadoPessoaElement.innerText = `R$ ${total.toFixed(2)}`;
  totalElement.innerText = `R$ ${total.toFixed(2)}`;
}

// Adiciona o evento para fechar o modal ao clicar no botão de fechar
document
  .querySelector('.modal-pedidos .fechar-modal')
  .addEventListener('click', closeModalPedidos);

// Função para calcular e atualizar o valor por pessoa
function atualizarDivisaoConta() {
  const numeroPessoasElement = document.getElementById('pessoas-divisao');
  const resultadoPessoaElement = document.getElementById('resultado-pessoa');
  const totalElement = document.getElementById('total-pedidos');

  // Obtém o número de pessoas e o total
  const numeroPessoas = parseInt(numeroPessoasElement.innerText, 10);
  const total = parseFloat(
    totalElement.innerText.replace('R$', '').replace(',', '.')
  );

  // Calcula o valor por pessoa
  const valorPorPessoa = total / numeroPessoas;

  // Atualiza o valor no elemento resultado-pessoa
  resultadoPessoaElement.innerText = `R$ ${valorPorPessoa.toFixed(2)}`;
}

// Adiciona eventos para os botões de aumentar e diminuir o número de pessoas
document.getElementById('mais-divisao').addEventListener('click', () => {
  const numeroPessoasElement = document.getElementById('pessoas-divisao');
  let numeroPessoas = parseInt(numeroPessoasElement.innerText, 10);

  // Incrementa o número de pessoas
  numeroPessoas += 1;
  numeroPessoasElement.innerText = numeroPessoas;

  // Atualiza a divisão da conta
  atualizarDivisaoConta();
});

document.getElementById('menos-divisao').addEventListener('click', () => {
  const numeroPessoasElement = document.getElementById('pessoas-divisao');
  let numeroPessoas = parseInt(numeroPessoasElement.innerText, 10);

  // Garante que o número de pessoas não seja menor que 1
  if (numeroPessoas > 1) {
    numeroPessoas -= 1;
    numeroPessoasElement.innerText = numeroPessoas;

    // Atualiza a divisão da conta
    atualizarDivisaoConta();
  }
});

// Função para atualizar o status da mesa para 2
async function pedirConta() {
  try {
    if (!mesaId) {
      showToast('Erro: ID da mesa não definido.', 'error');
      return;
    }

    // Use o ID da mesa logada (mesaId) na URL
    const response = await fetch(`/api/mesas/${mesaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 2 }), // Atualiza o status da mesa para 2
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar o status da mesa.');
    }

    const data = await response.json();
    showToast('Conta solicitada com sucesso!', 'success');

    // Fecha o modal de pedidos
    closeModalPedidos();
  } catch (error) {
    showToast('Erro ao solicitar a conta.', 'error');
  }
}

// Adiciona o evento ao botão "Pedir a Conta"
document.getElementById('pedir-conta').addEventListener('click', pedirConta);
