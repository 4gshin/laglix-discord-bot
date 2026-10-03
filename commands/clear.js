const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');
const { fail } = require('../utils/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Kanalda mesajları kütləvi silir')
    .addIntegerOption(o =>
      o.setName('amount').setDescription('Silinəcək mesaj sayı (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    if (!interaction.channel?.isTextBased() || !interaction.channel.bulkDelete) {
      return fail(interaction, 'Bu kanalda mesaj silmək mümkün deyil.');
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      // true = 14 gündən köhnə mesajları keç (Discord onları kütləvi silmir)
      const deleted = await interaction.channel.bulkDelete(amount, true);
      let text = `🗑️ ${deleted.size} mesaj silindi.`;
      if (deleted.size < amount) text += '\n(14 gündən köhnə mesajlar Discord tərəfindən kütləvi silinmir.)';
      await interaction.editReply(text);
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Mesajlar silinmədi. Botun bu kanalda "Manage Messages" icazəsini yoxla.');
    }
  }
};
