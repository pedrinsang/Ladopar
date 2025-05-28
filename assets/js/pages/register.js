import { auth, db } from'../main.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const registerForm = document.getElementById('registerForm');
const alertBox = document.getElementById('alert');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertBox.classList.add('d-none');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alertBox.className = 'alert alert-danger';
    alertBox.textContent = 'As senhas não coincidem.';
    alertBox.classList.remove('d-none');
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('password').focus();
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Salva o nome no Firestore
    await setDoc(doc(db, "users", user.uid), {
      nome: name,
      email: email,
      createdAt: new Date()
    });
    alertBox.className = 'alert alert-success';
    alertBox.textContent = 'Conta criada com sucesso!';
    alertBox.classList.remove('d-none');
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } catch (error) {
    alertBox.className = 'alert alert-danger';
    alertBox.textContent = 'Erro: ' + (error.message || 'Não foi possível criar a conta.');
    alertBox.classList.remove('d-none');
  }
});