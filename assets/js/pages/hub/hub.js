import { auth, db } from '../../../js/main.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// DOM Elements
const userName = document.getElementById('userName');
const btnLogout = document.getElementById('btnLogout');

// Check authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userName.textContent = userData.nome || 'Usuário';
      } else {
        userName.textContent = 'Usuário';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      userName.textContent = 'Usuário';
    }
  } else {
    // User is signed out, redirect to login page
    window.location.href = '../../../index.html';
  }
});

// Logout functionality
btnLogout.addEventListener('click', async () => {
  try {
    await signOut(auth);
    window.location.href = '../../../index.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Erro ao fazer logout. Tente novamente.');
  }
});