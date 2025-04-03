// Modal Service
export const ModalService = {
    // Modal de Alerta
    alert: (message) => {
      return new Promise((resolve) => {
        const modal = document.getElementById('alertModal');
        const messageEl = document.getElementById('alertMessage');
        const confirmBtn = modal.querySelector('.modal__button--confirm');
        
        messageEl.textContent = message;
        modal.classList.add('modal--active');
        
        const handleConfirm = () => {
          modal.classList.remove('modal--active');
          confirmBtn.removeEventListener('click', handleConfirm);
          resolve(true);
        };
        
        confirmBtn.addEventListener('click', handleConfirm);
      });
    },
    
    // Modal de Confirmação
    confirm: (message) => {
      return new Promise((resolve) => {
        const modal = document.getElementById('confirmModal');
        const messageEl = document.getElementById('confirmMessage');
        const confirmBtn = modal.querySelector('.modal__button--confirm');
        const cancelBtn = modal.querySelector('.modal__button--cancel');
        
        messageEl.textContent = message;
        modal.classList.add('modal--active');
        
        const handleConfirm = () => {
          modal.classList.remove('modal--active');
          cleanUp();
          resolve(true);
        };
        
        const handleCancel = () => {
          modal.classList.remove('modal--active');
          cleanUp();
          resolve(false);
        };
        
        const cleanUp = () => {
          confirmBtn.removeEventListener('click', handleConfirm);
          cancelBtn.removeEventListener('click', handleCancel);
        };
        
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
      });
    }
  };