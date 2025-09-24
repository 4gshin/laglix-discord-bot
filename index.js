require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
console.log("🧠 Laglix sistemə qoşuldu.");

  client.user.setActivity('Laglix botu işləyir! 🚀', { type: 'PLAYING' });

  client.user.setStatus('dnd');


  const guild = client.guilds.cache.first();
  if (!guild) return console.log('Bot heç bir serverdə deyil!');

  const channel = guild.systemChannel;
  if (!channel) return console.log('System channel tapılmadı.');

  channel.send('Salam, Laglix aktivdir! 👋');
  
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // !sil
  if (command === '!sil') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('Bu əmri istifadə etmək üçün yetərli icazən yoxdur.');
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('Zəhmət olmasa 1 ilə 100 arasında mesaj sayı daxil et.');
    }

    try {
      await message.channel.bulkDelete(amount + 1);
      const replyMsg = await message.channel.send(`${amount} mesaj silindi.`);
      setTimeout(() => replyMsg.delete(), 3000);
    } catch (err) {
      console.error(err);
      message.reply('14 gündən əvvəlki mesajları silmək mümkün deyil.');
    }
  }
  // !unmute
  else if (command === '!unmute') {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    return message.reply('Bu əmri istifadə etmək üçün "Moderate Members" icazən olmalıdır.');
  }

  const target = message.mentions.members.first();
  if (!target) {
    return message.reply('Zəhmət olmasa, unmute etmək istədiyiniz istifadəçini etiketləyin.');
  }

  try {
    await target.timeout(null); // timeout-u ləğv edir
    message.channel.send(`${target.user.username} artıq susdurulmayıb. 🔊`);
  } catch (err) {
    console.error(err);
    message.reply('Unmute əməliyyatı alınmadı. Botun icazələrini yoxlayın.');
  }
}

// !userinfo
else if (command === '!userinfo') {
  const user = message.mentions.users.first() || message.author;
  const member = message.guild.members.cache.get(user.id);

  message.channel.send(`👤 İstifadəçi: ${user.tag}
🆔 ID: ${user.id}
🎖️ Serverə qoşuldu: ${member.joinedAt.toDateString()}
📅 Discorda qoşuldu: ${user.createdAt.toDateString()}`);
}


// !unban
else if (command === '!unban') {
  if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    return message.reply('Bu əmri istifadə etmək üçün "Ban Members" icazən olmalıdır.');
  }

  const userId = args[0];
  if (!userId) {
    return message.reply('Zəhmət olmasa, banı qaldırmaq istədiyiniz istifadəçinin ID-sini yazın.');
  }

  try {
    await message.guild.bans.remove(userId);
    message.channel.send(`ID-si ${userId} olan istifadəçinin banı qaldırıldı. ✅`);
  } catch (err) {
    console.error(err);
    message.reply('Unban əməliyyatı alınmadı. Düzgün ID yazdığınızdan əmin olun.');
  }
}


  // !mute
  else if (command === '!mute') {
    const target = message.mentions.members.first();
    const duration = parseInt(args[1]);

    if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return message.reply('Bu əmri istifadə etmək sənin başınçun deyil.');
    }

    if (!target || isNaN(duration)) {
      return message.reply('Düzgün istifadə: !mute @istifadeci 5');
    }

    try {
      await target.timeout(duration * 60 * 1000);
      message.channel.send(`${target.user.username} istifadəçisi ${duration} dəqiqəlik susduruldu. 🔇`);
    } catch (err) {
      console.error(err);
      message.reply('Mute əməliyyatı alınmadı. Botda icazə olmaya bilər.');
    }
   if (command === '!unmute') {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    return message.reply('Bu əmri istifadə etmək üçün "Moderate Members" icazən olmalıdır.');
  }

  const target = message.mentions.members.first();
  if (!target) {
    return message.reply('Zəhmət olmasa, unmute etmək istədiyiniz istifadəçini etiketləyin.');
  }

  try {
    await target.timeout(null); // timeout-u ləğv edir
    message.channel.send(`${target.user.username} artıq susdurulmayıb. 🔊`);
  } catch (err) {
    console.error(err);
    message.reply('Unmute əməliyyatı alınmadı. Botun icazələrini yoxlayın.');
  }
}


  }

  // !warn
  else if (command === '!warn') {
    const target = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'Səbəb göstərilməyib';

    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply('Bu əmri istifadə etmək üçün "Moderate Members" icazən olmalıdır.');
    }

    if (!target) {
      return message.reply('Zəhmət olmasa bir istifadəçini etiketlə (məsələn: !warn @user səbəb).');
    }

    message.channel.send(`${target.user.username} istifadəçisinə xəbərdarlıq edildi. : **${reason}** ⚠️`);
  }

  // !ban
  else if (command === '!ban') {
    const target = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'Səbəb göstərilməyib';

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('Bu əmri istifadə etmək üçün "Moderate Members" icazən olmalıdır.');
    }

    if (!target) {
      return message.reply('Zəhmət olmasa bir istifadəçini etiketlə (məsələn: !ban @user səbəb).');
    }

    try {
      await target.ban({ reason });
      message.channel.send(`${target.user.username} istifadəçisi serverdən azad olundu. ❌`);
    } catch (err) {
      console.error(err);
      message.reply('Ban əməliyyatı alınmadı. Botda icazə olmaya bilər.');
    }
    if (command === '!unban') {
  if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    return message.reply('Bu əmri istifadə etmək üçün "Ban Members" icazən olmalıdır.');
  }

  const userId = args[0];
  if (!userId) {
    return message.reply('Zəhmət olmasa, banı qaldırmaq istədiyiniz istifadəçinin ID-sini yazın.');
  }

  try {
    await message.guild.bans.remove(userId);
    message.channel.send(`ID-si ${userId} olan istifadəçinin banı qaldırıldı. ✅`);
  } catch (err) {
    console.error(err);
    message.reply('Unban əməliyyatı alınmadı. Düzgün ID yazdığınızdan əmin olun.');
  }
}

  }

  // !yardim
  else if (command === '!yardim') {
    message.channel.send(`
📜 **Mövcud Əmrlər:**
> !sil [sayı] – Mesajları sil  
> !mute @istifadeci [dəqiqə] – Müvəqqəti susdur  
> !warn @istifadeci [səbəb] – Xəbərdarlıq ver  
> !ban @istifadeci [səbəb] – Banla  
> !yardim – Bütün komandaları göstər
> !userinfo - İstifadəçi haqqında məlumat verir
    `);
  }
});





    

client.login(process.env.TOKEN);
