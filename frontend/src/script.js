document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  const form = document.querySelector('#contactForm');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const inputs = form.querySelectorAll('input, textarea, select');
      let valid = true;

      inputs.forEach((input) => {
        if (!input.checkValidity()) {
          valid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });

      if (!valid) return;

      const payload = {
        nome: document.getElementById('nome')?.value || '',
        email: document.getElementById('email')?.value || '',
        telefone: document.getElementById('telefone')?.value || '',
        cidade: document.getElementById('cidade')?.value || '',
        escolaridade: document.getElementById('escolaridade')?.value || '',
        mensagem: document.getElementById('mensagem')?.value || ''
      };

      try {
        const API_URL = (window.ENV && window.ENV.API_URL) ? window.ENV.API_URL : 'https://backendeqt.vercel.app/api';
        const res = await fetch(`${API_URL}/cadastros`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro desconhecido');

        alert('Cadastro enviado com sucesso!');
        form.reset();
      } catch (err) {
        alert('Falha ao enviar: ' + err.message);
      }
    });
  }
});