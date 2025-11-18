// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// ============================
// Konfigurasi Firebase
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyBdSyY332k0JIEgTjaE7RgmW-pYvf5Xcuw",
  authDomain: "logitrack-25acb.firebaseapp.com",
  projectId: "logitrack-25acb",
  storageBucket: "logitrack-25acb.appspot.com",
  messagingSenderId: "1041813195518",
  appId: "1:1041813195518:web:599f6da4e6ff112c4973af",
  measurementId: "G-HPZ4WTG4SQ"
};

// ============================
// Inisialisasi Firebase
// ============================
const app = initializeApp(firebaseConfig);

// ============================
// Export Modul Firebase
// ============================
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
