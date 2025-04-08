import { fetchProdutosComanda } from './api.js';
import { showPaymentView } from './payment.js';
import { appState } from './state.js';
import { ModalService } from './modalMobile.js';
import { logoutAtendimento } from './api.js';

export function initUI() {
  const voltarBtn = document.getElementById('voltarBtn');
  const addProdutoBtn = document.getElementById('addProdutoBtn');
  const pagarBtn = document.getElementById('pagarBtn');
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');

  // Event listeners
  voltarBtn.addEventListener('click', backToMainView);
  addProdutoBtn.addEventListener('click', async () => {
    await ModalService.alert(`Funcionalidade em desenvolvimento`);
  });
  pagarBtn.addEventListener('click', showPaymentView);
  // Alternar menu sanduíche
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });
    // Logout mobile
    const botaoLogoutMobile = document.querySelector('.sair-mobile');
    if (botaoLogoutMobile) {
      botaoLogoutMobile.addEventListener('click', () => {
        logoutAtendimento();
        if (appState.pollingInterval) {
            clearInterval(appState.pollingInterval);
            appState.pollingInterval = null;
        }
      });
    }
    document.addEventListener('click', (e) => {
      if (
        !mobileMenu.contains(e.target) &&
        e.target !== menuBtn &&
        !menuBtn.contains(e.target)
      ) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
}

export async function showMesaDetail(mesaId) {
  const mesaDetailView = document.getElementById('mesaDetailView');
  const mainView = document.getElementById('mainView');
  const mesaTitle = document.getElementById('mesaTitle');
  const produtosContainer = document.getElementById('produtosContainer');
  const totalProdutos = document.getElementById('totalProdutos');
  const totalQuantidade = document.getElementById('totalQuantidade');
  const totalValor = document.getElementById('totalValor');

  try {
    // Resetar totais antes de carregar
    totalProdutos.textContent = `Produtos (0)`;
    totalQuantidade.textContent = `Quantidade (0)`;
    totalValor.textContent = `R$ 0,00`;

    // Mostra loading enquanto busca os dados
    mesaDetailView.classList.remove('hidden');
    produtosContainer.innerHTML =
      '<div class="loading">Carregando produtos...</div>';
    mainView.classList.add('hidden');

    // Busca os produtos da comanda
    const produtos = await fetchProdutosComanda(mesaId);

    if (produtos.length === 0) {
      produtosContainer.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-info-circle"></i>
                    <p>Nenhum produto encontrado para esta comanda</p>
                </div>
            `;
    } else {
      renderProdutos(produtos);

      appState.totalComanda = produtos.reduce((sum, produto) => {
        const quantidade = Number(produto.quantidade) || 0;
        const valorUnitario = Number(produto.preco_unitario) || 0;
        const valorTotal = Number(produto.total) || valorUnitario * quantidade;
        return sum + valorTotal;
      }, 0);
    }

    // Atualiza o título
    mesaTitle.textContent = `Mesa ${mesaId} - Comanda`;
  } catch (error) {
    console.error('Erro ao carregar detalhes da mesa:', error);

    produtosContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar produtos: ${error.message}</p>
            </div>
        `;
  }
}

export function renderProdutos(produtos) {
  const produtosContainer = document.getElementById('produtosContainer');
  const totalProdutos = document.getElementById('totalProdutos');
  const totalQuantidade = document.getElementById('totalQuantidade');
  const totalValor = document.getElementById('totalValor');

  produtosContainer.innerHTML = '';

  if (produtos.length === 0) {
    produtosContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-info-circle"></i>
                <p>Nenhum produto nesta comanda</p>
            </div>
        `;
    return;
  }

  let total = 0;
  let quantidadeTotal = 0;

  produtos.forEach((produto) => {
    const quantidade = Number(produto.quantidade) || 0;
    const valorUnitario = Number(produto.preco_unitario) || 0;
    const valorTotal = Number(produto.total) || valorUnitario * quantidade;

    const item = document.createElement('div');
    item.className = 'produto-item';
    item.innerHTML = `
            <span>${produto.nome || 'Produto sem nome'}</span>
            <span>${quantidade}</span>
            <span>R$ ${valorTotal.toFixed(2)}</span>
        `;
    produtosContainer.appendChild(item);

    total += valorTotal;
    quantidadeTotal += quantidade;
  });

  appState.totalComanda = total;

  // Atualiza totais
  totalProdutos.textContent = `Prod. (${produtos.length})`;
  totalQuantidade.textContent = `Quant. (${quantidadeTotal})`;
  totalValor.textContent = `R$ ${total.toFixed(2)}`;
}

export function backToMainView() {
  const mainView = document.getElementById('mainView');
  const mesaDetailView = document.getElementById('mesaDetailView');
  const pagarBtn = document.getElementById('pagarBtn');

  appState.mesaStatusAtual = 0;
  if (pagarBtn) pagarBtn.style.display = 'none';
  window.toggleTab('resumo');

  mainView.classList.remove('hidden');
  mesaDetailView.classList.add('hidden');

  // Reinicia o polling se estiver parado
  if (!appState.pollingInterval) {
    appState.pollingInterval = setInterval(loadTables, 5000);
  }
}

export function backToDetailView() {
  const paymentView = document.getElementById('paymentView');
  const mesaDetailView = document.getElementById('mesaDetailView');

  paymentView.classList.add('hidden');
  mesaDetailView.classList.remove('hidden');
}

export function voltarParaTelaInicial() {
  const mesaDetailView = document.getElementById('mesaDetailView');
  const paymentView = document.getElementById('paymentView');
  const mainView = document.getElementById('mainView');

  mesaDetailView.classList.add('hidden');
  paymentView.classList.add('hidden');
  mainView.classList.remove('hidden');

  // Recarrega as mesas
  // loadTables();
}
