const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Mövcud əmrlərin siyahısı')
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    // Əmrlər avtomatik siyahıya düşür, yeni əmr əlavə edəndə burada dəyişmək lazım deyil
    const lines = interaction.client.commands
      .map(c => `\`/${c.data.name}\` – ${c.data.description}`)
      .join('\n');

    await interaction.reply({ content: `📜 **Laglix əmrləri:**\n${lines}`, flags: MessageFlags.Ephemeral });
  }
};
