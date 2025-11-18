// testing load firebase
import { db } from "./firebase-init.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function testLoad() {
  try {
    const snapshot = await getDocs(collection(db, "rekap_pengiriman")); // sesuaikan nama collection
    snapshot.forEach(docSnap => {
      console.log(docSnap.id, docSnap.data());
    });
  } catch (error) {
    console.error("Error load data:", error);
  }
}

testLoad();
