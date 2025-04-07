import { initTables, loadTables } from './tables.js';
import { initPayment } from './payment.js';
import { initOrders } from './orders.js';
import { initUI, voltarParaTelaInicial } from './ui.js';
import { logoutAtendimento } from './api.js';

// Inicializações quando o DOM estiver pronto
function initApp() {
    initTables();
    initPayment();
    initOrders();
    initUI();
    
    // Menu sanduíche
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');

    // Alternar menu sanduíche
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que o clique propague para o document
            mobileMenu.classList.toggle('hidden');
        });

        // Logout mobile
        const botaoLogoutMobile = document.querySelector('.sair-mobile');
        if (botaoLogoutMobile) {
            botaoLogoutMobile.addEventListener('click', logoutAtendimento);
        }

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Verifica se o DOM já está carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}