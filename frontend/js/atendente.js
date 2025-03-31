document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const occupiedTablesContainer = document.getElementById('occupiedTables');
    const freeTablesContainer = document.getElementById('freeTables');
    const occupiedCount = document.getElementById('occupiedCount');
    const freeCount = document.getElementById('freeCount');
    const menuBtn = document.querySelector('.menu-btn');

    // Função para buscar mesas da API
    async function fetchMesas() {
        try {
            const response = await fetch(`/api/mesas`);
            if (!response.ok) {
                throw new Error('Erro ao buscar mesas');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return [];
        }
    }

    // Função para buscar mesas por local
    async function fetchMesasPorLocal(local) {
        try {
            const response = await fetch(`/api/mesas/local/descricao/${local}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar mesas por local');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return [];
        }
    }

    // Função para carregar mesas
    async function loadTables() {
        try {
            // Busca todas as mesas ativas (status >= 0)
            const mesas = await fetchMesas();
            
            // Mapeia os dados da API para o formato esperado pelo frontend
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
            // Mostra mensagem de erro na interface
            occupiedTablesContainer.innerHTML = '<div class="error">Erro ao carregar mesas</div>';
            freeTablesContainer.innerHTML = '<div class="error">Erro ao carregar mesas</div>';
        }
    }

    // Função para atualizar a exibição das mesas
    function updateTablesDisplay(tablesData, filter = '') {
        // Filtrar mesas se houver termo de busca
        const filteredTables = filter ? 
            tablesData.filter(table => 
                table.location.toLowerCase().includes(filter.toLowerCase()) || 
                table.number.includes(filter) ||
                (table.description && table.description.toLowerCase().includes(filter.toLowerCase()))
            ) : 
            tablesData;

        // Separar mesas por status
        const free = filteredTables.filter(table => table.status === 0);
        const occupied = filteredTables.filter(table => table.status === 1);
        const payment = filteredTables.filter(table => table.status === 2);

        // Combinar ocupadas e aguardando pagamento
        const allOccupied = [...occupied, ...payment];

        // Atualizar contadores
        freeCount.textContent = free.length;
        occupiedCount.textContent = allOccupied.length;

        // Renderizar mesas livres
        freeTablesContainer.innerHTML = free.length > 0 ? 
            free.map(table => createTableCard(table)).join('') : 
            '<div class="no-results">Nenhuma mesa livre encontrada</div>';

        // Renderizar mesas ocupadas (incluindo aguardando pagamento)
        occupiedTablesContainer.innerHTML = allOccupied.length > 0 ? 
            allOccupied.map(table => createTableCard(table)).join('') : 
            '<div class="no-results">Nenhuma mesa ocupada encontrada</div>';
    }

    // Função para criar card de mesa
    function createTableCard(table) {
        let statusText = '';
        if (table.status === 2) {
            statusText = '<div class="payment-badge"></div>';
        }
        
        return `
            <div class="table-card status-${table.status}" onclick="handleTableClick(${table.id})">
                ${statusText}
                <span class="table-location">${table.location}</span>
                ${table.number}
                ${table.description ? `<span class="table-description">${table.description}</span>` : ''}
            </div>
        `;
    }

    // Função para lidar com clique na mesa
    window.handleTableClick = function(tableId) {
        // Aqui você pode implementar a lógica para redirecionar para:
        // - Tela de atendimento (status 0)
        // - Detalhes da mesa (status 1)
        // - Pagamento (status 2)
        alert(`Mesa ${tableId} selecionada`);
    };

    // Evento de busca
    searchInput.addEventListener('input', async function() {
        const searchTerm = this.value.trim();
        
        if (searchTerm) {
            try {
                // Busca mesas por local ou descrição
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
            // Se o campo de busca estiver vazio, recarrega todas as mesas
            loadTables();
        }
    });

    // Evento do botão menu
    menuBtn.addEventListener('click', function() {
        // Implemente a abertura do menu lateral aqui
        console.log('Menu clicado');
    });

    // Carregar mesas ao iniciar
    loadTables();
});