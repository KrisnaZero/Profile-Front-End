import { db } from "./firebase-init.js";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const tableBody = document.querySelector("#pengirimanTable tbody");
const collectionRef = collection(db, "rekap_pengiriman");

// Fungsi terpisah untuk menyiapkan event listeners (Delete & Edit)
function setupEventListeners() {
    
    // del
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

// get data
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

        setupEventListeners();

    } catch (error) {
        console.error("Error loading data:", error);
        alert("Gagal memuat data dari database.");
    }
}
document.getElementById("exportExcel").addEventListener("click", () => {
    if (typeof XLSX === 'undefined') {
        alert("Pustaka XLSX (SheetJS) tidak ditemukan.");
        return;
    }

    const table = document.getElementById("pengirimanTable");
    const excludeCols = [5, 6]; // indeks kolom yang mau dikecualikan (0-based)

    // Buat salinan tabel sementara
    const tempTable = table.cloneNode(true);

    // Hapus kolom yang ingin dikecualikan
    Array.from(tempTable.rows).forEach(row => {
        // Urut dari belakang supaya indeks tetap valid saat hapus
        excludeCols.slice().reverse().forEach(idx => {
            if (row.cells[idx]) row.deleteCell(idx);
        });
    });

    try {
        const wb = XLSX.utils.table_to_book(tempTable, { sheet: "Pengiriman" });
        XLSX.writeFile(wb, "List_Pengiriman.xlsx");
        alert("Data berhasil diekspor ke Excel!");
    } catch (e) {
        console.error("Error exporting to Excel:", e);
        alert("Gagal mengekspor data ke Excel.");
    }
});

loadPengiriman();