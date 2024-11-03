# FighterTunnel Bot

FighterTunnel Bot adalah bot WhatsApp yang memungkinkan pengguna untuk membuat akun layanan seperti SSH, VLESS, VMESS, Trojan, dan Shadowsocks melalui antarmuka interaktif.

## Fitur

- Mendukung pembuatan akun untuk layanan SSH, VLESS, VMESS, Trojan, dan Shadowsocks.
- Menggunakan antarmuka interaktif untuk mengumpulkan informasi dari pengguna.
- Mengelola interaksi dengan WhatsApp menggunakan `@mengkodingan/ckptw` dan `@whiskeysockets/baileys`.

## Instalasi

1. Clone repository ini:

   ```bash
   git clone https://github.com/AutoFTbot/FighterTunnel-Bot
   cd FighterTunnel-Bot
   ```

2. Instal dependensi:

   ```bash
   npm install
   ```

3. Konfigurasi bot:

   - Salin file `.env.example` menjadi `.env`:

     ```bash
     cp .env.example .env
     ```

   - Edit file `.env` dan isi dengan informasi yang sesuai.
     ```bash
     nano .env
     ```

   - Atau, jalankan skrip `setup.sh` untuk memudahkan pengaturan:

     ```bash
     bash setup.sh
     ```

## Penggunaan

Jalankan bot dengan perintah berikut:

```bash
node appV2.js
```

## Catatan

- Pastikan Anda telah mengisi semua variabel lingkungan yang diperlukan di file `.env` sebelum menjalankan bot.
- Gunakan `setup.sh` untuk memudahkan pengaturan awal variabel lingkungan.
- Pastikan versi node 20.x^
