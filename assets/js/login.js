// login.js
import { auth } from "./firebase-init.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("username"); // sekarang ini email
  const passwordInput = document.getElementById("password");

  // Toggle show/hide password
  const passwordWrapper = passwordInput.parentElement;
  const toggleBtn = document.createElement("i");
  toggleBtn.className = "ri-eye-line";
  toggleBtn.style.position = "absolute";
  toggleBtn.style.right = "10px";
  toggleBtn.style.top = "50%";
  toggleBtn.style.transform = "translateY(-50%)";
  toggleBtn.style.cursor = "pointer";
  passwordWrapper.style.position = "relative";
  passwordWrapper.appendChild(toggleBtn);

  toggleBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleBtn.className = "ri-eye-off-line";
    } else {
      passwordInput.type = "password";
      toggleBtn.className = "ri-eye-line";
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Email dan password wajib diisi.");
      return;
    }

    const submitBtn = loginForm.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Loading...";

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      alert(`Login berhasil! Selamat datang, ${user.email}`);
      window.location.href = "dashboard.html";

    } catch (error) {
      console.error(error);
      let errorMessage = "Terjadi kesalahan saat login.";
      if (error.code === "auth/wrong-password") errorMessage = "Password salah.";
      else if (error.code === "auth/user-not-found") errorMessage = "Email tidak ditemukan.";
      else if (error.code === "auth/invalid-email") errorMessage = "Email tidak valid.";
      alert(errorMessage);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  });
});
