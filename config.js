 // Konfigurasi Bot Telegram
const TELEGRAM_CONFIG = {
    BOT_TOKEN: '8161644789:AAGUDo2trAIuLL5MSDOWF6_3XEYXc1hvT8k', // Ganti dengan Token dari @BotFather
    CHAT_ID: '8494965854'                               // Ganti dengan Chat ID Telegram Anda
};

// Fungsi umum untuk mengirim data ke Telegram
async function sendToTelegram(messageText) {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.CHAT_ID,
                text: messageText,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('Gagal mengirim data ke Telegram:', error);
        return false;
    }
}