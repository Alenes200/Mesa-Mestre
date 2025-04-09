document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-login').addEventListener('click', handleLogin);
});

// Função principal para lidar com o processo de login
async function handleLogin() {
  try {
    const { email, senha } = getLoginData();

    const token = await login(email, senha);

    const userData = await getCurrentUser(token);

    // Salva o token e os dados do usuário no localStorage
    localStorage.setItem('token', token);

    redirectUser(userData);
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert(
      'Erro ao conectar ao servidor. Verifique o console para mais detalhes.'
    );
  }
}

// Função para obter os dados de login do formulário
function getLoginData() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('password').value;
  return { email, senha };
}

// Função para fazer login e obter o token
async function login(email, senha) {
  const response = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    throw new Error('Erro ao fazer login.');
  }

  const data = await response.json();
  return data.token;
}

// Função para obter os dados do usuário logado
async function getCurrentUser(token) {
  const userResponse = await fetch('/api/auth', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error('Erro ao obter dados do usuário.');
  }

  const userData = await userResponse.json();
  return userData; // Retorna os dados do usuário
}

// Função para redirecionar o usuário com base no tipo de usuário
function redirectUser(userData) {
  if (userData.userType === 1) {
    window.location.href = '../pages/pagina_adm.html';
  } else if (userData.userType === 3) {
    window.location.href = '../pages/cardapio.html';
  } else if (userData.userType === 2) {
    window.location.href = '../pages/atendente.html';
  } else if (userData.userType === 4) {
    window.location.href = '../pages/cozinha.html';
  } else {
    alert('Você não tem permissão para acessar esta área.');
  }
}
