import { auth } from '../main.js';
    import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

    const loginForm = document.getElementById('loginForm');
    const alertBox = document.getElementById('alert');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertBox.classList.add('d-none');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        alertBox.className = 'alert alert-success';
        alertBox.textContent = 'Login realizado com sucesso!';
        alertBox.classList.remove('d-none');
        // Redirecionar para outra página, se necessário
        // window.location.href = "pages/hub.html";
      } catch (error) {
        alertBox.className = 'alert alert-danger';
        alertBox.textContent = 'Erro: ' + (error.message || 'Não foi possível fazer login.');
        alertBox.classList.remove('d-none');
      }
    });