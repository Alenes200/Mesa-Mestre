let allProdutos = [];
let carrinho = [];
let mesaId; // Defina o ID da mesa dinamicamente
let comandaAtivaId = null;

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
  produtosContainer.innerHTML = ''; // Limpa o container antes de adicionar os produtos

  produtos.forEach((produto) => {
    const produtoElement = document.createElement('div');
    produtoElement.className = 'card-produto';

    const preco = `R$ ${produto.pro_preco}`;

    const imagemSrc = (document.getElementById('modal-imagem').src =
      `/uploads/${produto.pro_imagem}`);

    produtoElement.innerHTML = `
    <div class="descricao">
      <h2>${produto.pro_nome} <span>${preco}</span></h2>
      <p>${produto.pro_descricao}</p>
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
        <h2>${produto.pro_nome} <span>${preco}</span></h2>
        <p>${produto.pro_descricao}</p>
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

  console.log('Carrinho:', carrinho);
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
        data-index="${index}"
      />
      <div class="produto">
        <div class="E-descricao">
          <img
            src="/uploads/${item.pro_imagem}"
            alt="${item.pro_nome}"
            class="imagem-produto"
          />
          <div class="text-produto">
            <h2>${item.pro_nome}</h2>
            <p>${item.pro_descricao}</p>
          </div>
        </div>
        <div class="D-descricao">
          <div class="quantidade">
            <button class="btn-quantidade menos" data-index="${index}">
              <img src="../images/icon-menos.svg" alt="Diminuir quantidade" />
            </button>
            <span>${item.quantidade}</span>
            <button class="btn-quantidade mais" data-index="${index}">
              <img src="../images/icon-mais.svg" alt="Aumentar quantidade" />
            </button>
          </div>
          <div class="total-produto">
            <span>R$ ${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;

    carrinhoContainer.appendChild(itemElement);
  });

  // Atualiza o subtotal no rodapé do carrinho
  const totalElement = document.querySelector('.total-pedido span');
  totalElement.innerText = `R$ ${total.toFixed(2)}`;

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
    console.log('Mesa ID obtido:', mesaId);

    // Usa a comanda ativa existente ou cria uma nova
    comandaAtivaId = comandaAtivaId || (await verificarOuCriarComanda());
    console.log('Usando comanda ID:', comandaAtivaId);

    const pedidoId = await criarPedido(comandaAtivaId);
    console.log('Pedido ID criado:', pedidoId);

    await adicionarProdutosAoPedido(pedidoId);
    await atualizarPedidoComPrecoTotal(pedidoId);

    showToast('Pedido enviado com sucesso!');
    carrinho = [];
    closeCarrinho();
  } catch (error) {
    console.error('Erro detalhado ao enviar pedidos:', error);
    showToast(`Erro ao enviar pedidos: ${error.message}`, 'error');
  }
}

async function verificarOuCriarComanda() {
  try {
    console.log('Verificando comandas ativas para a mesa:', mesaId);

    const responseComandas = await fetch('/api/comandas/active');
    if (!responseComandas.ok) {
      throw new Error('Erro ao buscar comandas ativas.');
    }

    const comandas = await responseComandas.json();
    console.log('Comandas ativas encontradas:', comandas);

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
      console.log('Comanda mais recente encontrada:', comandaMaisRecente);
      return parseInt(comandaMaisRecente.com_id);
    }

    // Se não encontrar comanda ativa, cria uma nova
    console.log('Nenhuma comanda ativa encontrada. Criando nova comanda...');
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
    console.log('Nova comanda criada com sucesso:', novaComanda);
    return parseInt(novaComanda.com_id);
  } catch (error) {
    console.error('Erro ao verificar/criar comanda:', error);
    throw new Error(`Erro ao gerenciar comanda: ${error.message}`);
  }
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
  return 1; // Exemplo estático, substitua pela lógica real
}
