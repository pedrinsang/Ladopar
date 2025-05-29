import { auth } from '../../../js/main.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const resetForm = document.getElementById('resetForm');
const alertBox = document.getElementById('alert');

resetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Limpar alertas anteriores
  alertBox.classList.add('d-none');
  
  // Obter o e-mail informado
  const email = document.getElementById('email').value.trim();
  
  // Referência ao botão para mostrar o loading state
  const submitBtn = resetForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  
  try {
    // Mostrar indicador de carregamento
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...';
    
    // Enviar e-mail de recuperação
    await sendPasswordResetEmail(auth, email);
    
    // Exibir mensagem de sucesso
    alertBox.className = 'alert alert-success';
    alertBox.textContent = 'Um e-mail de recuperação foi enviado para ' + email + '. Verifique sua caixa de entrada.';
    alertBox.classList.remove('d-none');
    
    // Limpar o campo de e-mail
    document.getElementById('email').value = '';
    
  } catch (error) {
    // Tratar erros
    let errorMessage;
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'O endereço de e-mail não é válido.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Não encontramos um usuário com este e-mail.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
        break;
      default:
        errorMessage = 'Ocorreu um erro. Por favor, tente novamente.';
        console.error('Error:', error);
    }
    
    alertBox.className = 'alert alert-danger';
    alertBox.textContent = errorMessage;
    alertBox.classList.remove('d-none');
  } finally {
    // Restaurar o botão ao estado original
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
});