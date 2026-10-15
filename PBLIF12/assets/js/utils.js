const Utils = {
  escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  },

  todayIso() {
    return new Date().toISOString().slice(0, 10);
  },

  // Selisih hari antara tanggal (YYYY-MM-DD) dan hari ini
  diffDays(iso) {
    const a = new Date(iso + "T00:00:00");
    const b = new Date(this.todayIso() + "T00:00:00");
    return Math.round((a - b) / 86400000);
  },

  relativeDay(iso) {
    const d = this.diffDays(iso);
    if (d === 0) return "Hari ini";
    if (d === 1) return "Besok";
    if (d > 1) return d + " hari lagi";
    return "Terlambat " + Math.abs(d) + " hari";
  },

  longDateToday() {
    return new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
  },

  badgeClass(kondisi) {
    if (kondisi === "Sehat") return "";
    if (kondisi === "Layu") return "bad";
    return "warn";
  },

  // Warna latar placeholder foto, berdasarkan id supaya konsisten
  photoGradient(id) {
    const palette = [
      ["#2f6b52", "#8fbf9f"],
      ["#6b4a35", "#b38b6b"],
      ["#3d5a3a", "#a6c283"],
      ["#2a5d6b", "#8bbfc9"],
    ];
    const [a, b] = palette[id % palette.length];
    return `linear-gradient(135deg, ${a}, ${b})`;
  },

  toast(message) {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  },
};

// Tugas perawatan berikutnya (belum selesai) untuk satu tanaman
function nextTaskFor(plantId, jadwal) {
  return jadwal
    .filter((j) => j.tanamanId === plantId && !j.selesai)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal))[0];
}

// Ikon dan warna sesuai jenis aktivitas
function taskIcon(aktivitas) {
  const a = aktivitas.toLowerCase();
  if (a.includes("siram")) return { cls: "", name: "drop" };
  if (a.includes("putar") || a.includes("cahaya")) return { cls: "sun", name: "sun" };
  return { cls: "leaf", name: "leaf" };
}
