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
