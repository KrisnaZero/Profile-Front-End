import { db } from "./firebase-init.js";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const tableBody = document.querySelector("#pengirimanTable tbody");
const collectionRef = collection(db, "rekap_pengiriman");

// Fungsi terpisah untuk menyiapkan event listeners (Delete & Edit)
function setupEventListeners() {
    
    // --- 🗑️ Delete Listener ---
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            if (confirm("Yakin ingin menghapus data ini?")) {
                try {
                    await deleteDoc(doc(db, "rekap_pengiriman", id));
                    alert("Data berhasil dihapus.");
                    loadPengiriman(); 
                } catch (error) {
                    console.error("Error deleting document:", error);
                    alert("Gagal menghapus data.");
                }
            }
        };
    });

    // --- ✏️ Edit Listener ---
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            const row = btn.closest("tr");

            const kode = prompt("Edit Kode:", row.children[0].textContent);
            const jamMasuk = prompt("Edit Jam Masuk:", row.children[1].textContent);
            const jamKeluar = prompt("Edit Jam Keluar:", row.children[2].textContent);
            const tanggal = prompt("Edit Tanggal:", row.children[3].textContent);
            const keterangan = prompt("Edit Keterangan:", row.children[4].textContent);

            if (kode !== null && jamMasuk !== null && jamKeluar !== null && tanggal !== null) {
                try {
                    await updateDoc(doc(db, "rekap_pengiriman", id), {
                        kode, jamMasuk, jamKeluar, tanggal, keterangan
                    });
                    alert("Data berhasil diperbarui.");
                    loadPengiriman(); 
                } catch (error) {
                    console.error("Error updating document:", error);
                    alert("Gagal memperbarui data.");
                }
            } else {
                alert("Pembaruan dibatalkan.");
            }
        };
    });
}

// Fungsi untuk memuat dan menampilkan data pengiriman
async function loadPengiriman() {
    if (!tableBody) return;
    tableBody.innerHTML = ""; 

    try {
        const snapshot = await getDocs(collectionRef);

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const fotoUrl = data.fotoURL || data.fotoNota; 
            const docId = docSnap.id; 
            
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${data.kode || "-"}</td>
                <td>${data.jamMasuk || "-"}</td>
                <td>${data.jamKeluar || "-"}</td>
                <td>${data.tanggal || "-"}</td>
                <td>${data.keterangan || "-"}</td>
                
                <td>
                    ${fotoUrl ? 
                        `<button class="view-btn btn-action" onclick="window.open('${fotoUrl}', '_blank')"><i class="ri-eye-line"></i> Lihat Foto</button>` 
                        : "-"}
                </td>
                
                <td>
                    <button class="edit-btn btn-action" data-id="${docId}"><i class="ri-edit-line"></i></button>
                    <button class="delete-btn btn-action" data-id="${docId}"><i class="ri-delete-bin-line"></i></button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Panggil event listeners setelah data dimuat
        setupEventListeners();

    } catch (error) {
        console.error("Error loading data:", error);
        alert("Gagal memuat data dari database.");
    }
}
// Hapus fungsi ini jika Anda sudah menggunakan SheetJS!
// --- Export ke Excel (Menggunakan SheetJS/XLSX) ---
document.getElementById("exportExcel").addEventListener("click", () => {
    if (typeof XLSX === 'undefined') {
        alert("Pustaka XLSX (SheetJS) tidak ditemukan.");
        return;
    }
    
    // Kolom 5 (Foto Nota) dan Kolom 6 (Aksi) dikecualikan
    const excludeCols = [5, 6]; 

    try {
        const wb = XLSX.utils.table_to_book(document.getElementById("pengirimanTable"), { 
            sheet: "Pengiriman",
            exclude_cols: excludeCols 
        });
        
        XLSX.writeFile(wb, "List_Pengiriman.xlsx");
        alert("Data berhasil diekspor ke Excel!");

    } catch (e) {
        console.error("Error exporting to Excel:", e);
        alert("Gagal mengekspor data ke Excel.");
    }
});
loadPengiriman();