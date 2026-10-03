const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { fail, checkHierarchy, dmUser, logEmbed, sendLog } = require('../utils/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('İstifadəçini serverdən çıxarır')
    .addUserOption(o => o.setName('user').setDescription('Çıxarılacaq istifadəçi').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Səbəb').setMaxLength(400))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') ?? 'Səbəb göstərilməyib';
    const member = interaction.options.getMember('user');

    if (!member) return fail(interaction, 'Bu istifadəçi serverdə deyil.');

    const err = checkHierarchy(interaction, member);
    if (err) return fail(interaction, err);
    if (!member.kickable) return fail(interaction, 'Bu istifadəçini serverdən çıxarmaq mümkün deyil.');

    await dmUser(user, `👢 **${interaction.guild.name}** serverindən çıxarıldın.\nSəbəb: ${reason}`);

    try {
      await member.kick(`${interaction.user.username}: ${reason}`);
    } catch (e) {
      console.error(e);
      return fail(interaction, 'Kick alınmadı. Botun "Kick Members" icazəsini yoxla.');
    }

    await interaction.reply(`👢 **${user.username}** serverdən çıxarıldı. Səbəb: ${reason}`);
    await sendLog(
      interaction.guild,
      logEmbed({ title: '👢 Kick', color: 0xe67e22, moderator: interaction.user, target: user, reason })
    );
  }
};
