/* Halaman Beranda: ringkasan statistik, tanaman terbaru, dan jadwal perawatan (FR-06, ringkasan FR-07) */
function renderPlantCard(p, jadwal) {
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
    </article>`;
}

function renderTask(j, tanaman) {
  const plant = tanaman.find((p) => p.id === j.tanamanId);
  const ic = taskIcon(j.aktivitas);
  return `
    <div class="task ${j.selesai ? "done" : ""}">
      <span class="task-icon ${ic.cls}">${icon(ic.name)}</span>
      <div class="task-text">
        <strong>${Utils.escapeHtml(j.aktivitas)}</strong>
        <small>${Utils.escapeHtml(plant ? plant.nama : "(tanaman dihapus)")} · ${Utils.relativeDay(j.tanggal)}</small>
      </div>
      <button class="check" data-id="${j.id}" aria-label="Tandai selesai">${icon("check")}</button>
    </div>`;
}

function renderBeranda() {
  const tanaman = Storage.getAll("tanaman");
  const jadwal = Storage.getAll("jadwal");
  const selesai = jadwal.filter((j) => j.selesai).length;
  const tersisa = jadwal.length - selesai;
  const persen = jadwal.length ? Math.round((selesai / jadwal.length) * 100) : 0;

  document.getElementById("tanggalHariIni").textContent = Utils.longDateToday();
  document.getElementById("statTotal").textContent = tanaman.length;
  document.getElementById("statTersisa").textContent = tersisa;
  document.getElementById("statSelesai").textContent = selesai;

  const grid = document.getElementById("plantGrid");
  grid.innerHTML = tanaman.length
    ? tanaman.slice(0, 3).map((p) => renderPlantCard(p, jadwal)).join("")
    : `<div class="empty">Belum ada tanaman. Klik "Tambah tanaman" untuk mulai.</div>`;

  const upcoming = [...jadwal].sort((a, b) => Number(a.selesai) - Number(b.selesai) || a.tanggal.localeCompare(b.tanggal)).slice(0, 4);
  document.getElementById("taskCount").textContent = tersisa;
  document.getElementById("taskProgressText").textContent = `${selesai}/${jadwal.length} selesai`;
  document.getElementById("taskProgressBar").style.width = persen + "%";
  document.getElementById("taskList").innerHTML = upcoming.length
    ? upcoming.map((j) => renderTask(j, tanaman)).join("")
    : `<p class="muted">Belum ada jadwal perawatan.</p>`;

  document.querySelectorAll("#taskList .check").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const item = Storage.getAll("jadwal").find((j) => j.id === id);
      Storage.update("jadwal", id, { selesai: !item.selesai });
      renderBeranda();
    })
  );
}

document.addEventListener("DOMContentLoaded", renderBeranda);
