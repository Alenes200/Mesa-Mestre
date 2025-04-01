document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const occupiedTablesContainer = document.getElementById('occupiedTables');
    const freeTablesContainer = document.getElementById('freeTables');
    const occupiedCount = document.getElementById('occupiedCount');
    const freeCount = document.getElementById('freeCount');
    const menuBtn = document.querySelector('.menu-btn');

    // Elementos da view de detalhes
    const mainView = document.getElementById('mainView');
    const mesaDetailView = document.getElementById('mesaDetailView');
    const mesaTitle = document.getElementById('mesaTitle');
    const produtosContainer = document.getElementById('produtosContainer');
    const totalProdutos = document.getElementById('totalProdutos');
    const totalQuantidade = document.getElementById('totalQuantidade');
    const totalValor = document.getElementById('totalValor');
    const voltarBtn = document.getElementById('voltarBtn');
    const addProdutoBtn = document.getElementById('addProdutoBtn');
    const pagarBtn = document.getElementById('pagarBtn');

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

    async function fetchProdutosComanda(mesaId) {
        try {
            const response = await fetch(`/api/comandas/mesa/${mesaId}/produtos`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMsg = errorData?.message || response.statusText;
                throw new Error(errorMsg || `Erro ${response.status} ao buscar produtos`);
            }
            
            const data = await response.json();
            
            // Verifica se o retorno é um array (mesmo que vazio)
            if (!Array.isArray(data)) {
                throw new Error('Formato de dados inválido - esperado array');
            }
            
            return data;
        } catch (error) {
            console.error('Erro na requisição:', error);
            // Retorna array vazio em caso de erro para a UI não quebrar
            return [];
        }
    }

    // Função para mostrar detalhes da mesa
    async function showMesaDetail(mesaId) {
        try {
            // Resetar totais antes de carregar
            totalProdutos.textContent = `Produtos (0)`;
            totalQuantidade.textContent = `Quantidade (0)`;
            totalValor.textContent = `R$ 0,00`;

            // Mostra loading enquanto busca os dados
            mesaDetailView.classList.remove('hidden');
            produtosContainer.innerHTML = '<div class="loading">Carregando produtos...</div>';
            mainView.classList.add('hidden');
            
            // Busca os produtos da comanda
            const produtos = await fetchProdutosComanda(mesaId);
            
            if (produtos.length === 0) {
                // Se não houver produtos, mostra mensagem amigável
                produtosContainer.innerHTML = `
                    <div class="no-products">
                        <i class="fas fa-info-circle"></i>
                        <p>Nenhum produto encontrado para esta comanda</p>
                    </div>
                `;
            } else {
                // Atualiza a UI com os produtos
                renderProdutos(produtos);
            }
            
            // Atualiza o título
            mesaTitle.textContent = `Mesa ${mesaId} - Comanda`;
            
        } catch (error) {
            console.error('Erro ao carregar detalhes da mesa:', error);
            
            // Mensagem de erro amigável
            produtosContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar produtos: ${error.message}</p>
                </div>
            `;
        }
    }

    // Função para renderizar produtos
    function renderProdutos(produtos) {
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
        
        produtos.forEach(produto => {
            const quantidade = Number(produto.quantidade) || 0;
            const valorUnitario = Number(produto.preco_unitario) || 0;
            const valorTotal = Number(produto.total) || (valorUnitario * quantidade);
            
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
        
        // Atualiza totais
        totalProdutos.textContent = `Prod. (${produtos.length})`;
        totalQuantidade.textContent = `Quant. (${quantidadeTotal})`;
        totalValor.textContent = `R$ ${total.toFixed(2)}`;
    }

    // Função para voltar à view principal
    function backToMainView() {
        mainView.classList.remove('hidden');
        mesaDetailView.classList.add('hidden');
    }

    // Função para lidar com clique na mesa
    window.handleTableClick = function(tableId) {
        showMesaDetail(tableId);
    };

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

    // Event listeners
    voltarBtn.addEventListener('click', backToMainView);
    addProdutoBtn.addEventListener('click', () => {
        alert('Adicionar produto - implementar esta funcionalidade');
    });
    pagarBtn.addEventListener('click', () => {
        alert('Fazer pagamento - implementar esta funcionalidade');
    });
    // Evento do botão menu
    menuBtn.addEventListener('click', function() {
        // Implemente a abertura do menu lateral aqui
        console.log('Menu clicado');
    });

    // Carregar mesas ao iniciar
    loadTables();
});