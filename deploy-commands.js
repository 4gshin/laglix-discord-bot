// Slash əmrləri Discord-a qeydiyyatdan keçirir. Yeni əmr əlavə edəndə: npm run deploy
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { loadCommands } = require('./utils/loadCommands');

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!TOKEN || !CLIENT_ID) {
  console.error('❌ .env faylında TOKEN və CLIENT_ID olmalıdır.');
  process.exit(1);
}

const body = loadCommands().map(c => c.data.toJSON());
const rest = new REST().setToken(TOKEN);

(async () => {
  try {
    // GUILD_ID varsa dərhal işləyir (test üçün), yoxdursa qlobal olur
    const route = GUILD_ID
      ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
      : Routes.applicationCommands(CLIENT_ID);
    const data = await rest.put(route, { body });
    console.log(`✅ ${data.length} əmr qeydiyyatdan keçdi ${GUILD_ID ? '(yalnız bu server)' : '(qlobal)'}.`);
  } catch (err) {
    console.error('❌ Qeydiyyat alınmadı:', err);
    process.exit(1);
  }
})();
