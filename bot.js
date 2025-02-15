const express = require('express');
const mineflayer = require('mineflayer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" } // CORS politikası: Herkese açık
});

let bot = null;
let botStatus = 'Kapalı'; // Botun durumu (Kapalı, Başlatılıyor, Bağlandı, Hata Aldı)
let errorMessage = ''; // Hata mesajını saklamak için

// Statik dosyaları sunmak için
app.use(express.static(path.join(__dirname, 'public')));
// CORS Middleware
app.use(cors());

// Botu başlatan ve durduran fonksiyon
function toggleBot() {
    if (bot) {
        bot.quit();
        bot = null;
        botStatus = 'Kapalı';
        errorMessage = ''; // Hata mesajını temizle
        console.log('Bot kapatıldı.');
        return false;
    } else {
        botStatus = 'Başlatılıyor...';
        console.log('Bot başlatılıyor...');

        bot = mineflayer.createBot({
            host: 'mc.toxiox.rf.gd',
            port: 28202,
            username: 'txtsv',
            version: '1.21.4'
        });

        bot.on('spawn', () => {
            botStatus = 'Bağlandı!';
            console.log('Bot sunucuya bağlandı!');
            bot.afkInterval = setInterval(() => {
                bot.setControlState('forward', true);
                setTimeout(() => {
                    bot.setControlState('forward', false);
                }, 1000);
            }, 10000);
        });

        bot.on('error', (err) => {
            botStatus = 'Hata Aldı!';
            errorMessage = 'Bot hata aldı: ' + err.message;
            console.log('Bot hata aldı: ', err);
        });

        bot.on('end', () => {
            botStatus = 'Kapalı';
            bot = null;
            console.log('Bot sunucudan ayrıldı.');
        });
                // 🎤 Sunucudaki chati dinleme
          bot.on('chat', (username, message) => {
            console.log(`[${username}]: ${message}`);
            io.emit('chatMessage', { username, message }); // Veriyi gerçek zamanlı olarak gönder
          });

        return true;
    }
}

// Bot durumunu kontrol eden endpoint
app.get('/status', (req, res) => {
    res.json({ botActive: !!bot, botStatus, error: errorMessage });
});

// Botu aç/kapat endpoint
app.get('/toggle', (req, res) => {
    const status = toggleBot();
    res.json({ botActive: status, botStatus, error: errorMessage });
});

// Ana sayfayı sun
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🎧 Sunucuyu dinleme
server.listen(port, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
 
});
