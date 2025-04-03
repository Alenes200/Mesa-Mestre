import { initTables, loadTables } from './tables.js';
import { initPayment} from './payment.js';
import { initOrders } from './orders.js';
import { initUI, voltarParaTelaInicial } from './ui.js';

// Adicione um gerenciador de eventos global para o pagamento
document.addEventListener('DOMContentLoaded', function() {
    initTables();
    initPayment();
    initOrders();
    initUI();
});
