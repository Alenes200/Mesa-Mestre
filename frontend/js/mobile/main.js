import { initTables } from './tables.js';
import { initPayment } from './payment.js';
import { initOrders } from './orders.js';
import { initUI } from './ui.js';

// Inicializações quando o DOM estiver pronto
function initApp() {
  initTables();
  initPayment();
  initOrders();
  initUI();

  window.addEventListener('beforeunload', () => {
    if (appState.pollingInterval) {
      clearInterval(appState.pollingInterval);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
