require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Events, ActivityType, MessageFlags } = require('discord.js');
const { loadCommands } = require('./utils/loadCommands');

if (!process.env.TOKEN) {
  console.error('❌ .env faylında TOKEN yoxdur. .env.example faylına bax.');
  process.exit(1);
}

// Slash commands üçün yalnız Guilds intent-i kifayətdir.
// MessageContent, GuildMembers, GuildPresences artıq lazım deyil.
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
for (const cmd of loadCommands()) client.commands.set(cmd.data.name, cmd);

client.once(Events.ClientReady, c => {
  console.log(`🧠 ${c.user.tag} sistemə qoşuldu. ${client.commands.size} əmr yükləndi.`);
  c.user.setPresence({
    activities: [{ name: 'Serveri qoruyur 🛡️', type: ActivityType.Playing }],
    status: 'dnd'
  });
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`/${interaction.commandName} əmrində xəta:`, err);
    const msg = { content: '❌ Əmr icra olunarkən gözlənilməz xəta baş verdi.', flags: MessageFlags.Ephemeral };
    if (interaction.replied || interaction.deferred) await interaction.followUp(msg).catch(() => {});
    else await interaction.reply(msg).catch(() => {});
  }
});

// Bir xəta botu söndürməsin
process.on('unhandledRejection', err => console.error('Unhandled rejection:', err));
process.on('uncaughtException', err => console.error('Uncaught exception:', err));

client.login(process.env.TOKEN);
