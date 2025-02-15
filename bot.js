const express = require('express');
const mineflayer = require('mineflayer');

// Express uygulaması
const app = express();
const port = 3000;

// Minecraft botu değişkeni
let bot;

// Botu başlatmak için fonksiyon
function startBot() {
  bot = mineflayer.createBot({
    host: 'sunucu_adresi',  // Minecraft sunucusunun IP adresi veya domaini
    port: 25565,            // Sunucunun portu
    username: 'bot_adi',    // Botun ismi
    version: '1.16.5'       // Minecraft sürümü
  });

  bot.on('spawn', () => {
    console.log('Bot başarıyla sunucuya bağlandı!');
  });

  bot.on('error', (err) => {
    console.log('Bot hata aldı: ', err);
  });

  bot.on('end', () => {
    console.log('Bot sunucudan ayrıldı.');
  });

  // Botu hareket ettirerek AFK olmasını engelle
  setInterval(() => {
    bot.setControlState('forward', true);  // Botu ileri hareket ettir
    setTimeout(() => {
      bot.setControlState('forward', false);  // Hareketi durdur
    }, 1000);  // 1 saniye sonra hareketi durdur
  }, 10000);  // Her 10 saniyede bir hareket et
}

// Express.js sunucusunu başlat
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);

  // Express başlatıldığında botu çalıştır
  startBot();
});
