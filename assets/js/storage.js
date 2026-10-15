/*
 * storage.js
 * Pengganti database sementara: data disimpan di localStorage browser.
 * Nanti saat backend PHP + MySQL jadi, cukup ganti isi fungsi di file ini
 * (getAll, add, update, remove) menjadi panggilan ke server.
 */
const Storage = (() => {
  const PREFIX = "rimbun_";
  const memory = {}; // cadangan kalau localStorage diblokir

  function read(name) {
    try {
      const raw = localStorage.getItem(PREFIX + name);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return memory[name] || null;
    }
  }

  function write(name, value) {
    memory[name] = value;
    try {
      localStorage.setItem(PREFIX + name, JSON.stringify(value));
    } catch (e) {
      /* abaikan, tetap tersimpan di memory */
    }
  }

  function getAll(name) {
    return read(name) || [];
  }

  function nextId(list) {
    return list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  }

  function add(name, data) {
    const list = getAll(name);
    const item = { ...data, id: nextId(list) };
    list.push(item);
    write(name, list);
    return item;
  }

  function update(name, id, patch) {
    const list = getAll(name).map((item) => (item.id === id ? { ...item, ...patch } : item));
    write(name, list);
  }

  function remove(name, id) {
    write(name, getAll(name).filter((item) => item.id !== id));
  }

  function removeWhere(name, predicate) {
    write(name, getAll(name).filter((item) => !predicate(item)));
  }

  function isoDate(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  }

  // Data contoh supaya halaman tidak kosong saat pertama dibuka / presentasi
  function seedIfEmpty() {
    if (read("seeded")) return;
    write("tanaman", [
      { id: 1, nama: "Monstera Deliciosa", jenis: "Tanaman tropis", tanggal: isoDate(-120), lokasi: "Ruang keluarga", kondisi: "Sehat" },
      { id: 2, nama: "Lili Perdamaian", jenis: "Tanaman berbunga", tanggal: isoDate(-60), lokasi: "Kamar tidur", kondisi: "Butuh air" },
      { id: 3, nama: "Philodendron", jenis: "Tanaman tropis", tanggal: isoDate(-30), lokasi: "Ruang kerja", kondisi: "Sehat" },
    ]);
    write("jadwal", [
      { id: 1, tanamanId: 2, aktivitas: "Siram tanaman", tanggal: isoDate(0), keterangan: "Pagi ini", selesai: false },
      { id: 2, tanamanId: 1, aktivitas: "Putar posisi pot", tanggal: isoDate(0), keterangan: "Agar tumbuh merata", selesai: false },
      { id: 3, tanamanId: 3, aktivitas: "Bersihkan daun", tanggal: isoDate(1), keterangan: "Sore hari", selesai: false },
    ]);
    write("seeded", true);
  }

  function resetDemo() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      /* abaikan */
    }
    seedIfEmpty();
  }

  return { getAll, add, update, remove, removeWhere, seedIfEmpty, resetDemo };
})();

Storage.seedIfEmpty();
