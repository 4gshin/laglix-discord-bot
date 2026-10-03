const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { fail, checkHierarchy, logEmbed, sendLog } = require('../utils/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('İstifadəçinin susdurulmasını ləğv edir')
    .addUserOption(o => o.setName('user').setDescription('İstifadəçi').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.options.getMember('user');

    if (!member) return fail(interaction, 'Bu istifadəçi serverdə deyil.');
    if (!member.isCommunicationDisabled()) return fail(interaction, 'Bu istifadəçi susdurulmayıb.');

    const err = checkHierarchy(interaction, member);
    if (err) return fail(interaction, err);

    try {
      await member.timeout(null, `Unmute: ${interaction.user.username}`);
    } catch (e) {
      console.error(e);
      return fail(interaction, 'Unmute alınmadı. Botun "Moderate Members" icazəsini yoxla.');
    }

    await interaction.reply(`🔊 **${user.username}** artıq susdurulmayıb.`);
    await sendLog(
      interaction.guild,
      logEmbed({ title: '🔊 Unmute', color: 0x2ecc71, moderator: interaction.user, target: user })
    );
  }
};
