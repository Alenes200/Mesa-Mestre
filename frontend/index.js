import { showModal } from '../frontend/js/modal.js';

document.addEventListener('DOMContentLoaded', function () {
  // Menu hamburguer para mobile
  const hamburger = document.querySelector('.inicio-hamburger');
  const navLinks = document.querySelector('.inicio-nav-links');

  hamburger.addEventListener('click', function () {
    this.classList.toggle('inicio-active');
    navLinks.classList.toggle('inicio-active');
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll('.inicio-nav-link').forEach((link) => {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 992) {
        hamburger.classList.remove('inicio-active');
        navLinks.classList.remove('inicio-active');
      }
    });
  });

  // Scroll suave para as seções
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight =
          document.querySelector('.inicio-header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector('.inicio-header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('inicio-scrolled');
    } else {
      header.classList.remove('inicio-scrolled');
    }
  });

  // Ativar link do menu conforme scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function () {
    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const headerHeight =
        document.querySelector('.inicio-header').offsetHeight;

      if (pageYOffset >= sectionTop - headerHeight - 50) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.inicio-nav-link').forEach((link) => {
      link.classList.remove('inicio-active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('inicio-active');
      }
    });
  });

  // Formulário de contato
  const contactForm = document.querySelector('.inicio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Aqui você pode adicionar o código para enviar o formulário
      // Pode ser uma requisição AJAX para seu backend Node.js
      showModal(
        'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        'success'
      );
      this.reset();
    });
  }
});
