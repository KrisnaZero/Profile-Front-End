import { db } from "./firebase-init.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const rekapForm = document.getElementById("rekapForm");
const CLOUDINARY_CLOUD_NAME = "dwljxyo01";
const CLOUDINARY_UPLOAD_PRESET = "Foto_Nota";

// Fungsi format jam agar tetap format 24 jam (contoh: 09:05 bukan 9:5)
function formatTime24(value) {
  const [h, m] = value.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}

// Upload gambar ke Cloudinary
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Cloudinary API Error Detail:", errorData);
    throw new Error("Upload gambar gagal. Pastikan preset Cloudinary benar.");
  }

  const data = await response.json();
  return data.secure_url;
}

rekapForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tanggal = document.getElementById("tanggal").value;
  const kode = document.getElementById("kode").value;          // nama sopir
  const jamMasuk = formatTime24(document.getElementById("jamMasuk").value);
  const jamKeluarValue = document.getElementById("jamKeluar").value;
  const jamKeluar = jamKeluarValue ? formatTime24(jamKeluarValue) : "";
  const Invoice = document.getElementById("Invoice").value;
  const namaToko = document.getElementById("namaToko").value;
  const keterangan = document.getElementById("keterangan").value;
  const fotoNota = document.getElementById("fotoNota").files[0];

  let fotoURL = "";

  // upload foto
  if (fotoNota) {
    try {
      fotoURL = await uploadToCloudinary(fotoNota);
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  // simpan ke firestore
  try {
    await addDoc(collection(db, "rekap_pengiriman"), {
      tanggal,
      kode,
      jamMasuk,
      jamKeluarValue,
      jamKeluar,
      Invoice,
      namaToko,
      keterangan,
      fotoURL
    });

    alert("Data berhasil disimpan!");
    rekapForm.reset();

    // set tanggal ke hari ini setelah reset
    document.getElementById("tanggal").value = new Date().toISOString().slice(0, 10);

  } catch (error) {
    console.error("Error saving data to Firestore:", error);
    alert("Gagal menyimpan data ke database.");
  }
});
