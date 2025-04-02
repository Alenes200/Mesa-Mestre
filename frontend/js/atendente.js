let mesaStatusAtual = 0;

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const occupiedTablesContainer = document.getElementById('occupiedTables');
    const freeTablesContainer = document.getElementById('freeTables');
    const occupiedCount = document.getElementById('occupiedCount');
    const freeCount = document.getElementById('freeCount');
    const menuBtn = document.querySelector('.menu-btn');

    // Seletores - Resumo Detalhes
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

    // Seletores - Histórico Detalhes
    const resumoBtn = document.getElementById('resumoBtn');
    const historicoBtn = document.getElementById('historicoBtn');
    const resumoContainer = document.querySelector('.mesa-content-container');
    const historicoContainer = document.getElementById('historicoContainer');

    // Seletores - Pagamento Atendimento
    const paymentView = document.getElementById('paymentView');
    const paymentTitle = document.getElementById('paymentTitle');
    const valorRecebido = document.getElementById('valorRecebido');
    const valorFaltante = document.getElementById('valorFaltante');
    const valorTotal = document.getElementById('valorTotal');
    const divideBy = document.getElementById('divideBy');
    const subtotal = document.getElementById('subtotal');
    const decreaseDivide = document.getElementById('decreaseDivide');
    const increaseDivide = document.getElementById('increaseDivide');
    const voltarPagamentoBtn = document.getElementById('voltarPagamentoBtn');
    const addProdutoPagamentoBtn = document.getElementById('addProdutoPagamentoBtn');
    const adicionarPagamentoBtn = document.getElementById('adicionarPagamentoBtn');
    const paymentMethods = document.querySelectorAll('.payment-method');

    // Variável para armazenar o valor total da comanda
    let totalComanda = 0;
    let selectedPaymentMethod = null;

    // Função para alternar entre tabs
    function toggleTab(tab) {
        if (tab === 'resumo') {
            // Ativa a tab de resumo
            resumoBtn.classList.add('active');
            historicoBtn.classList.remove('active');
            resumoContainer.style.display = 'flex';
            historicoContainer.style.display = 'none';
        } else if (tab === 'historico') {
            // Ativa a tab de histórico
            resumoBtn.classList.remove('active');
            historicoBtn.classList.add('active');
            resumoContainer.style.display = 'none';
            historicoContainer.style.display = 'flex';
            carregarPedidosComandaAtiva();
        }
    }

    // Torna a função acessível globalmente para o HTML
    window.toggleTab = toggleTab;

    // Função para mostrar a tela de pagamento
    async function showPaymentView() {
        // Esconde a view de detalhes e mostra a de pagamento
        mesaDetailView.classList.add('hidden');
        paymentView.classList.remove('hidden');
        
        // Atualiza os valores na tela de pagamento
        const mesaId = mesaTitle.textContent.match(/Mesa (\d+)/)?.[1] || '00';
        paymentTitle.textContent = `Mesa ${mesaId} - Pagamento da Comanda`;
        
        valorTotal.textContent = `R$ ${totalComanda.toFixed(2)}`;
        valorFaltante.textContent = `Faltam: R$ ${totalComanda.toFixed(2)}`;
        divideBy.textContent = '1';
        subtotal.textContent = `R$ ${totalComanda.toFixed(2)} (1)`;
        
        // Reseta o valor recebido e método de pagamento
        valorRecebido.value = '';
        selectedPaymentMethod = null;
        // paymentMethods.forEach(method => method.classList.remove('active'));
        await loadPaymentMethods();
    }

    // Função para carregar e exibir as formas de pagamento
    async function loadPaymentMethods() {
        const methodsContainer = document.querySelector('.payment-methods-grid');
        methodsContainer.innerHTML = '<div class="loading">Carregando...</div>';
        
        try {
            const formasPagamento = await fetchFormasPagamento();
            
            if (formasPagamento.length === 0) {
                methodsContainer.innerHTML = '<div class="no-results">Nenhuma forma de pagamento disponível</div>';
                return;
            }
            
            // Limpa o container
            methodsContainer.innerHTML = '';
            
            // Cria os botões para cada forma de pagamento
            formasPagamento.forEach(forma => {
                const button = document.createElement('button');
                button.className = 'payment-method';
                button.dataset.method = forma.codigo; // Usando o código da forma de pagamento
                button.textContent = forma.descricao; // Usando a descrição do banco
                
                button.addEventListener('click', function() {
                    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
                    this.classList.add('active');
                    selectedPaymentMethod = this.dataset.method;
                });
                
                methodsContainer.appendChild(button);
            });
            
        } catch (error) {
            console.error('Erro ao carregar formas de pagamento:', error);
            methodsContainer.innerHTML = '<div class="error-message">Erro ao carregar formas de pagamento</div>';
        }
    }

    // Função para voltar da tela de pagamento para a de detalhes
    function backToDetailView() {
        paymentView.classList.add('hidden');
        mesaDetailView.classList.remove('hidden');
    }

    // Função para calcular valores quando dividir a conta
    function calculateDividedTotal() {
        const divisions = parseInt(divideBy.textContent) || 1;
        const dividedValue = totalComanda / divisions;
        subtotal.textContent = `R$ ${dividedValue.toFixed(2)} (${divisions})`;
        
        // Atualiza o valor faltante se houver valor recebido
        if (valorRecebido.value) {
            updateRemainingValue();
        }
    }

    // Função para atualizar o valor faltante
    function updateRemainingValue() {
        const received = parseFloat(valorRecebido.value) || 0;
        const remaining = totalComanda - received;
        valorFaltante.textContent = `Faltam: R$ ${remaining.toFixed(2)}`;
        valorFaltante.style.color = remaining > 0 ? '#e74c3c' : '#2ecc71';
    }

    // Modifique o event listener do botão de pagamento existente
    pagarBtn.addEventListener('click', showPaymentView);

    // Adicione os novos event listeners
    voltarPagamentoBtn.addEventListener('click', backToDetailView);

    addProdutoPagamentoBtn.addEventListener('click', () => {
        alert('Adicionar produto - implementar esta funcionalidade');
    });
    
    adicionarPagamentoBtn.addEventListener('click', async () => {
        try {
            // 1. Validações iniciais
            if (!selectedPaymentMethod) {
                alert('Selecione uma forma de pagamento');
                return;
            }
    
            const mesaId = mesaTitle.textContent.match(/Mesa (\d+)/)?.[1];
            if (!mesaId) throw new Error('ID da mesa não encontrado');
    
            const formaPagamentoId = selectedPaymentMethod.split('_')[1];
            const valorRecebido = parseFloat(document.getElementById('valorRecebido').value) || 0;
            // const divisoes = parseInt(document.getElementById('divideBy').textContent) || 1;
    
            // 2. Buscar comanda ativa e pedidos
            const comanda = await getComandaAtivaPorMesaId(mesaId);
            if (!comanda) throw new Error('Nenhuma comanda ativa encontrada para esta mesa');
    
            const pedidos = await getPedidosAtivos(comanda.com_id);
            if (pedidos.length === 0) throw new Error('Nenhum pedido ativo encontrado');

            // 3. Calcular valor total e validar
            const valorTotal = calcularValorTotal(pedidos);

            if (valorRecebido < valorTotal) {
                console.log(`Valor insuficiente! Total: R$ ${valorTotal.toFixed(2)}\nRecebido: R$ ${valorRecebido.toFixed(2)}`, 'error', false);
                return;
            }
    
            // 4. Processar pagamento
            await processarPagamento({
                pedidos,
                formaPagamentoId,
                comandaId: comanda.com_id,
                mesaId,
                valorTotal
            });
    
            // 5. Feedback e redirecionamento
            alert('Pagamento realizado com sucesso!');
            toggleTab('resumo');
            voltarParaTelaInicial(); // Função que implementaremos abaixo
    
        } catch (error) {
            console.error('Erro no pagamento:', error);
            alert(`Erro: ${error.message}`);
        }
    });
    
    // Funções auxiliares:
    
    async function getPedidosAtivos(mesaId) {
        const response = await fetch(`/api/comandas/mesas/${mesaId}/pedidos-ativos`);
        if (!response.ok) throw new Error('Erro ao buscar pedidos');
        const data = await response.json();
        return Array.isArray(data) ? data : (data.data || []);
    }
    
    function calcularValorTotal(pedidos) {
        return pedidos.reduce((total, pedido) => {
            return total + (parseFloat(pedido.total) || 0);
        }, 0);
    }
    
    async function processarPagamento({ pedidos, formaPagamentoId, comandaId, mesaId, valorTotal }) {
        // Atualizar pedidos
        const updates = pedidos.map(pedido => 
            fetch(`/api/pedidos/${pedido.pedido_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fpa_id: formaPagamentoId })
            })
        );
        await Promise.all(updates);
    
        // Fechar comanda
        await fetch(`/api/comandas/${comandaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ com_status: -1 })
        });
    
        // Liberar mesa - ATENÇÃO ao campo correto
        const mesaResponse = await fetch(`/api/mesas/${mesaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 0 }) // Note que aqui é "status" e não "mes_status"
        });
        
        if (!mesaResponse.ok) throw new Error('Falha ao liberar mesa');
    }
    
    function voltarParaTelaInicial() {
        // Esconde a tela de detalhes/pagamento
        document.getElementById('mesaDetailView').classList.add('hidden');
        document.getElementById('paymentView').classList.add('hidden');
        
        // Mostra a tela principal
        document.getElementById('mainView').classList.remove('hidden');
        
        // Recarrega as mesas
        loadTables();
    }
    
    // Função auxiliar para buscar comanda ativa
    async function getComandaAtivaPorMesaId(mesaId) {
        try {
            const response = await fetch('/api/comandas/active');
            if (!response.ok) throw new Error('Erro ao buscar comandas ativas');
            
            const comandasAtivas = await response.json();
            // Verifica o formato da resposta (array direto ou objeto com propriedade data)
            const comandas = Array.isArray(comandasAtivas) ? comandasAtivas : 
                            (Array.isArray(comandasAtivas.data) ? comandasAtivas.data : []);
            
            return comandas.find(comanda => 
                comanda.mes_id && comanda.mes_id.toString() === mesaId
            );
        } catch (error) {
            console.error('Erro ao buscar comanda:', error);
            throw error;
        }
    }

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

    // Event listener para o input de valor recebido
    valorRecebido.addEventListener('input', updateRemainingValue);

    // Event listeners para os métodos de pagamento
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            selectedPaymentMethod = this.dataset.method;
        });
    });

    // Na função showMesaDetail, adicione no início para resetar para a tab de resumo
    async function showMesaDetail(mesaId) {
        // Sempre mostra o resumo primeiro
        toggleTab('resumo');
        atualizarBotaoPagamento(); 
        
        // Resto da sua implementação existente...
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
                
                totalComanda = produtos.reduce((sum, produto) => {
                    const quantidade = Number(produto.quantidade) || 0;
                    const valorUnitario = Number(produto.preco_unitario) || 0;
                    const valorTotal = Number(produto.total) || (valorUnitario * quantidade);
                    return sum + valorTotal;
                }, 0);
            }
            
            // Atualiza o título
            mesaTitle.textContent = `Mesa ${mesaId} - Comanda`;
            atualizarBotaoPagamento();
            
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

    // Função para carregar o histórico de pedidos
    async function carregarPedidosComandaAtiva() {
        try {
            const mesaId = mesaTitle.textContent.match(/Mesa (\d+)/)?.[1];
            
            if (!mesaId) {
                console.error('Não foi possível identificar o ID da mesa');
                return;
            }
    
            const container = document.getElementById('historicoPedidosContainer');
            container.innerHTML = '<div class="loading">Carregando pedidos...</div>';
    
            const response = await fetch(`/api/comandas/mesas/${mesaId}/pedidos-ativos`);
            if (!response.ok) {
                throw new Error('Erro ao carregar pedidos');
            }
    
            const { data: pedidos } = await response.json();
    
            // Limpa o container
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
    
            // Atualiza contadores
            document.getElementById('totalPedidos').textContent = `Pedidos (${pedidos.length})`;
            document.getElementById('totalGeralHistorico').textContent = `Total: R$ ${
                pedidos.reduce((sum, pedido) => sum + pedido.total, 0).toFixed(2)
            }`;
    
            // Preenche os pedidos
            pedidos.forEach(pedido => {
                const pedidoElement = document.createElement('div');
                pedidoElement.className = 'pedido-item';
                pedidoElement.innerHTML = `
                    <div class="pedido-header">
                        <span class="pedido-data">${new Date(pedido.data).toLocaleString('pt-BR')}</span>
                        <span class="pedido-numero">Pedido #${pedido.pedido_id}</span>
                        <span class="pedido-total">R$ ${pedido.total.toFixed(2)}</span>
                    </div>
                    <div class="detalhes-pedido">
                        ${pedido.itens.map(item => `
                        <div class="produto-historico">
                            <span>${item.nome} x${item.quantidade}</span>
                            <span>R$ ${(item.preco_unitario * item.quantidade).toFixed(2)}</span>
                        </div>
                        `).join('')}
                    </div>
                `;
                
                // Adiciona evento de clique para expandir/detalhar
                pedidoElement.addEventListener('click', function(e) {
                    if (!e.target.closest('.detalhes-pedido')) {
                        this.classList.toggle('expandido');
                    }
                });
                
                container.appendChild(pedidoElement);
            });
    
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            const container = document.getElementById('historicoPedidosContainer');
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar pedidos: ${error.message}</p>
                </div>
            `;
        }
    }

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

        totalComanda = total;
        
        // Atualiza totais
        totalProdutos.textContent = `Prod. (${produtos.length})`;
        totalQuantidade.textContent = `Quant. (${quantidadeTotal})`;
        totalValor.textContent = `R$ ${total.toFixed(2)}`;
    }

    // Função para voltar à view principal
    function backToMainView() {
        mesaStatusAtual = 0;
        pagarBtn.style.display = 'none';
        toggleTab('resumo');

        mainView.classList.remove('hidden');
        mesaDetailView.classList.add('hidden');
    }

    // Função para atualizar o botão de pagamento
    function atualizarBotaoPagamento() {
        pagarBtn.style.display = mesaStatusAtual === 2 ? 'flex' : 'none';
    }

    // Função para lidar com clique na mesa
    window.handleTableClick = function(tableId, status) {
        mesaStatusAtual = status;
        showMesaDetail(tableId);
        atualizarBotaoPagamento(); 
    };

    // Função para buscar formas de pagamento da API
    async function fetchFormasPagamento() {
        try {
            const response = await fetch('/api/formas-pagamento');
            if (!response.ok) {
                throw new Error('Erro ao buscar formas de pagamento');
            }
            const data = await response.json();
            return data;
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
            <div class="table-card status-${table.status}" onclick="handleTableClick(${table.id}, ${table.status})">
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
    // pagarBtn.addEventListener('click', () => {
    //     alert('Fazer pagamento - implementar esta funcionalidade');
    // });
    // Evento do botão menu
    menuBtn.addEventListener('click', function() {
        // Implemente a abertura do menu lateral aqui
        console.log('Menu clicado');
    });

    // Carregar mesas ao iniciar
    loadTables();
});