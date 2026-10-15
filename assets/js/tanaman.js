/* Halaman Tanaman saya: CRUD tanaman (FR-02) dan pencarian/filter (FR-05) */
const KONDISI = ["Sehat", "Butuh air", "Perlu pupuk", "Layu"];
let editingId = null;

function filteredPlants() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const kondisi = document.getElementById("filterKondisi").value;
  return Storage.getAll("tanaman").filter((p) => {
    const cocokKondisi = !kondisi || p.kondisi === kondisi;
    const haystack = [p.nama, p.jenis, p.lokasi, p.kondisi].join(" ").toLowerCase();
    return cocokKondisi && (!q || haystack.includes(q));
  });
}

function renderList() {
  const jadwal = Storage.getAll("jadwal");
  const list = filteredPlants();
  const grid = document.getElementById("plantGrid");
  document.getElementById("resultCount").textContent = list.length + " tanaman";

  if (!list.length) {
    grid.innerHTML = `<div class="empty">Data tidak ditemukan. Coba kata kunci lain atau tambah tanaman baru.</div>`;
    return;
  }

  grid.innerHTML = list
    .map((p) => {
      const next = nextTaskFor(p.id, jadwal);
      return `
      <article class="plant-card">
        <div class="plant-photo" style="background:${Utils.photoGradient(p.id)}">
          <span class="badge ${Utils.badgeClass(p.kondisi)}">${Utils.escapeHtml(p.kondisi)}</span>
          ${icon("leaf")}
        </div>
        <div class="plant-body">
          <span class="eyebrow">${Utils.escapeHtml(p.jenis)}</span>
          <h3>${Utils.escapeHtml(p.nama)}</h3>
          <div class="plant-meta">
            <span>${icon("pin")}${Utils.escapeHtml(p.lokasi)}</span>
            <span>${icon("drop")}${next ? Utils.relativeDay(next.tanggal) : "Belum ada jadwal"}</span>
          </div>
        </div>
        <div class="plant-actions">
          <button class="btn btn-ghost btn-sm" data-edit="${p.id}">Ubah</button>
          <button class="btn btn-ghost btn-sm" data-del="${p.id}">Hapus</button>
        </div>
      </article>`;
    })
    .join("");

  grid.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => openModal(Number(b.dataset.edit))));
  grid.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => deletePlant(Number(b.dataset.del))));
}

/* ---------- Modal ---------- */
function setInvalid(fieldId, invalid) {
  document.getElementById(fieldId).classList.toggle("invalid", invalid);
}

function openModal(id = null) {
  editingId = id;
  const p = id ? Storage.getAll("tanaman").find((x) => x.id === id) : null;
  document.getElementById("modalTitle").textContent = p ? "Ubah tanaman" : "Tambah tanaman";
  document.getElementById("fNama").value = p ? p.nama : "";
  document.getElementById("fJenis").value = p ? p.jenis : "";
  document.getElementById("fTanggal").value = p ? p.tanggal : Utils.todayIso();
  document.getElementById("fLokasi").value = p ? p.lokasi : "";
  document.getElementById("fKondisi").value = p ? p.kondisi : "Sehat";
  ["rowNama", "rowJenis", "rowTanggal", "rowLokasi"].forEach((r) => setInvalid(r, false));
  document.getElementById("modal").classList.add("show");
  document.getElementById("fNama").focus();
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

function savePlant(e) {
  e.preventDefault();
  const data = {
    nama: document.getElementById("fNama").value.trim(),
    jenis: document.getElementById("fJenis").value.trim(),
    tanggal: document.getElementById("fTanggal").value,
    lokasi: document.getElementById("fLokasi").value.trim(),
    kondisi: document.getElementById("fKondisi").value,
  };

  // Validasi: semua kolom wajib diisi
  const checks = { rowNama: data.nama, rowJenis: data.jenis, rowTanggal: data.tanggal, rowLokasi: data.lokasi };
  let valid = true;
  Object.entries(checks).forEach(([row, value]) => {
    setInvalid(row, !value);
    if (!value) valid = false;
  });
  if (!valid) return;

  if (editingId) {
    Storage.update("tanaman", editingId, data);
    Utils.toast("Data tanaman berhasil diubah");
  } else {
    Storage.add("tanaman", data);
    Utils.toast("Data tanaman berhasil ditambahkan");
  }
  closeModal();
  renderList();
}

function deletePlant(id) {
  const p = Storage.getAll("tanaman").find((x) => x.id === id);
  if (!confirm(`Hapus "${p.nama}"? Jadwal perawatannya ikut terhapus.`)) return;
  Storage.remove("tanaman", id);
  Storage.removeWhere("jadwal", (j) => j.tanamanId === id);
  Utils.toast("Data tanaman dihapus");
  renderList();
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const search = document.getElementById("searchInput");
  search.value = params.get("q") || "";

  document.getElementById("filterKondisi").innerHTML =
    `<option value="">Semua kondisi</option>` + KONDISI.map((k) => `<option>${k}</option>`).join("");
  document.getElementById("fKondisi").innerHTML = KONDISI.map((k) => `<option>${k}</option>`).join("");

  search.addEventListener("input", renderList);
  document.getElementById("filterKondisi").addEventListener("change", renderList);
  document.getElementById("addPlantBtn").addEventListener("click", () => openModal());
  document.getElementById("plantForm").addEventListener("submit", savePlant);
  document.getElementById("cancelBtn").addEventListener("click", closeModal);
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  renderList();
  if (params.get("tambah")) openModal();
});
