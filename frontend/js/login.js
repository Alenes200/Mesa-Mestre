document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-login').addEventListener('click', handleLogin);
});

// Função principal para lidar com o processo de login
async function handleLogin() {
  try {
    // 1. Obter os dados de login
    const { email, senha } = getLoginData();

    // 2. Fazer login e obter o token
    const token = await login(email, senha);

    // 3. Obter os dados do usuário logado
    const userData = await getCurrentUser(token);

    // 4. Redirecionar o usuário com base no tipo de usuário
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
  console.log('Dados de login:', email, senha);
  return { email, senha };
}

// Função para fazer login e obter o token
async function login(email, senha) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
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
  return data.token; // Retorna o token JWT
}

// Função para obter os dados do usuário logado
async function getCurrentUser(token) {
  const userResponse = await fetch('http://localhost:3000/api/auth', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error('Erro ao obter dados do usuário.');
  }

  const userData = await userResponse.json();
  console.log('Dados do usuário logado:', userData);
  return userData; // Retorna os dados do usuário
}

// Função para redirecionar o usuário com base no tipo de usuário
function redirectUser(userData) {
  if (userData.user_type === 1) {
    window.location.href = '../pages/pagina_adm.html';
  } else if (userData.user_type === 2) {
    window.location.href = '../pages/cardapio.html';
  } else {
    alert('Você não tem permissão para acessar esta área.');
  }
}
