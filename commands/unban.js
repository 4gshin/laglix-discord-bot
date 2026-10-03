const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { fail, logEmbed, sendLog } = require('../utils/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('İstifadəçinin banını qaldırır')
    .addStringOption(o => o.setName('user_id').setDescription('İstifadəçinin ID-si').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Səbəb').setMaxLength(400))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const userId = interaction.options.getString('user_id').trim();
    const reason = interaction.options.getString('reason') ?? 'Səbəb göstərilməyib';

    if (!/^\d{17,20}$/.test(userId)) return fail(interaction, 'Düzgün istifadəçi ID-si yaz (yalnız rəqəmlər).');

    const ban = await interaction.guild.bans.fetch(userId).catch(() => null);
    if (!ban) return fail(interaction, 'Bu ID ban siyahısında tapılmadı.');

    try {
      await interaction.guild.members.unban(userId, `${interaction.user.username}: ${reason}`);
    } catch (err) {
      console.error(err);
      return fail(interaction, 'Unban alınmadı. Botun "Ban Members" icazəsini yoxla.');
    }

    await interaction.reply(`✅ **${ban.user.username}** istifadəçisinin banı qaldırıldı.`);
    await sendLog(
      interaction.guild,
      logEmbed({ title: '✅ Unban', color: 0x2ecc71, moderator: interaction.user, target: ban.user, reason })
    );
  }
};
