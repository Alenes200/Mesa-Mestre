import { showModal } from './modal.js';
import { escapeHTML } from '../utils/sanitizacao.js';

// Variável global para armazenar a lista completa de funcionários
let funcionarios = [];

function sanitizarHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Função para renderizar a tabela de funcionários
function renderizarFuncionarios(listaFuncionarios) {
  const tabelaFuncionarios = document.getElementById('funcionarios-table-body');
  tabelaFuncionarios.innerHTML = '';

  listaFuncionarios.forEach((funcionario) => {
    const linha = document.createElement('tr');
    linha.setAttribute('data-id', funcionario.usr_id);

    const statusClass =
      funcionario.usr_status === 1 ? 'status-ativo' : 'status-inativo';

    linha.innerHTML = `
      <td class="nome-column">${escapeHTML(funcionario.usr_nome)}</td>
      <td class="email-column">${escapeHTML(funcionario.usr_email)}</td>
      <td class="telefone-column">${escapeHTML(funcionario.usr_telefone || 'N/A')}</td>
      <td class="data-column">${escapeHTML(new Date(funcionario.usr_created_at).toLocaleDateString())}</td>
      <td class="funcao-column">${escapeHTML(funcionario.usr_funcao || 'N/A')}</td>
      <td class="status-column ${statusClass}">${escapeHTML(funcionario.usr_status === 1 ? 'Ativo' : 'Inativo')}</td>
      <td class="opcoes-column">
          <span class="editar-funcionario" data-id="${escapeHTML(funcionario.usr_id)}">✏️</span>
          <span class="deletar-funcionario" data-id="${escapeHTML(funcionario.usr_id)}">🗑️</span>
      </td>
    `;

    tabelaFuncionarios.appendChild(linha);
  });
}

// Função principal para listar funcionários
export async function listarFuncionarios(token, userId, termoBusca = null) {
  try {
    let url = `/api/users/all?userId=${userId}`;
    if (termoBusca) {
      url = `/api/users/search?term=${encodeURIComponent(termoBusca)}&userId=${userId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      funcionarios = await response.json();
      renderizarFuncionarios(funcionarios);
    } else {
      const errorData = await response.json();
      showModal('Erro ao buscar funcionários.', 'error');
    }
  } catch (error) {
    showModal(
      'Erro ao buscar funcionários. Tente novamente mais tarde.',
      'error'
    );
  }
}

// Função para buscar funcionários (será chamada pelo evento de pesquisa)
export async function buscarFuncionarios(token, userId) {
  const searchInput = document.getElementById('search-input-func');
  const searchTerm = searchInput.value.trim();

  // Validação básica
  if (searchTerm.length > 100) {
    showModal('O termo de busca deve ter no máximo 100 caracteres', 'warning');
    return;
  }

  // Sanitização adicional
  const termoSanitizado = searchTerm.replace(/[^\w\sÀ-ú\-]/gi, '');

  await listarFuncionarios(token, userId, termoSanitizado);
}
