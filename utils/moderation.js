const { EmbedBuilder, MessageFlags } = require('discord.js');

// Yalnız əmri yazan adama görünən xəta mesajı
function fail(interaction, msg) {
  const payload = { content: `❌ ${msg}` };
  if (interaction.deferred || interaction.replied) return interaction.editReply(payload);
  return interaction.reply({ ...payload, flags: MessageFlags.Ephemeral });
}

// Rol iyerarxiyası yoxlaması. Problem varsa mesaj qaytarır, yoxdursa null.
function checkHierarchy(interaction, target) {
  const mod = interaction.member;
  const guild = interaction.guild;
  const me = guild.members.me;

  if (target.id === mod.id) return 'Bu əmri özünə qarşı işlədə bilməzsən.';
  if (target.id === interaction.client.user.id) return 'Mənə qarşı bu əmri işlətmək olmaz 😄';
  if (target.id === guild.ownerId) return 'Server sahibinə qarşı bu əmri işlətmək olmaz.';

  if (guild.ownerId !== mod.id && mod.roles.highest.comparePositionTo(target.roles.highest) <= 0) {
    return 'Bu istifadəçinin rolu səninkindən yüksək və ya bərabərdir.';
  }
  if (me.roles.highest.comparePositionTo(target.roles.highest) <= 0) {
    return 'Mənim rolum bu istifadəçidən yüksək deyil. Server ayarlarında Laglix rolunu yuxarı çək.';
  }
  return null;
}

// İstifadəçiyə DM göndərir, bağlıdırsa səssizcə keçir
async function dmUser(user, text) {
  try {
    await user.send(text);
    return true;
  } catch {
    return false;
  }
}

function logEmbed({ title, color, moderator, target, reason, extra }) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(color)
    .addFields(
      { name: 'Moderator', value: `${moderator} (${moderator.id})`, inline: true },
      { name: 'Hədəf', value: `${target} (${target.id})`, inline: true },
      { name: 'Səbəb', value: reason || 'Səbəb göstərilməyib' }
    )
    .setTimestamp();
  if (extra) embed.addFields({ name: 'Əlavə', value: extra });
  return embed;
}

// Mod-log kanalına yazır (LOG_CHANNEL_ID verilibsə)
async function sendLog(guild, embed) {
  const id = process.env.LOG_CHANNEL_ID;
  if (!id) return;
  const channel = await guild.channels.fetch(id).catch(() => null);
  if (channel && channel.isTextBased()) {
    await channel.send({ embeds: [embed] }).catch(console.error);
  }
}

module.exports = { fail, checkHierarchy, dmUser, logEmbed, sendLog };
