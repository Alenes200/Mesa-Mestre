import { showModal } from './modal.js';

let resizeObserver = null;

// Objeto para armazenar todas as instâncias de gráficos
const graficos = {
  comandas: null,
  topProdutos: null,
  faturamento: null,
  pagamentos: null,
  mediaComanda: null,
  ocupacao: null,
  categorias: null,
};

// Função para destruir todos os gráficos
export function destruirGrafico() {
  // Destruir todos os gráficos
  Object.values(graficos).forEach((grafico) => {
    if (grafico) {
      grafico.destroy();
    }
  });

  // Limpar o objeto de gráficos
  Object.keys(graficos).forEach((key) => {
    graficos[key] = null;
  });

  // Desconectar o ResizeObserver se existir
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
}

// Função para criar um container de loading
function criarLoading(container) {
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.innerHTML = '<div class="spinner"></div><p>Carregando dados...</p>';
  container.appendChild(loading);
  return loading;
}

// Função para remover loading
function removerLoading(loading) {
  if (loading && loading.parentNode) {
    loading.parentNode.removeChild(loading);
  }
}

// Função para criar um gráfico
function criarGrafico(ctx, type, data, options) {
  // Forçar dimensões mínimas
  const canvas = ctx.canvas;
  if (canvas.clientWidth < 100 || canvas.clientHeight < 100) {
    canvas.style.width = '100%';
    canvas.style.height = '300px';
  }

  const chart = new Chart(ctx, {
    type: type,
    data: data,
    options: {
      ...options,
      responsive: true,
      maintainAspectRatio: false,
      onResize: (chart, size) => {
        if (size.height < 100 || size.width < 100) {
          chart.canvas.parentNode.style.height = '300px';
          chart.resize();
        }
      },
    },
  });

  // Redimensionar após um pequeno delay para garantir que o DOM está pronto
  setTimeout(() => {
    chart.resize();
  }, 50);

  return chart;
}

// Função principal para carregar todos os gráficos
export async function carregarGraficoComandas(token) {
  try {
    // 1. Criar container principal
    const container = document.querySelector('.conteudo-graficos-container');
    container.style.display = 'block';

    // Configurar datas padrão (últimos 7 dias)
    const dataFim = new Date();
    const dataInicio = new Date();
    dataInicio.setDate(dataFim.getDate() - 7);

    const dataInicioInput = container.querySelector('#data-inicio');
    const dataFimInput = container.querySelector('#data-fim');

    dataInicioInput.valueAsDate = dataInicio;
    dataFimInput.valueAsDate = dataFim;

    // 4. Função para carregar todos os gráficos
    const carregarTodosGraficos = async () => {
      try {
        const inicio = dataInicioInput.value;
        const fim = dataFimInput.value;

        // Mostrar loading em todos os gráficos
        const wrappers = container.querySelectorAll('.grafico-wrapper');
        wrappers.forEach((wrapper) => {
          const loading = criarLoading(wrapper);
          const canvas = wrapper.querySelector('canvas');
          if (canvas) canvas.style.display = 'none';
        });

        // Função para buscar dados com tratamento de erros
        const fetchComTratamento = async (url) => {
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Detalhes do erro:', url, errorDetails);
            throw new Error(`Erro ao carregar dados: ${url}`);
          }

          const dados = await response.json();
        //   console.log('Dados recebidos:', url, dados);

          if (!Array.isArray(dados)) {
            console.error('Dados inesperados (não é array):', url, dados);
            return [];
          }

          return dados;
        };

        // Carregar dados de todos os gráficos em paralelo
        const dados = await Promise.all([
          fetchComTratamento(
            `/api/graficos/comandas-por-dia?dataInicio=${inicio}&dataFim=${fim}`
          ),
          fetchComTratamento(
            `/api/graficos/top-produtos?dataInicio=${inicio}&dataFim=${fim}`
          ),
          fetchComTratamento(
            `/api/graficos/faturamento-diario?dataInicio=${inicio}&dataFim=${fim}`
          ),
          fetchComTratamento(
            `/api/graficos/formas-pagamento?dataInicio=${inicio}&dataFim=${fim}`
          ),
          fetchComTratamento(
            `/api/graficos/media-comanda?dataInicio=${inicio}&dataFim=${fim}`
          ),
          fetchComTratamento(
            `/api/graficos/ocupacao-mesas?dataInicio=${inicio}&dataFim=${fim}`
          ),
          fetchComTratamento(
            `/api/graficos/vendas-categoria?dataInicio=${inicio}&dataFim=${fim}`
          ),
        ]);

        // Gráfico 1: Comandas por dia da semana
        if (graficos.comandas) graficos.comandas.destroy();
        graficos.comandas = criarGrafico(
          container.querySelector('#graficoComandas').getContext('2d'),
          'bar',
          {
            labels: dados[0].map((item) => item.dia_semana),
            datasets: [
              {
                label: 'Comandas por Dia',
                data: dados[0].map((item) => item.quantidade),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          },
          {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { mode: 'index', intersect: false },
            },
            scales: { y: { beginAtZero: true } },
          }
        );

        // Gráfico 2: Top 10 produtos
        if (graficos.topProdutos) graficos.topProdutos.destroy();
        graficos.topProdutos = criarGrafico(
          container.querySelector('#graficoTopProdutos').getContext('2d'),
          'bar',
          {
            labels: dados[1].map((item) => item.produto),
            datasets: [
              {
                label: 'Quantidade Vendida',
                data: dados[1].map((item) => item.quantidade_vendida),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                yAxisID: 'y',
              },
              {
                label: 'Faturamento (R$)',
                data: dados[1].map((item) => item.faturamento_total),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                yAxisID: 'y1',
                type: 'line',
              },
            ],
          },
          {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: { mode: 'index', intersect: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                position: 'left',
                title: { display: true, text: 'Quantidade' },
              },
              y1: {
                beginAtZero: true,
                position: 'right',
                title: { display: true, text: 'Faturamento (R$)' },
                grid: { drawOnChartArea: false },
              },
            },
          }
        );

        // Gráfico 3: Faturamento diário
        if (graficos.faturamento) graficos.faturamento.destroy();
        graficos.faturamento = criarGrafico(
            container.querySelector('#graficoFaturamento').getContext('2d'),
            'line',
            {
              labels: dados[2].map((item) => new Date(item.data).toLocaleDateString()),
              datasets: [
                {
                  label: 'Faturamento (R$)',
                  data: dados[2].map((item) => parseFloat(item.faturamento)),
                  borderColor: 'rgba(153, 102, 255, 1)',
                  backgroundColor: 'rgba(153, 102, 255, 0.1)',
                  yAxisID: 'y',
                  tension: 0.1
                },
                {
                  label: 'Comandas Atendidas',
                  data: dados[2].map((item) => parseInt(item.comandas_atendidas)),
                  borderColor: 'rgba(255, 159, 64, 1)',
                  backgroundColor: 'rgba(255, 159, 64, 0.1)',
                  yAxisID: 'y1',
                  type: 'line'
                }
              ]
            },
            {
              responsive: true,
              interaction: {
                mode: 'index',
                intersect: false
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Faturamento (R$)'
                  }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Comandas'
                  },
                  grid: {
                    drawOnChartArea: false
                  }
                }
              }
            }
          );

        // Gráfico 4: Formas de pagamento
        if (graficos.pagamentos) graficos.pagamentos.destroy();
        graficos.pagamentos = criarGrafico(
          container.querySelector('#graficoPagamentos').getContext('2d'),
          'doughnut',
          {
            labels: dados[3].map((item) => item.forma_pagamento),
            datasets: [
              {
                data: dados[3].map((item) => parseFloat(item.total_faturado)),
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                  '#FF9F40',
                  '#8AC24A',
                  '#607D8B',
                  '#E91E63',
                  '#9C27B0',
                ],
              },
            ],
          },
          {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce(
                      (a, b) => a + b,
                      0
                    );
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: R$${value.toFixed(2)} (${percentage}%)`;
                  },
                },
              },
            },
          }
        );

        // Gráfico 5: Média por comanda
        if (graficos.mediaComanda) graficos.mediaComanda.destroy();
        graficos.mediaComanda = criarGrafico(
          container.querySelector('#graficoMediaComanda').getContext('2d'),
          'bar',
          {
            labels: dados[4].map((item) =>
              new Date(item.data).toLocaleDateString()
            ),
            datasets: [
              {
                label: 'Média por Comanda (R$)',
                data: dados[4].map((item) => item.media_por_comanda),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                tension: 0.1,
              },
              {
                label: 'Total Comandas',
                data: dados[4].map((item) => item.total_comandas),
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                type: 'bar',
              },
            ],
          },
          {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { mode: 'index', intersect: false },
            },
            scales: { y: { beginAtZero: true } },
          }
        );

        // Gráfico 6: Ocupação de mesas
        if (graficos.ocupacao) graficos.ocupacao.destroy();
        graficos.ocupacao = criarGrafico(
          container.querySelector('#graficoOcupacao').getContext('2d'),
          'pie',
          {
            labels: dados[5].map((item) => item.local_mesa),
            datasets: [
              {
                data: dados[5].map((item) => item.percentual),
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                  '#FF9F40',
                  '#8AC24A',
                  '#607D8B',
                  '#E91E63',
                  '#9C27B0',
                ],
              },
            ],
          },
          {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.label}: ${context.raw}%`;
                  },
                },
              },
            },
          }
        );

        // Gráfico 7: Vendas por categoria
        if (graficos.categorias) graficos.categorias.destroy();
        graficos.categorias = criarGrafico(
          container.querySelector('#graficoCategorias').getContext('2d'),
          'bar',
          {
            labels: dados[6].map((item) => item.categoria),
            datasets: [
              {
                label: 'Faturamento (R$)',
                data: dados[6].map((item) => item.faturamento),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
              {
                label: 'Quantidade Vendida',
                data: dados[6].map((item) => item.quantidade_vendida),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                type: 'bar',
              },
            ],
          },
          {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: { mode: 'index', intersect: false },
            },
            scales: { y: { beginAtZero: true } },
          }
        );

        // Esconder todos os loadings e mostrar os canvases
        wrappers.forEach((wrapper) => {
          removerLoading(wrapper.querySelector('.loading'));
          const canvas = wrapper.querySelector('canvas');
          if (canvas) canvas.style.display = 'block';
        });

        // Depois de criar todos os gráficos, verifique se foram criados
        console.log('Gráficos criados:', {
          comandas: !!graficos.comandas,
          topProdutos: !!graficos.topProdutos,
          faturamento: !!graficos.faturamento,
          pagamentos: !!graficos.pagamentos,
          mediaComanda: !!graficos.mediaComanda,
          ocupacao: !!graficos.ocupacao,
          categorias: !!graficos.categorias,
        });

        // Verifique as dimensões dos canvas
        document.querySelectorAll('canvas').forEach((canvas) => {
          console.log(`Canvas ${canvas.id}:`, {
            width: canvas.width,
            height: canvas.height,
            clientWidth: canvas.clientWidth,
            clientHeight: canvas.clientHeight,
            offsetWidth: canvas.offsetWidth,
            offsetHeight: canvas.offsetHeight,
          });
        });
      } catch (error) {
        console.error('Erro ao carregar gráficos:', error);
        showModal('Erro ao carregar gráficos: ' + error.message, 'error');

        // Esconder loadings mesmo em caso de erro
        container.querySelectorAll('.loading').forEach((loading) => {
          removerLoading(loading);
        });
      }
    };

    // 5. Configurar evento do botão de atualizar
    container
      .querySelector('#btn-atualizar-grafico')
      .addEventListener('click', carregarTodosGraficos);

    // 6. Carregar dados inicialmente
    await carregarTodosGraficos();
    setupResizeObserver();
  } catch (error) {
    console.error('Erro ao configurar gráficos:', error);
    showModal('Erro ao configurar gráficos', 'error');
  }
}
// No final do arquivo grafico.js, adicione:
// Modifique a função setupResizeObserver:
function setupResizeObserver() {
    const container = document.querySelector('.conteudo-graficos-container');
    if (!container) return;
  
    // Desconectar observer anterior se existir
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  
    resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0) {
          // Redimensionar apenas gráficos visíveis
          Object.values(graficos).forEach((grafico) => {
            if (grafico && grafico.canvas.offsetParent !== null) {
              grafico.resize();
            }
          });
        }
      }
    });
  
    resizeObserver.observe(container);
  }