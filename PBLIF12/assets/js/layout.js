/*
 * layout.js
 * Menulis sidebar dan topbar satu kali, dipakai semua halaman.
 * Halaman menandai menu aktif lewat <body data-active="beranda">.
 */
const ICONS = {
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6.4C9.5 13.9 12 13 14 11"/>',
  home: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
};

function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

// Tambah menu baru di sini (mis. Jenis tanaman, Jenis perawatan, Rekap) saat halamannya sudah jadi.
const NAV_ITEMS = [
  { key: "beranda", label: "Beranda", href: "beranda.html", icon: "home" },
  { key: "tanaman", label: "Tanaman saya", href: "tanaman.html", icon: "sprout" },
  { key: "jadwal", label: "Jadwal perawatan", href: "jadwal-perawatan.html", icon: "calendar" },
];

function renderLayout() {
  const active = document.body.dataset.active;
  const total = Storage.getAll("tanaman").length;

  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = `
    <a class="brand" href="beranda.html"><span class="brand-mark">${icon("leaf")}</span>Rimbun</a>
    <nav class="nav" aria-label="Menu utama">
      ${NAV_ITEMS.map(
        (n) => `<a href="${n.href}" class="${n.key === active ? "active" : ""}">${icon(n.icon)}${n.label}</a>`
      ).join("")}
    </nav>
    <div class="tips">
      ${icon("sun")}
      <strong>Tips hari ini</strong>
      Putar tanaman setiap minggu agar tumbuh merata ke arah cahaya.
    </div>
    <div class="user-chip">
      <span class="avatar">AN</span>
      <div><strong>Andini N.</strong><small>${total} tanaman</small></div>
    </div>`;

  const topbar = document.getElementById("topbar");
  topbar.innerHTML = `
    <button class="menu-btn" id="menuBtn" aria-label="Buka menu">${icon("menu")}</button>
    <label class="search">
      ${icon("search")}
      <span class="sr-only">Cari tanaman</span>
      <input type="search" id="searchInput" placeholder="Cari tanamanmu..." autocomplete="off" />
    </label>
    <button class="icon-btn" aria-label="Notifikasi">${icon("bell")}</button>
    <button class="btn btn-primary" id="addPlantBtn">${icon("plus")}<span class="btn-label">Tambah tanaman</span></button>`;

  document.getElementById("menuBtn").addEventListener("click", () => sidebar.classList.toggle("open"));

  // Di halaman selain Tanaman, pencarian dan tombol Tambah mengarah ke halaman Tanaman
  if (active !== "tanaman") {
    document.getElementById("searchInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        window.location.href = "tanaman.html?q=" + encodeURIComponent(e.target.value.trim());
      }
    });
    document.getElementById("addPlantBtn").addEventListener("click", () => {
      window.location.href = "tanaman.html?tambah=1";
    });
  }
}

document.addEventListener("DOMContentLoaded", renderLayout);
