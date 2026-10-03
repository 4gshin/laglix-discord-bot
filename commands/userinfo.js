const { SlashCommandBuilder, InteractionContextType, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('İstifadəçi haqqında məlumat verir')
    .addUserOption(o => o.setName('user').setDescription('İstifadəçi (boş qoysan, özün)'))
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle(user.username)
      .setThumbnail(user.displayAvatarURL())
      .setColor(member?.displayColor || 0x5865f2)
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Discorda qoşulub', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true }
      );

    if (member?.joinedTimestamp) {
      embed.addFields({ name: 'Serverə qoşulub', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true });
      const roles = member.roles.cache
        .filter(r => r.id !== interaction.guild.id)
        .map(r => r.toString())
        .slice(0, 15)
        .join(' ');
      embed.addFields({ name: 'Rollar', value: roles || 'Yoxdur' });
    } else {
      embed.setFooter({ text: 'Bu istifadəçi serverdə deyil' });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
