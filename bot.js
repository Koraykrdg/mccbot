const express = require('express');
const mineflayer = require('mineflayer');

// Express uygulaması
const app = express();
const port = 3000;


function startBot() {

    const bot = mineflayer.createBot({
  host: 'mc.toxiox.rf.gd',  // Minecraft sunucusunun IP adresi veya domaini
  port: 28202,            // Sunucunun portu (genellikle 25565)
  username: 'txtsv',    // Botun ismi
  version: '1.21.4'       // Minecraft sürümü
});

bot.on('spawn', () => {
  console.log('Bot başarıyla sunucuya bağlandı!');

  // Botu her 10 saniyede bir hareket ettirerek AFK olmasını engelliyoruz
  setInterval(() => {
    bot.setControlState('forward', true);  // Botu ileri hareket ettir
    setTimeout(() => {
      bot.setControlState('forward', false);  // Hareketi durdur
    }, 1000);  // 1 saniye sonra hareketi durdur
  }, 10000);  // Her 10 saniyede bir hareket et
});

bot.on('error', (err) => {
  console.log('Bot hata aldı: ', err);
});

bot.on('end', () => {
  console.log('Bot sunucudan ayrıldı.');
});

  
}


// Express.js sunucusunu başlat
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);

  // Express başlatıldığında botu çalıştır
startBot();
});
