import { auth, db } from '../../../js/main.js';
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const registerForm = document.getElementById('registerForm');
const alertBox = document.getElementById('alert');

// Password strength validation
function isStrongPassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
}


async function verifyAccessCode(code) {
  try {
    // Normalizar o código (remover espaços, converter para maiúsculas)
    const normalizedCode = code.trim().toUpperCase();
    const msgBuffer = new TextEncoder().encode(normalizedCode);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    
    const validCodeHash = "aab96444e773c16302ccefa7e96c9a4e475d01e556eaf77e6b188daeb53dd74a";
    
    return hashHex === validCodeHash;
  } catch (error) {
    console.error("Erro ao verificar código de acesso:", error);
    return false;
  }
}

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertBox.classList.add('d-none');
  
  const accessCode = document.getElementById('accessCode').value;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validate inputs
  if (!accessCode || !name || !email || !password) {
    alertBox.className = 'alert alert-danger';
    alertBox.textContent = 'Todos os campos são obrigatórios.';
    alertBox.classList.remove('d-none');
    return;
  }

  // Password strength check
  if (!isStrongPassword(password)) {
    alertBox.className = 'alert alert-danger';
    alertBox.textContent = 'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.';
    alertBox.classList.remove('d-none');
    return;
  }

  if (password !== confirmPassword) {
    alertBox.className = 'alert alert-danger';
    alertBox.textContent = 'As senhas não coincidem.';
    alertBox.classList.remove('d-none');
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('password').focus();
    return;
  }

  // Move these variables outside the try block so they're accessible in catch block
  const submitBtn = registerForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  try {
    // Display loading indicator
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...';
    
    // Verificar o código de acesso primeiro
    const isValidCode = await verifyAccessCode(accessCode);
    
    if (!isValidCode) {
      throw { code: "auth/invalid-access-code", message: "Código de acesso inválido." };
    }
    
    // Se o código for válido, criar o usuário
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Salva o nome no Firestore e indica que o usuário tem acesso aprovado
    await setDoc(doc(db, "users", user.uid), {
      nome: name,
      email: email,
      emailVerified: false,
      createdAt: new Date(),
      lastLogin: new Date(),
      accessApproved: true
    });
    
    alertBox.className = 'alert alert-success';
    alertBox.textContent = 'Conta criada com sucesso! Um e-mail de verificação foi enviado para o seu endereço.';
    alertBox.classList.remove('d-none');
    
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  } catch (error) {
    console.error('Firebase error:', error.code, error.message);
    
    let errorMessage;
    
    // Common Firebase error messages translated to Portuguese
    switch (error.code) {
      case "auth/invalid-access-code":
        errorMessage = "O código de acesso é inválido.";
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Este e-mail já está sendo utilizado por outra conta.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'O endereço de e-mail não é válido.';
        break;
      case 'auth/weak-password':
        errorMessage = 'A senha é muito fraca.';
        break;
      default:
        errorMessage = error.message || 'Não foi possível criar a conta.';
    }
    
    alertBox.className = 'alert alert-danger';
    alertBox.textContent = 'Erro: ' + errorMessage;
    alertBox.classList.remove('d-none');
    
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
});