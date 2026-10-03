const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { fail, checkHierarchy, dmUser, logEmbed, sendLog } = require('../utils/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('İstifadəçini müvəqqəti susdurur (timeout)')
    .addUserOption(o => o.setName('user').setDescription('Susdurulacaq istifadəçi').setRequired(true))
    .addIntegerOption(o =>
      o.setName('minutes').setDescription('Müddət (dəqiqə, maks. 28 gün)').setRequired(true).setMinValue(1).setMaxValue(40320)
    )
    .addStringOption(o => o.setName('reason').setDescription('Səbəb').setMaxLength(400))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const minutes = interaction.options.getInteger('minutes');
    const reason = interaction.options.getString('reason') ?? 'Səbəb göstərilməyib';
    const member = interaction.options.getMember('user');

    if (!member) return fail(interaction, 'Bu istifadəçi serverdə deyil.');

    const err = checkHierarchy(interaction, member);
    if (err) return fail(interaction, err);
    if (!member.moderatable) return fail(interaction, 'Bu istifadəçini susdurmaq mümkün deyil.');

    try {
      await member.timeout(minutes * 60 * 1000, `${interaction.user.username}: ${reason}`);
    } catch (e) {
      console.error(e);
      return fail(interaction, 'Mute alınmadı. Botun "Moderate Members" icazəsini yoxla.');
    }
    await interaction.reply(`🔇 **${user.username}** ${minutes} dəqiqəlik susduruldu. Səbəb: ${reason}`);
    await dmUser(user, `🔇 **${interaction.guild.name}** serverində ${minutes} dəqiqəlik susdurulmusan.\nSəbəb: ${reason}`);
    await sendLog(
      interaction.guild,
      logEmbed({
        title: '🔇 Mute',
        color: 0xf1c40f,
        moderator: interaction.user,
        target: user,
        reason,
        extra: `Müddət: ${minutes} dəqiqə`
      })
    );
  }
};
