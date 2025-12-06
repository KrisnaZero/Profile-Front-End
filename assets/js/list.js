import { db } from "./firebase-init.js";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const tableBody = document.querySelector("#pengirimanTable tbody");
const collectionRef = collection(db, "rekap_pengiriman");

// EVENT LISTENER
function setupEventListeners() {
  // DELETE
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      if (confirm("Yakin ingin menghapus data ini?")) {
        await deleteDoc(doc(db, "rekap_pengiriman", id));
        alert("Data berhasil dihapus.");
        loadPengiriman();
      }
    };
  });

  // EDIT (versi prompt)
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const row = btn.closest("tr");

      const tanggal = prompt("Edit Tanggal:", row.children[0].textContent);
      const kode = prompt("Edit Kode Sopir:", row.children[1].textContent);
      const jamMasuk = prompt("Edit Jam Masuk:", row.children[2].textContent);
      const jamKeluar = prompt("Edit Jam Keluar:", row.children[3].textContent);
      const nomorNota = prompt("Edit Nomor Nota:", row.children[4].textContent);
      const namaToko = prompt("Edit Nama Toko:", row.children[5].textContent);
      const keterangan = prompt("Edit Keterangan:", row.children[6].textContent);

      if (tanggal && kode && jamMasuk && jamKeluar && nomorNota && namaToko) {
        await updateDoc(doc(db, "rekap_pengiriman", id), {
          tanggal, kode, jamMasuk, jamKeluar, nomorNota, namaToko, keterangan
        });

        alert("Data berhasil diperbarui.");
        loadPengiriman();
      }
    };
  });
}

// LOAD DATA
async function loadPengiriman() {
  tableBody.innerHTML = "";

  const snapshot = await getDocs(collectionRef);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.tanggal || "-"}</td>
      <td>${data.kode || "-"}</td>
      <td>${data.jamMasuk || "-"}</td>
      <td>${data.jamKeluar || "-"}</td>
      <td>${data.Invoice || "-"}</td>
      <td>${data.namaToko || "-"}</td>
      <td>${data.keterangan || "-"}</td>

      <td>
        ${data.fotoURL 
          ? `<button class="view-btn btn-action" onclick="window.open('${data.fotoURL}', '_blank')"><i class='ri-eye-line'></i> Lihat</button>`
          : "-"
        }
      </td>

      <td>
        <button class="edit-btn btn-action" data-id="${id}"><i class='ri-edit-line'></i></button>
        <button class="delete-btn btn-action" data-id="${id}"><i class='ri-delete-bin-line'></i></button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  setupEventListeners();
}

// EXPORT EXCEL — FOTO & AKSI tidak dibawa
document.getElementById("exportExcel").addEventListener("click", () => {
  const table = document.getElementById("pengirimanTable");
  const excludeCols = [7, 8];

  const tempTable = table.cloneNode(true);

  Array.from(tempTable.rows).forEach(row => {
    excludeCols.slice().reverse().forEach(i => row.deleteCell(i));
  });

  const wb = XLSX.utils.table_to_book(tempTable, { sheet: "Pengiriman" });
  XLSX.writeFile(wb, "List_Pengiriman.xlsx");
  alert("Export sukses!");
});

loadPengiriman();
