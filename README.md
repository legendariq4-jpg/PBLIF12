# Rimbun: Aplikasi Pencatatan Tanaman dan Jadwal Perawatan

Proyek PBL **PBLIF1-PB12**, Program Studi Teknik Informatika, Politeknik Negeri Batam.

## Anggota Tim
| Nama | NIM | Peran |
|---|---|---|
| Dzaki Ariq Andhara | 3312601054 | Ketua |
| Revand Marchdinata Hutabarat | 3312601055 | Anggota |

## Deskripsi
Aplikasi web untuk membantu pemilik atau pengelola tanaman mencatat data tanaman,
mengelola jadwal perawatan, mencari data, dan melihat rekap aktivitas perawatan.

## Status Pengerjaan (Front End)
| Fitur | Kebutuhan RPP | Status |
|---|---|---|
| Beranda (ringkasan, jadwal terdekat) | FR-06 | Selesai |
| Tanaman saya: tambah, tampil, ubah, hapus | FR-02 | Selesai |
| Pencarian dan filter kondisi tanaman | FR-05 | Selesai |
| Jadwal perawatan: tambah, centang selesai, hapus | FR-04 | Selesai |
| Kelola jenis tanaman | FR-01 | Belum |
| Kelola jenis perawatan | FR-03 | Belum |
| Rekap per periode | FR-07 | Belum |
| Login | NFR-03 | Belum |
| Backend PHP + MySQL | semua | Belum |

## Teknologi
HTML, CSS, JavaScript (tanpa framework). Data sementara disimpan di `localStorage` browser.
Tahap berikutnya: PHP dan MySQL (XAMPP/Laragon).



Untuk mengembalikan data contoh, buka konsol browser (F12) dan jalankan `Storage.resetDemo()`, lalu muat ulang halaman.

## Struktur Folder
```
index.html          halaman awal (mengarah ke beranda)
pages/              halaman aplikasi
assets/css/         variables, base, layout, components
assets/js/          storage (pengganti database), utils, layout, skrip tiap halaman
docs/flowchart/     flowchart dan workflow (.drawio)
docs/wireframe/     desain Figma
docs/laporan/       laporan proyek
```
