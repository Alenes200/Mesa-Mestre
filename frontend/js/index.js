document.addEventListener('DOMContentLoaded', () => {
  // Modal functionality remains the same
  const cardMesas = document.querySelectorAll('.card-mesa');
  const modal = document.querySelector('.modal-mesa');
  const closeIcon = document.querySelector('#fechar-modal-mesas');
  const overlay = document.querySelector('.overlay');

  cardMesas.forEach((card) => {
    card.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  });

  const closeModal = () => {
    modal.style.display = 'none';
  };

  closeIcon.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // New content switching functionality
  const menuCardapio = document.querySelector('.opcao:nth-child(1)');
  const menuMesas = document.querySelector('.opcao:nth-child(5)');
  const conteudoCardapio = document.querySelector('.conteudo-cardapio');
  const conteudoMesas = document.querySelector('.conteudo-mesas');

  menuCardapio.addEventListener('click', () => {
    console.log('teste');

    conteudoMesas.style.display = 'none';
    conteudoCardapio.style.display = 'flex';
  });

  menuMesas.addEventListener('click', () => {
    console.log('teste');
    conteudoCardapio.style.display = 'none';
    conteudoMesas.style.display = 'block';
  });
});

// Adicione um evento de clique ao botão "Adicionar Produto" enviando uma requisição POST para o backend
document
  .getElementById('btn-adicionar-produto')
  .addEventListener('click', async () => {
    // Captura os valores dos campos do formulário
    const nome = document.getElementById('nome').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const local = document.getElementById('local').value.trim();
    const precoInput = document.getElementById('preco').value.trim();
    const preco = parseFloat(precoInput.replace(',', '.')); // Substitui vírgula por ponto e converte para float
    const imagemInput = document.getElementById('imagem'); // Campo de upload de imagem
    const tipo = document
      .querySelector('.allergen-group:nth-child(3) .allergen-select')
      .value.trim();

    // Verifica se uma imagem foi selecionada
    if (
      !nome ||
      !descricao ||
      !local ||
      !preco ||
      !imagemInput.files.length ||
      !tipo
    ) {
      alert(
        'Por favor, preencha todos os campos obrigatórios antes de adicionar o produto.'
      );
      return;
    }

    // Cria um objeto FormData para enviar os dados, incluindo o arquivo de imagem
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('local', local);
    formData.append('preco', preco);
    formData.append('tipo', tipo);
    formData.append('imagem', imagemInput.files[0]); // Adiciona o arquivo de imagem

    try {
      // Faz a requisição POST para o backend
      const response = await fetch('/api/produtos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Produto adicionado com sucesso:', data);
        alert('Produto adicionado com sucesso!');
      } else {
        const errorData = await response.json();
        console.error('Erro ao adicionar produto:', errorData);
        alert('Erro ao adicionar produto: ' + errorData.error);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao adicionar produto. Tente novamente mais tarde.');
    }
  });

// Adicione um evento de mudança ao campo de upload de imagem para exibir uma pré-visualização da imagem selecionada
document.getElementById('imagem').addEventListener('change', (event) => {
  const fileInput = event.target;
  const file = fileInput.files[0]; // Obtém o arquivo selecionado
  const placeholder = document.querySelector('.image-placeholder');

  // Verifica se um arquivo foi selecionado e se é uma imagem
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    // Quando o arquivo for carregado, cria uma pré-visualização
    reader.onload = (e) => {
      placeholder.innerHTML = `<img src="${e.target.result}" alt="Pré-visualização da imagem" class="preview-image" />`;
    };

    // Lê o arquivo como uma URL de dados
    reader.readAsDataURL(file);
  } else {
    // Caso não seja uma imagem, exibe o texto padrão
    placeholder.innerHTML = `<span class="placeholder-text">Foto do Produto</span>`;
    alert('Por favor, selecione um arquivo de imagem válido.');
  }
});
