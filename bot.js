const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'sunucu_adresi',  // Minecraft sunucusunun IP adresi veya domaini
  port: 25565,            // Sunucunun portu (genellikle 25565)
  username: 'bot_adi',    // Botun ismi
  version: '1.16.5'       // Minecraft sürümü
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
