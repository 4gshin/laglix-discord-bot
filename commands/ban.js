const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { fail, checkHierarchy, dmUser, logEmbed, sendLog } = require('../utils/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('İstifadəçini serverdən qadağan edir')
    .addUserOption(o => o.setName('user').setDescription('Banlanacaq istifadəçi').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Səbəb').setMaxLength(400))
    .addIntegerOption(o =>
      o.setName('delete_days').setDescription('Neçə günlük mesajları silinsin (0-7)').setMinValue(0).setMaxValue(7)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') ?? 'Səbəb göstərilməyib';
    const days = interaction.options.getInteger('delete_days') ?? 0;
    const member = interaction.options.getMember('user'); // serverdə yoxdursa null

    if (user.id === interaction.user.id) return fail(interaction, 'Özünü banlaya bilməzsən.');

    if (member) {
      const err = checkHierarchy(interaction, member);
      if (err) return fail(interaction, err);
      if (!member.bannable) return fail(interaction, 'Bu istifadəçini banlamaq mümkün deyil.');
    }

    await dmUser(user, `🔨 **${interaction.guild.name}** serverindən qadağan edildin.\nSəbəb: ${reason}`);

    try {
      await interaction.guild.members.ban(user, {
        reason: `${interaction.user.username}: ${reason}`,
        deleteMessageSeconds: days * 86400
      });
    } catch (err) {
      console.error(err);
      return fail(interaction, 'Ban alınmadı. Botun "Ban Members" icazəsini yoxla.');
    }

    await interaction.reply(`🔨 **${user.username}** serverdən qadağan edildi. Səbəb: ${reason}`);
    await sendLog(
      interaction.guild,
      logEmbed({ title: '🔨 Ban', color: 0xe74c3c, moderator: interaction.user, target: user, reason })
    );
  }
};
