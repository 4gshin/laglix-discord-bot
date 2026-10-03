const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, EmbedBuilder, MessageFlags } = require('discord.js');
const { getWarnings } = require('../utils/warnings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('İstifadəçinin xəbərdarlıqlarını göstərir')
    .addUserOption(o => o.setName('user').setDescription('İstifadəçi').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const list = getWarnings(interaction.guildId, user.id);

    if (!list.length) {
      return interaction.reply({ content: `✅ **${user.username}** istifadəçisinin xəbərdarlığı yoxdur.`, flags: MessageFlags.Ephemeral });
    }

    // Embed sahəsi limiti 4096 simvoldur, ona görə son 10-u göstəririk
    const lines = list
      .slice(-10)
      .map((w, i) => `**${list.length - Math.min(10, list.length) + i + 1}.** ${w.reason}\n<t:${Math.floor(w.date / 1000)}:R> · <@${w.moderatorId}>`)
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ ${user.username} – ${list.length} xəbərdarlıq`)
      .setDescription(lines)
      .setColor(0xf39c12);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
};
