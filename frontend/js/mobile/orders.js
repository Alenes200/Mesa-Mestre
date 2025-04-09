import { fetchProdutosComanda, getPedidosAtivos } from './api.js';
import { escapeHTML } from '../../utils/sanitizacao.js';

export function initOrders() {
  const resumoBtn = document.getElementById('resumoBtn');
  const historicoBtn = document.getElementById('historicoBtn');
  const resumoContainer = document.querySelector('.mesa-content-container');
  const historicoContainer = document.getElementById('historicoContainer');

  // Toggle entre resumo e histórico
  resumoBtn.addEventListener('click', () => toggleTab('resumo'));
  historicoBtn.addEventListener('click', () => toggleTab('historico'));
}

export function toggleTab(tab) {
  const resumoBtn = document.getElementById('resumoBtn');
  const historicoBtn = document.getElementById('historicoBtn');
  const resumoContainer = document.querySelector('.mesa-content-container');
  const historicoContainer = document.getElementById('historicoContainer');

  if (tab === 'resumo') {
    resumoBtn.classList.add('active');
    historicoBtn.classList.remove('active');
    resumoContainer.style.display = 'flex';
    historicoContainer.style.display = 'none';
  } else if (tab === 'historico') {
    resumoBtn.classList.remove('active');
    historicoBtn.classList.add('active');
    resumoContainer.style.display = 'none';
    historicoContainer.style.display = 'flex';
    carregarPedidosComandaAtiva();
  }
}

// Torna a função acessível globalmente para o HTML
window.toggleTab = toggleTab;

export async function carregarPedidosComandaAtiva() {
  try {
    const mesaTitle = document.getElementById('mesaTitle');
    const mesaId = mesaTitle.textContent.match(/Mesa (\d+)/)?.[1];

    if (!mesaId) {
      return;
    }

    const container = document.getElementById('historicoPedidosContainer');
    container.innerHTML = '<div class="loading">Carregando pedidos...</div>';

    const pedidos = await getPedidosAtivos(mesaId);

    container.innerHTML = '';

    if (pedidos.length === 0) {
      container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-info-circle"></i>
                    <p>Nenhum pedido encontrado para esta comanda</p>
                </div>
            `;
      return;
    }

    document.getElementById('totalPedidos').textContent =
      `Pedidos (${pedidos.length})`;
    document.getElementById('totalGeralHistorico').textContent =
      `Total: R$ ${pedidos
        .reduce((sum, pedido) => sum + pedido.total, 0)
        .toFixed(2)}`;

    pedidos.forEach((pedido) => {
      const pedidoElement = document.createElement('div');
      pedidoElement.className = 'pedido-item';
      pedidoElement.innerHTML = `
                <div class="pedido-header">
                    <span class="pedido-data">${new Date(escapeHTML(pedido.data)).toLocaleString('pt-BR')}</span>
                    <span class="pedido-numero">Pedido #${escapeHTML(pedido.pedido_id)}</span>
                    <span class="pedido-total">R$ ${escapeHTML(pedido.total.toFixed(2))}</span>
                </div>
                <div class="detalhes-pedido">
                    ${pedido.itens
                      .map(
                        (item) => `
                    <div class="produto-historico">
                        <span>${escapeHTML(item.nome)} x${escapeHTML(item.quantidade)}</span>
                        <span>R$ ${(escapeHTML(item.preco_unitario) * escapeHTML(item.quantidade)).toFixed(2)}</span>
                    </div>
                    `
                      )
                      .join('')}
                </div>
            `;

      pedidoElement.addEventListener('click', function (e) {
        if (!e.target.closest('.detalhes-pedido')) {
          this.classList.toggle('expandido');
        }
      });

      container.appendChild(pedidoElement);
    });
  } catch (error) {
    const container = document.getElementById('historicoPedidosContainer');
    container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar pedidos: ${escapeHTML(error.message)}</p>
            </div>
        `;
  }
}
