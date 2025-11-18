import { db } from "./firebase-init.js";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const tableBody = document.querySelector("#pengirimanTable tbody");
const collectionRef = collection(db, "rekap_pengiriman");

// Load data
async function loadPengiriman() {
  if (!tableBody) return;
  tableBody.innerHTML = "";

  const snapshot = await getDocs(collectionRef);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${data.kode || "-"}</td>
      <td>${data.jamMasuk || "-"}</td>
      <td>${data.jamKeluar || "-"}</td>
      <td>${data.tanggal || "-"}</td>
      <td>${data.keterangan || "-"}</td>
      <td>${data.fotoNota ? `<img src="${data.fotoNota}" alt="Nota" class="nota-thumb" />` : "-"}</td>
      <td>
        <button class="edit-btn" data-id="${docSnap.id}"><i class="ri-edit-line"></i></button>
        <button class="delete-btn" data-id="${docSnap.id}"><i class="ri-delete-bin-line"></i></button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Delete
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      if (confirm("Yakin ingin menghapus data ini?")) {
        await deleteDoc(doc(db, "rekap_pengiriman", id));
        loadPengiriman();
      }
    };
  });

  // Edit
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const row = btn.closest("tr");

      const kode = prompt("Edit Kode:", row.children[0].textContent);
      const jamMasuk = prompt("Edit Jam Masuk:", row.children[1].textContent);
      const jamKeluar = prompt("Edit Jam Keluar:", row.children[2].textContent);
      const tanggal = prompt("Edit Tanggal:", row.children[3].textContent);
      const keterangan = prompt("Edit Keterangan:", row.children[4].textContent);

      if (kode && jamMasuk && jamKeluar && tanggal) {
        await updateDoc(doc(db, "rekap_pengiriman", id), {
          kode,
          jamMasuk,
          jamKeluar,
          tanggal,
          keterangan
        });
        loadPengiriman();
      }
    };
  });
}

// Export ke Excel
document.getElementById("exportExcel").addEventListener("click", () => {
  const wb = XLSX.utils.table_to_book(document.getElementById("pengirimanTable"), { sheet: "Pengiriman" });
  XLSX.writeFile(wb, "List_Pengiriman.xlsx");
});

loadPengiriman();
