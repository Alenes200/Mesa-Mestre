import { showModal } from './modal.js';

export async function listarFuncionarios(token, userId) {
    try {
      // Faz a requisição GET para o endpoint /api/users/all, passando o userId como query parameter
      const response = await fetch(`/api/users/all?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const funcionarios = await response.json();
        console.log('Funcionários:', funcionarios);

        const tabelaFuncionarios = document.getElementById('funcionarios-table-body');
        tabelaFuncionarios.innerHTML = ''; 

        funcionarios.forEach((funcionario) => {
          const linha = document.createElement('tr');
          linha.setAttribute('data-id', funcionario.usr_id);

          const statusClass = funcionario.usr_status === 1 ? 'status-ativo' : 'status-inativo';

          linha.innerHTML = `
            <td class="nome-column">${funcionario.usr_nome}</td>
            <td class="email-column">${funcionario.usr_email}</td>
            <td class="telefone-column">${funcionario.usr_telefone || 'N/A'}</td>
            <td class="data-column">${new Date(funcionario.usr_created_at).toLocaleDateString()}</td>
            <td class="funcao-column">${funcionario.usr_funcao || 'N/A'}</td>
            <td class="status-column ${statusClass}">${funcionario.usr_status === 1 ? 'Ativo' : 'Inativo'}</td>
            <td class="opcoes-column">
                <span class="editar-funcionario" data-id="${funcionario.usr_id}">✏️</span>
                <span class="deletar-funcionario" data-id="${funcionario.usr_id}">🗑️</span>
            </td>
          `;

          tabelaFuncionarios.appendChild(linha);
        });
      } else {
        console.error('Erro ao buscar funcionários:', response.statusText);
        showModal('Erro ao buscar funcionários.', 'error');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      showModal('Erro ao buscar funcionários. Tente novamente mais tarde.', 'error');
    }
}