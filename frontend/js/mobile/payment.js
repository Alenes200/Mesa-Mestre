import {
  fetchFormasPagamento,
  getComandaAtivaPorMesaId,
  getPedidosAtivos,
  processarPagamento,
} from './api.js';
import { backToDetailView, voltarParaTelaInicial } from './ui.js';
import { appState } from './state.js';
import { loadTables } from './tables.js';
import { ModalService } from './modalMobile.js';

let paymentInProgress = false;

export function initPayment() {
  const valorRecebido = document.getElementById('valorRecebido');
  const divideBy = document.getElementById('divideBy');
  const decreaseDivide = document.getElementById('decreaseDivide');
  const increaseDivide = document.getElementById('increaseDivide');
  const voltarPagamentoBtn = document.getElementById('voltarPagamentoBtn');
  const adicionarPagamentoBtn = document.getElementById(
    'adicionarPagamentoBtn'
  );

  voltarPagamentoBtn.addEventListener('click', backToDetailView);
  decreaseDivide.addEventListener('click', () => {
    const current = parseInt(divideBy.textContent) || 1;
    if (current > 1) {
      divideBy.textContent = current - 1;
      calculateDividedTotal();
    }
  });

  increaseDivide.addEventListener('click', () => {
    const current = parseInt(divideBy.textContent) || 1;
    divideBy.textContent = current + 1;
    calculateDividedTotal();
  });

  valorRecebido.addEventListener('input', updateRemainingValue);

  adicionarPagamentoBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    adicionarPagamentoBtn.disabled = true;
    await handlePayment();
    setTimeout(() => {
      adicionarPagamentoBtn.disabled = false;
    }, 1000);
  });

  document
    .getElementById('taxaServico')
    .addEventListener('change', async () => {
      const mesaId = document
        .getElementById('paymentTitle')
        .textContent.match(/Mesa (\d+)/)?.[1];
      if (!mesaId) return;

      const pedidos = await getPedidosAtivos(mesaId);
      const totalComTaxa = calculateTotalWithFee(pedidos);
      appState.totalComanda = totalComTaxa;

      document.getElementById('valorTotal').textContent =
        `R$ ${totalComTaxa.toFixed(2)}`;
      document.getElementById('valorFaltante').textContent =
        `Faltam: R$ ${totalComTaxa.toFixed(2)}`;
      calculateDividedTotal();

      if (document.getElementById('valorRecebido').value) {
        updateRemainingValue();
      }
    });

  loadPaymentMethods();
}

export async function showPaymentView() {
  const mesaDetailView = document.getElementById('mesaDetailView');
  const paymentView = document.getElementById('paymentView');
  const paymentTitle = document.getElementById('paymentTitle');
  const valorTotal = document.getElementById('valorTotal');
  const valorFaltante = document.getElementById('valorFaltante');
  const divideBy = document.getElementById('divideBy');
  const subtotal = document.getElementById('subtotal');
  const valorRecebido = document.getElementById('valorRecebido');

  mesaDetailView.classList.add('hidden');
  paymentView.classList.remove('hidden');

  const mesaId =
    document.getElementById('mesaTitle').textContent.match(/Mesa (\d+)/)?.[1] ||
    '00';
  paymentTitle.textContent = `Mesa ${mesaId} - Pagamento da Comanda`;

  document.getElementById('taxaServico').checked = true;

  const pedidos = await getPedidosAtivos(mesaId);
  const totalComTaxa = calculateTotalWithFee(pedidos);
  appState.totalComanda = totalComTaxa;

  valorTotal.textContent = `R$ ${totalComTaxa.toFixed(2)}`;
  valorFaltante.textContent = `Faltam: R$ ${totalComTaxa.toFixed(2)}`;
  divideBy.textContent = '1';
  subtotal.textContent = `R$ ${totalComTaxa.toFixed(2)} (1)`;

  valorRecebido.value = '';
  appState.selectedPaymentMethod = null;
  await loadPaymentMethods();
}

async function loadPaymentMethods() {
  const methodsContainer = document.querySelector('.payment-methods-grid');
  methodsContainer.innerHTML = '<div class="loading">Carregando...</div>';

  try {
    const formasPagamento = await fetchFormasPagamento();

    if (formasPagamento.length === 0) {
      methodsContainer.innerHTML =
        '<div class="no-results">Nenhuma forma de pagamento disponível</div>';
      return;
    }

    methodsContainer.innerHTML = '';

    formasPagamento.forEach((forma) => {
      const button = document.createElement('button');
      button.className = 'payment-method';
      button.dataset.method = forma.codigo;
      button.textContent = forma.descricao;

      button.addEventListener('click', function () {
        document
          .querySelectorAll('.payment-method')
          .forEach((m) => m.classList.remove('active'));
        this.classList.add('active');
        appState.selectedPaymentMethod = this.dataset.method;
      });

      methodsContainer.appendChild(button);
    });
  } catch (error) {
    methodsContainer.innerHTML =
      '<div class="error-message">Erro ao carregar formas de pagamento</div>';
  }
}

function calculateDividedTotal() {
  const divisions =
    parseInt(document.getElementById('divideBy').textContent) || 1;
  const dividedValue = appState.totalComanda / divisions;
  document.getElementById('subtotal').textContent =
    `R$ ${dividedValue.toFixed(2)} (${divisions})`;

  if (document.getElementById('valorRecebido').value) {
    updateRemainingValue();
  }
}

function updateRemainingValue() {
  const valorRecebido = document.getElementById('valorRecebido');
  const valorFaltante = document.getElementById('valorFaltante');

  const received = parseFloat(valorRecebido.value) || 0;
  const remaining = appState.totalComanda - received;
  valorFaltante.textContent = `Faltam: R$ ${remaining.toFixed(2)}`;
  valorFaltante.style.color = remaining > 0 ? '#e74c3c' : '#2ecc71';
}

export async function handlePayment() {
  if (paymentInProgress) return;
  paymentInProgress = true;

  const loadingElement = document.createElement('div');
  loadingElement.className = 'payment-loading';
  document.body.appendChild(loadingElement);

  try {
    if (!appState.selectedPaymentMethod) {
      await ModalService.alert('Selecione uma forma de pagamento');
      return;
    }

    const mesaId = document
      .getElementById('mesaTitle')
      .textContent.match(/Mesa (\d+)/)?.[1];
    if (!mesaId) throw new Error('ID da mesa não encontrado');

    const formaPagamentoId = appState.selectedPaymentMethod.split('_')[1];
    const valorRecebido =
      parseFloat(document.getElementById('valorRecebido').value) || 0;

    const comanda = await getComandaAtivaPorMesaId(mesaId);
    if (!comanda)
      throw new Error('Nenhuma comanda ativa encontrada para esta mesa');

    const pedidos = await getPedidosAtivos(mesaId);
    if (pedidos.length === 0) throw new Error('Nenhum pedido ativo encontrado');

    const valorTotal = calculateTotalWithFee(pedidos);

    if (valorRecebido < valorTotal) {
      await ModalService.alert(
        `Valor insuficiente! Faltam R$ ${(valorTotal - valorRecebido).toFixed(2)}`
      );
      return;
    }

    if (valorRecebido > valorTotal) {
      await ModalService.alert(
        `Valor maior que necessário! Passou R$ ${(valorRecebido - valorTotal).toFixed(2)}`
      );
      return;
    }

    const confirmacao = await ModalService.confirm(
      `Confirmar pagamento de R$ ${valorTotal.toFixed(2)}?`
    );
    if (!confirmacao) return;

    await processarPagamento({
      pedidos,
      formaPagamentoId,
      comandaId: comanda.com_id,
      mesaId,
      valorTotal,
    });

    await ModalService.alert('Pagamento realizado com sucesso!');
    window.toggleTab('resumo');
    loadTables();
    voltarParaTelaInicial();
  } catch (error) {
    await ModalService.alert(`Erro: ${error.message}`);
  } finally {
    paymentInProgress = false;
    document.body.removeChild(loadingElement);
  }
}

function calcularValorTotal(pedidos) {
  return pedidos.reduce((total, pedido) => {
    return total + (parseFloat(pedido.total) || 0);
  }, 0);
}

function calculateTotalWithFee(pedidos) {
  const subtotal = calcularValorTotal(pedidos);
  const withFee = document.getElementById('taxaServico').checked;
  const taxa = withFee ? subtotal * 0.1 : 0;

  document.getElementById('valorTaxa').textContent = `R$ ${taxa.toFixed(2)}`;

  return subtotal + taxa;
}
