// src/js/grafico.js
import { showModal } from './modal.js';

// Variável global para armazenar a instância do gráfico
let graficoComandas = null;

export async function carregarGraficoComandas(token) {
  try {
    destruirGrafico();
    // 1. Criar container principal
    const graficoContainer = document.createElement('div');
    graficoContainer.className = 'conteudo-graficos grafico-page';
    
    // 2. Adicionar HTML ao container
    graficoContainer.innerHTML = `
      <div class="filtros-grafico">
        <div class="data-filtro">
          <label for="data-inicio">Data Início:</label>
          <input type="date" id="data-inicio">
        </div>
        <div class="data-filtro">
          <label for="data-fim">Data Fim:</label>
          <input type="date" id="data-fim">
        </div>
        <button id="btn-atualizar-grafico">Atualizar</button>
      </div>
      <div class="grafico-wrapper">
        <div class="loading">Carregando gráfico...</div>
        <canvas id="graficoComandas"></canvas>
      </div>
    `;

    // 3. Adicionar o container ao DOM
    document.querySelector('.conteudo-graficos-container').appendChild(graficoContainer);

    // 4. Obter referências dos elementos
    const dataInicioInput = graficoContainer.querySelector('#data-inicio');
    const dataFimInput = graficoContainer.querySelector('#data-fim');
    const btnAtualizar = graficoContainer.querySelector('#btn-atualizar-grafico');
    const canvas = graficoContainer.querySelector('#graficoComandas');
    const loading = graficoContainer.querySelector('.loading');
    
    // 5. Configurar datas padrão (últimos 7 dias)
    const dataFim = new Date();
    const dataInicio = new Date();
    dataInicio.setDate(dataFim.getDate() - 7);
    
    dataInicioInput.valueAsDate = dataInicio;
    dataFimInput.valueAsDate = dataFim;

    // 6. Função para carregar dados do gráfico
    const atualizarGrafico = async () => {
      try {
        // Mostrar loading
        canvas.style.display = 'none';
        loading.style.display = 'block';
        
        const inicio = dataInicioInput.value;
        const fim = dataFimInput.value;
        
        const response = await fetch(`/api/graficos/comandas-por-dia?dataInicio=${inicio}&dataFim=${fim}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Erro ao carregar dados');
        
        const data = await response.json();

        // Destruir gráfico anterior se existir
        if (graficoComandas) {
          graficoComandas.destroy();
        }

        // Criar novo gráfico
        const ctx = canvas.getContext('2d');
        graficoComandas = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Comandas por Dia da Semana'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });

        // Esconder loading
        loading.style.display = 'none';
        canvas.style.display = 'block';

      } catch (error) {
        console.error('Erro:', error);
        loading.style.display = 'none';
        showModal('Erro ao carregar gráfico: ' + error.message, 'error');
      }
    };

    // 7. Configurar evento do botão
    btnAtualizar.addEventListener('click', atualizarGrafico);

    // 8. Carregar dados inicialmente
    await atualizarGrafico();

    return graficoContainer;

  } catch (error) {
    console.error('Erro ao configurar gráfico:', error);
    showModal('Erro ao configurar gráfico', 'error');
    return document.createElement('div'); // Retorna container vazio em caso de erro
  }
}

export function destruirGrafico() {
    if (graficoComandas) {
      graficoComandas.destroy();
      graficoComandas = null;
    }
  }