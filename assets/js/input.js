import { db } from "./firebase-init.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const rekapForm = document.getElementById("rekapForm");

// Ganti dengan nilai dari akun Cloudinary Anda
const CLOUDINARY_CLOUD_NAME = "dwljxyo01"; 
const CLOUDINARY_UPLOAD_PRESET = "Foto_Nota"; 
// HAPUS: import { v2 as cloudinary } from 'cloudinary'; 
// HAPUS: Konfigurasi API Key juga dihapus dari fungsi

/**
 * Fungsi untuk mengunggah file ke Cloudinary menggunakan fetch API
 * @param {File} file - Objek File yang akan diunggah
 * @returns {Promise<string>} URL gambar yang diunggah
 */
async function uploadToCloudinary(file) {
    
    // HAPUS BAGIAN INI: SDK dan konfigurasi API Secret tidak diperlukan untuk client-side unsigned upload
    /*
    cloudinary.config({ 
        cloud_name: 'dwljxyo01', 
        api_key: '537554813279722', 
        api_secret: 'NsqrPg_TVVg60R6cxZa8Fc-FziI' 
    });
    */

    const formData = new FormData();
    formData.append("file", file);
    // Upload Preset HARUS disetel ke Unsigned di Dasbor Cloudinary
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); 

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );
        
        if (!response.ok) {
            // Log detail error dari response jika ada
            const errorData = await response.json();
            console.error("Cloudinary API Error Detail:", errorData);
            throw new Error(`Cloudinary upload failed: ${response.statusText}. Cek konsol untuk detail.`);
        }

        const data = await response.json();
        return data.secure_url; // Mengembalikan URL aman dari gambar yang diunggah
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Gagal mengunggah gambar. Pastikan Upload Preset 'Foto_Nota' sudah Unsigned.");
    }
}


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
        try {
            fotoURL = await uploadToCloudinary(fotoNota); 
        } catch (error) {
            alert(error.message);
            return; 
        }
    }

    try {
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
    } catch (error) {
        console.error("Error saving data to Firestore:", error);
        alert("Gagal menyimpan data ke database.");
    }
});