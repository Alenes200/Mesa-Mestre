export function showModal(message, type = 'info', autoClose = true) {
  const modal = document.getElementById('custom-modal');
  const modalMessage = document.getElementById('custom-modal-message');
  const modalIcon = document.getElementById('custom-modal-icon');
  const closeButton = document.querySelector('.custom-modal-close');

  modalMessage.textContent = message;

  switch (type) {
    case 'success':
      modalIcon.innerHTML = '✔️';
      break;
    case 'error':
      modalIcon.innerHTML = '❌';
      break;
    case 'warning':
      modalIcon.innerHTML = '⚠️';
      break;
    default:
      modalIcon.innerHTML = 'ℹ️';
  }

  modal.style.display = 'flex';

  closeButton.addEventListener('click', closeModal);

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  if (autoClose) {
    setTimeout(closeModal, 4000);
  }

  // Função para fechar o modal com animação
  function closeModal() {
    modal.classList.add('fade-out');
    setTimeout(() => {
      modal.style.display = 'none';
      modal.classList.remove('fade-out');
    }, 300);
  }
}

let confirmCallback = null;

export function openConfirmModal(message, onConfirm) {
  const confirmModal = document.getElementById('confirm-modal');
  const confirmMessage = document.getElementById('confirm-modal-message');
  const confirmButton = document.getElementById('confirm-modal-confirm');
  const cancelButton = document.getElementById('confirm-modal-cancel');

  confirmMessage.textContent = message;

  confirmModal.style.display = 'flex';

  confirmButton.removeEventListener('click', confirmCallback);
  cancelButton.removeEventListener('click', closeConfirmModal);
  confirmModal.removeEventListener('click', closeConfirmModalOutside);

  confirmCallback = () => {
    onConfirm();
    closeConfirmModal();
  };

  confirmButton.addEventListener('click', confirmCallback);

  cancelButton.addEventListener('click', closeConfirmModal);

  confirmModal.addEventListener('click', closeConfirmModalOutside);
}

function closeConfirmModal() {
  const confirmModal = document.getElementById('confirm-modal');
  confirmModal.style.display = 'none';
}

function closeConfirmModalOutside(event) {
  if (event.target === document.getElementById('confirm-modal')) {
    closeConfirmModal();
  }
}
