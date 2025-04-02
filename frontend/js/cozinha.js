document.addEventListener('DOMContentLoaded', async () => {
  // 1. Verifica se existe um token
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../pages/login_adm.html';
    return;
  }

  try {
    // 2. Verifica se o token é válido fazendo uma requisição
    const response = await fetch('/api/auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Se a resposta não for ok, redireciona
    if (!response.ok) {
      throw new Error('Não autorizado');
    }

    // 4. Verifica o tipo de usuário
    const userData = await response.json();
    if (userData.userType !== 4) {
      // Tipo 4 = Cozinha
      window.location.href = '../pages/login_adm.html';
      return;
    }
  } catch (error) {
    // 5. Em caso de erro, redireciona
    console.error('Erro de autenticação:', error);
    window.location.href = '../pages/login_adm.html';
  }
});
