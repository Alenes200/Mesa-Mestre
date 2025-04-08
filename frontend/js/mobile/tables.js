import { fetchMesas, fetchMesasPorLocal } from './api.js';
import { showMesaDetail } from './ui.js';
import { appState } from './state.js';

// Função para criar card de mesa
function createTableCard(table) {
    let statusText = '';
    if (table.status === 2) {
        statusText = '<div class="payment-badge"></div>';
    }
    
    return `
        <div class="table-card status-${table.status}" onclick="handleTableClick(${table.id}, ${table.status})">
            ${statusText}
            <span class="table-location">${table.location}</span>
            ${table.number}
            ${table.description ? `<span class="table-description">${table.description}</span>` : ''}
        </div>
    `;
}

// Função para atualizar a exibição das mesas (exportada para uso interno)
export function updateTablesDisplay(tablesData, filter = '') {
    const occupiedTablesContainer = document.getElementById('occupiedTables');
    const freeTablesContainer = document.getElementById('freeTables');
    const occupiedCount = document.getElementById('occupiedCount');
    const freeCount = document.getElementById('freeCount');

    const filteredTables = filter ? 
        tablesData.filter(table => 
            table.location.toLowerCase().includes(filter.toLowerCase()) || 
            table.number.includes(filter) ||
            (table.description && table.description.toLowerCase().includes(filter.toLowerCase()))
        ) : 
        tablesData;

    const free = filteredTables.filter(table => table.status === 0);
    const occupied = filteredTables.filter(table => table.status === 1);
    const payment = filteredTables.filter(table => table.status === 2);
    const allOccupied = [...occupied, ...payment];

    freeCount.textContent = free.length;
    occupiedCount.textContent = allOccupied.length;

    freeTablesContainer.innerHTML = free.length > 0 ? 
        free.map(table => createTableCard(table)).join('') : 
        '<div class="no-results">Nenhuma mesa livre encontrada</div>';

    occupiedTablesContainer.innerHTML = allOccupied.length > 0 ? 
        allOccupied.map(table => createTableCard(table)).join('') : 
        '<div class="no-results">Nenhuma mesa ocupada encontrada</div>';
}

// Função principal de carregamento (exportada)
export async function loadTables() {
    try {
        const mesas = await fetchMesas();
        const tablesData = mesas.map(mesa => ({
            id: mesa.mes_id,
            number: mesa.mes_id.toString(),
            status: mesa.mes_status,
            location: mesa.loc_descricao || 'Sem local',
            description: mesa.mes_descricao || ''
        }));

        updateTablesDisplay(tablesData);
    } catch (error) {
        console.error('Erro ao carregar mesas:', error);
        const occupiedTablesContainer = document.getElementById('occupiedTables');
        const freeTablesContainer = document.getElementById('freeTables');
        occupiedTablesContainer.innerHTML = '<div class="error">Erro ao carregar mesas</div>';
        freeTablesContainer.innerHTML = '<div class="error">Erro ao carregar mesas</div>';
    }
}

export function initTables() {
    const searchInput = document.getElementById('searchInput');
    // Carregar mesas ao iniciar
    loadTables();

    // Inicia polling a cada 5 segundos
    appState.pollingInterval = setInterval(loadTables, 5000);

    // Evento de busca
    searchInput.addEventListener('input', async function() {
        const searchTerm = this.value.trim();
        
        if (searchTerm) {
            try {
                const mesas = await fetchMesasPorLocal(searchTerm);
                const tablesData = mesas.map(mesa => ({
                    id: mesa.mes_id,
                    number: mesa.mes_id.toString(),
                    status: mesa.mes_status,
                    location: mesa.loc_descricao || 'Sem local',
                    description: mesa.mes_descricao || ''
                }));
                
                updateTablesDisplay(tablesData);
            } catch (error) {
                console.error('Erro na busca:', error);
            }
        } else {
            loadTables();
        }
    });
}

// Função global para lidar com clique na mesa
window.handleTableClick = function(tableId, status) {
    appState.mesaStatusAtual = status;
    showMesaDetail(tableId);
    atualizarBotaoPagamento(); 
};

function atualizarBotaoPagamento() {
    const pagarBtn = document.getElementById('pagarBtn');
    if (pagarBtn) {
        pagarBtn.style.display = appState.mesaStatusAtual === 2 ? 'flex' : 'none';
    }
}