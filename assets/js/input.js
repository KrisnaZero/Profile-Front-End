import { db, storage } from "./firebase-init.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const rekapForm = document.getElementById("rekapForm");

rekapForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const kode = document.getElementById("kode").value;
  const jamMasuk = document.getElementById("jamMasuk").value;
  const jamKeluar = document.getElementById("jamKeluar").value;
  const tanggal = document.getElementById("tanggal").value;
  const keterangan = document.getElementById("keterangan").value;
  const fotoNota = document.getElementById("fotoNota").files[0];

  let fotoURL = "";

  if (fotoNota) {
    const storageRef = ref(storage, `nota/${Date.now()}_${fotoNota.name}`);
    await uploadBytes(storageRef, fotoNota);
    fotoURL = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "rekap_pengiriman"), {
    kode,
    jamMasuk,
    jamKeluar,
    tanggal,
    keterangan,
    fotoURL
  });

  alert("Data berhasil disimpan!");
  rekapForm.reset();
});
