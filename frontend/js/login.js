document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-login').addEventListener('click', handleLogin);
});

import { showModal } from './modal.js';

// Função principal para lidar com o processo de login
async function handleLogin() {
  try {
    const { email, senha } = getLoginData();

    // Validação dos campos
    const errors = validateLoginInput(email, senha);
    if (errors.length > 0) {
      showModal(errors.join('\n'), 'warning');
      return;
    }

    const token = await login(email, senha);
    const userData = await getCurrentUser(token);

    // Salva o token e os dados do usuário no localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));

    redirectUser(userData);
  } catch (error) {
    showModal(
      error.message ||
        'Erro ao conectar ao servidor. Tente novamente mais tarde.',
      'error'
    );
  }
}

// Função de validação de inputs
function validateLoginInput(email, senha) {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !senha) {
    errors.push('Por favor, preencha todos os campos.');
  }

  if (!emailRegex.test(email)) {
    errors.push('Formato de e-mail inválido.');
  }

  if (senha.length < 8) {
    errors.push('A senha deve ter no mínimo 8 caracteres.');
  }

  if (!/[A-Z]/.test(senha)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula.');
  }

  if (!/\d/.test(senha)) {
    errors.push('A senha deve conter pelo menos um número.');
  }

  return errors;
}

// Função para obter e sanitizar os dados de login
function getLoginData() {
  const email = sanitizeInput(document.getElementById('email').value);
  const senha = sanitizeInput(document.getElementById('password').value);
  return { email, senha };
}

// Função de sanitização
function sanitizeInput(input) {
  return input.trim().replace(/<[^>]*>?/gm, '');
}

// Função para fazer login (modificada para melhor tratamento de erros)
async function login(email, senha) {
  try {
    const response = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Credenciais inválidas');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    throw new Error(error.message || 'Erro ao comunicar com o servidor');
  }
}

// Restante das funções mantidas com melhorias
async function getCurrentUser(token) {
  try {
    const response = await fetch('/api/auth', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter dados do usuário');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Erro ao carregar dados do usuário');
  }
}

function redirectUser(userData) {
  const redirects = {
    1: '../pages/pagina_adm.html',
    2: '../pages/atendente.html',
    3: '../pages/cardapio.html',
    4: '../pages/cozinha.html',
  };

  const path = redirects[userData.userType];
  if (path) {
    window.location.href = path;
  } else {
    showModal('Você não tem permissão para acessar esta área.', 'warning');
  }
}
