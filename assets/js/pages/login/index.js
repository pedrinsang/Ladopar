import { auth, db } from '../../../js/main.js';
    import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
    import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

    const loginForm = document.getElementById('loginForm');
    const alertBox = document.getElementById('alert');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      alertBox.classList.add('d-none');
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      if (!email || !password) {
        alertBox.className = 'alert alert-danger';
        alertBox.textContent = 'Por favor, preencha todos os campos.';
        alertBox.classList.remove('d-none');
        return;
      }
      
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Entrando...';
        
        // Fazer login com Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Verificar se o usuário existe no Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        // Atualizar última data de login se o usuário existir
        if (userDoc.exists()) {
          await updateDoc(doc(db, "users", user.uid), {
            lastLogin: new Date()
          });
        }
        
        // Exibir mensagem de sucesso
        alertBox.className = 'alert alert-success';
        alertBox.textContent = 'Login realizado com sucesso! Redirecionando...';
        alertBox.classList.remove('d-none');
        
        // Redirecionar para hub.html após um breve delay
        setTimeout(() => {
          window.location.href = '/Ladopar/pages/hub.html';
        }, 1000);
        
      } catch (error) {
        console.error('Login error:', error);
        
        let errorMessage;
        
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'E-mail ou senha incorretos.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Esta conta foi desativada.';
            break;
          default:
            errorMessage = 'Ocorreu um erro ao fazer login. Por favor, tente novamente.';
        }
        
        alertBox.className = 'alert alert-danger';
        alertBox.textContent = errorMessage;
        alertBox.classList.remove('d-none');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
