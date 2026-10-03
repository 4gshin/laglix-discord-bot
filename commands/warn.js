const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { fail, checkHierarchy, dmUser, logEmbed, sendLog } = require('../utils/moderation');
const { addWarning } = require('../utils/warnings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('İstifadəçiyə xəbərdarlıq verir və qeyd edir')
    .addUserOption(o => o.setName('user').setDescription('İstifadəçi').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Səbəb').setRequired(true).setMaxLength(400))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const member = interaction.options.getMember('user');

    if (!member) return fail(interaction, 'Bu istifadəçi serverdə deyil.');
    if (user.bot) return fail(interaction, 'Botlara xəbərdarlıq vermək olmaz.');

    const err = checkHierarchy(interaction, member);
    if (err) return fail(interaction, err);

    const total = addWarning(interaction.guildId, user.id, { moderatorId: interaction.user.id, reason });

    await dmUser(user, `⚠️ **${interaction.guild.name}** serverində xəbərdarlıq aldın.\nSəbəb: ${reason}`);
    await interaction.reply(`⚠️ **${user.username}** istifadəçisinə xəbərdarlıq verildi (cəmi: ${total}). Səbəb: ${reason}`);
    await sendLog(
      interaction.guild,
      logEmbed({
        title: '⚠️ Warn',
        color: 0xf39c12,
        moderator: interaction.user,
        target: user,
        reason,
        extra: `Ümumi xəbərdarlıq sayı: ${total}`
      })
    );
  }
};
