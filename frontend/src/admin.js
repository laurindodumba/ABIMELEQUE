document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('adminLoginForm');
  const dashboardTable = document.getElementById('cadastrosTableBody');
  const logoutBtn = document.getElementById('logoutBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const API_URL = (window.ENV && window.ENV.API_URL) ? window.ENV.API_URL : 'https://backendeqt.vercel.app/api';

  // Handle Login Page
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const alertBox = document.getElementById('loginAlert');

      // Basic validation UI
      loginForm.classList.add('was-validated');
      if (!loginForm.checkValidity()) return;

      const payload = {
        username: usernameInput.value,
        password: passwordInput.value
      };

      try {
        const res = await fetch(`${API_URL}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao realizar login');

        // Store token and redirect
        localStorage.setItem('adminToken', data.token);
        window.location.href = 'admin-dashboard.html';
      } catch (err) {
        alertBox.textContent = err.message;
        alertBox.classList.remove('d-none');
      }
    });
  }

  // Handle Dashboard Page
  if (dashboardTable) {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // Redirect to login if no token
      window.location.href = 'admin-login.html';
      return;
    }

    const fetchCadastros = async () => {
      const alertBox = document.getElementById('dashboardAlert');
      alertBox.classList.add('d-none');
      dashboardTable.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Carregando dados...</td></tr>';

      try {
        const res = await fetch(`${API_URL}/cadastros`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('adminToken');
          window.location.href = 'admin-login.html';
          return;
        }

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Erro ao buscar cadastros');

        const cadastros = result.data || [];

        // Update stat cards
        const statTotal = document.getElementById('statTotal');
        const statCidades = document.getElementById('statCidades');
        const statUltimo = document.getElementById('statUltimo');

        if (statTotal) statTotal.textContent = cadastros.length;

        if (statCidades) {
          const uniqueCidades = new Set(cadastros.map(c => c.cidade).filter(Boolean));
          statCidades.textContent = uniqueCidades.size;
        }

        if (statUltimo) {
          if (cadastros.length > 0 && cadastros[0].created_at) {
            const d = new Date(cadastros[0].created_at);
            statUltimo.textContent = d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
          } else {
            statUltimo.textContent = '—';
          }
        }

        if (cadastros.length === 0) {
          dashboardTable.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Nenhum cadastro encontrado.</td></tr>';
          return;
        }

        dashboardTable.innerHTML = '';
        cadastros.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>#${item.id}</td>
            <td><strong>${escapeHtml(item.nome)}</strong></td>
            <td>${escapeHtml(item.email)}</td>
            <td>${escapeHtml(item.telefone)}</td>
            <td>${escapeHtml(item.cidade)}</td>
            <td><span class="badge bg-secondary">${escapeHtml(item.escolaridade)}</span></td>
            <td><small>${escapeHtml(item.mensagem)}</small></td>
          `;
          dashboardTable.appendChild(tr);
        });

      } catch (err) {
        alertBox.textContent = err.message;
        alertBox.classList.remove('d-none');
        dashboardTable.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-danger">Erro ao carregar os dados.</td></tr>';
      }
    };

    fetchCadastros();

    if (refreshBtn) {
      refreshBtn.addEventListener('click', fetchCadastros);
    }
  }

  // Logout Logic
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('adminToken');
      window.location.href = 'admin-login.html';
    });
  }
});

// Helper for escaping HTML to prevent XSS
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
