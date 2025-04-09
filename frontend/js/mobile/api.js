// Funções para chamadas à API
export async function logoutAtendimento() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      localStorage.removeItem('token');
      window.location.href = '../pages/login_adm.html';
    }
  } catch (error) {
    showModal('Erro ao fazer logout. Tente novamente.', 'error');
  }
}

export async function fetchMesas() {
  try {
    const response = await fetch(`/api/mesas`);
    if (!response.ok) throw new Error('Erro ao buscar mesas');
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function fetchMesasPorLocal(local) {
  try {
    const response = await fetch(`/api/mesas/local/descricao/${local}`);
    if (!response.ok) throw new Error('Erro ao buscar mesas por local');
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function fetchProdutosComanda(mesaId) {
  try {
    const response = await fetch(`/api/comandas/mesa/${mesaId}/produtos`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMsg = errorData?.message || response.statusText;
      throw new Error(errorMsg || `Erro ${response.status} ao buscar produtos`);
    }

    const data = await response.json();
    if (!Array.isArray(data))
      throw new Error('Formato de dados inválido - esperado array');
    return data;
  } catch (error) {
    return [];
  }
}

export async function fetchFormasPagamento() {
  try {
    const response = await fetch('/api/formas-pagamento');
    if (!response.ok) throw new Error('Erro ao buscar formas de pagamento');
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function getPedidosAtivos(mesaId) {
  const response = await fetch(`/api/comandas/mesas/${mesaId}/pedidos-ativos`);
  if (!response.ok) throw new Error('Erro ao buscar pedidos');
  const data = await response.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function getComandaAtivaPorMesaId(mesaId) {
  try {
    const response = await fetch('/api/comandas/active');
    if (!response.ok) throw new Error('Erro ao buscar comandas ativas');

    const comandasAtivas = await response.json();
    const comandas = Array.isArray(comandasAtivas)
      ? comandasAtivas
      : Array.isArray(comandasAtivas.data)
        ? comandasAtivas.data
        : [];

    return comandas.find(
      (comanda) => comanda.mes_id && comanda.mes_id.toString() === mesaId
    );
  } catch (error) {
    throw error;
  }
}

export async function processarPagamento({
  pedidos,
  formaPagamentoId,
  comandaId,
  mesaId,
  valorTotal,
}) {
  // Atualizar pedidos
  const updates = pedidos.map((pedido) =>
    fetch(`/api/pedidos/${pedido.pedido_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fpa_id: formaPagamentoId }),
    })
  );
  await Promise.all(updates);

  // Fechar comanda
  await fetch(`/api/comandas/${comandaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ com_status: -1 }),
  });

  // Liberar mesa
  const mesaResponse = await fetch(`/api/mesas/${mesaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 0 }),
  });

  if (!mesaResponse.ok) throw new Error('Falha ao liberar mesa');
}
