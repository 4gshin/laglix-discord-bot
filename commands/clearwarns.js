const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { fail, logEmbed, sendLog } = require('../utils/moderation');
const { clearWarnings } = require('../utils/warnings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarns')
    .setDescription('İstifadəçinin bütün xəbərdarlıqlarını silir')
    .addUserOption(o => o.setName('user').setDescription('İstifadəçi').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const count = clearWarnings(interaction.guildId, user.id);

    if (!count) return fail(interaction, 'Bu istifadəçinin silinəcək xəbərdarlığı yoxdur.');

    await interaction.reply(`🧹 **${user.username}** istifadəçisinin ${count} xəbərdarlığı silindi.`);
    await sendLog(
      interaction.guild,
      logEmbed({
        title: '🧹 Warns silindi',
        color: 0x95a5a6,
        moderator: interaction.user,
        target: user,
        reason: `${count} xəbərdarlıq silindi`
      })
    );
  }
};
