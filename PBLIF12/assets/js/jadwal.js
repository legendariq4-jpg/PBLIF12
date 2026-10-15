/* Halaman Jadwal perawatan: catatan perawatan (FR-04) */
const AKTIVITAS = ["Siram tanaman", "Beri pupuk", "Putar posisi pot", "Bersihkan daun", "Pangkas", "Ganti media tanam"];

function renderJadwal() {
  const tanaman = Storage.getAll("tanaman");
  const jadwal = Storage.getAll("jadwal");
  const selesai = jadwal.filter((j) => j.selesai).length;
  const persen = jadwal.length ? Math.round((selesai / jadwal.length) * 100) : 0;

  document.getElementById("taskProgressText").textContent = `${selesai}/${jadwal.length} selesai`;
  document.getElementById("taskProgressBar").style.width = persen + "%";
  document.getElementById("taskCount").textContent = jadwal.length - selesai;

  const sorted = [...jadwal].sort((a, b) => Number(a.selesai) - Number(b.selesai) || a.tanggal.localeCompare(b.tanggal));
  const list = document.getElementById("taskList");

  if (!sorted.length) {
    list.innerHTML = `<div class="empty">Belum ada jadwal perawatan. Klik "Tambah jadwal perawatan".</div>`;
    return;
  }

  list.innerHTML = sorted
    .map((j) => {
      const p = tanaman.find((x) => x.id === j.tanamanId);
      const ic = taskIcon(j.aktivitas);
      return `
      <div class="task ${j.selesai ? "done" : ""}">
        <span class="task-icon ${ic.cls}">${icon(ic.name)}</span>
        <div class="task-text">
          <strong>${Utils.escapeHtml(j.aktivitas)}</strong>
          <small>${Utils.escapeHtml(p ? p.nama : "(tanaman dihapus)")} · ${Utils.relativeDay(j.tanggal)}${j.keterangan ? " · " + Utils.escapeHtml(j.keterangan) : ""}</small>
        </div>
        <button class="btn btn-ghost btn-sm" data-del="${j.id}">Hapus</button>
        <button class="check" data-id="${j.id}" aria-label="Tandai selesai">${icon("check")}</button>
      </div>`;
    })
    .join("");

  list.querySelectorAll(".check").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const item = Storage.getAll("jadwal").find((j) => j.id === id);
      Storage.update("jadwal", id, { selesai: !item.selesai });
      renderJadwal();
    })
  );
  list.querySelectorAll("[data-del]").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (!confirm("Hapus jadwal perawatan ini?")) return;
      Storage.remove("jadwal", Number(btn.dataset.del));
      Utils.toast("Jadwal dihapus");
      renderJadwal();
    })
  );
}

function openJadwalModal() {
  const tanaman = Storage.getAll("tanaman");
  if (!tanaman.length) {
    Utils.toast("Tambah tanaman dulu sebelum membuat jadwal");
    return;
  }
  document.getElementById("fTanaman").innerHTML = tanaman
    .map((p) => `<option value="${p.id}">${Utils.escapeHtml(p.nama)}</option>`)
    .join("");
  document.getElementById("fAktivitas").innerHTML = AKTIVITAS.map((a) => `<option>${a}</option>`).join("");
  document.getElementById("fTanggal").value = Utils.todayIso();
  document.getElementById("fKeterangan").value = "";
  document.getElementById("rowTanggal").classList.remove("invalid");
  document.getElementById("modal").classList.add("show");
}

function closeJadwalModal() {
  document.getElementById("modal").classList.remove("show");
}

function saveJadwal(e) {
  e.preventDefault();
  const tanggal = document.getElementById("fTanggal").value;
  document.getElementById("rowTanggal").classList.toggle("invalid", !tanggal);
  if (!tanggal) return;

  Storage.add("jadwal", {
    tanamanId: Number(document.getElementById("fTanaman").value),
    aktivitas: document.getElementById("fAktivitas").value,
    tanggal,
    keterangan: document.getElementById("fKeterangan").value.trim(),
    selesai: false,
  });
  Utils.toast("Jadwal perawatan ditambahkan");
  closeJadwalModal();
  renderJadwal();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addTaskBtn").addEventListener("click", openJadwalModal);
  document.getElementById("taskForm").addEventListener("submit", saveJadwal);
  document.getElementById("cancelBtn").addEventListener("click", closeJadwalModal);
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeJadwalModal();
  });
  renderJadwal();
});
