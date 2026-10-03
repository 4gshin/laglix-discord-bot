# 🤖 Laglix Bot

Kiçik Discord communitylər üçün sadə moderasiya botu. Slash commands ilə işləyir (`discord.js` v14).

## ✨ Əmrlər

| Əmr | İcazə | Təsvir |
|---|---|---|
| `/ban` | Ban Members | İstifadəçini banlayır (mesaj silmə seçimi ilə) |
| `/unban` | Ban Members | ID ilə banı qaldırır |
| `/kick` | Kick Members | Serverdən çıxarır |
| `/mute` / `/unmute` | Moderate Members | Timeout verir / ləğv edir |
| `/warn` | Moderate Members | Xəbərdarlıq verir və yadda saxlayır |
| `/warnings` | Moderate Members | Xəbərdarlıqlara baxır |
| `/clearwarns` | Moderate Members | Xəbərdarlıqları silir |
| `/clear` | Manage Messages | 1-100 mesaj silir |
| `/userinfo` | – | İstifadəçi məlumatı |
| `/help` | – | Əmrlərin siyahısı |

**Təhlükəsizlik:** rol iyerarxiyası yoxlanır (moderator özündən yüksək rola, server sahibinə, özünə və ya bota əmr işlədə bilməz). Cəza zamanı istifadəçiyə DM gedir, `LOG_CHANNEL_ID` verilibsə mod-log kanalına yazılır.

## 🚀 Quraşdırma

Node.js **v18+** lazımdır.

```bash
git clone https://github.com/4gshin/laglix-discord-bot.git
cd laglix-discord-bot
npm install
cp .env.example .env     # sonra .env faylını doldur
npm run deploy           # slash əmrləri qeydiyyatdan keçir (yalnız ilk dəfə və ya əmr dəyişəndə)
npm start
```

### Botu serverə əlavə etmək

Developer Portal → OAuth2 → URL Generator:
- Scopes: `bot`, `applications.commands`
- Bot Permissions: Ban Members, Kick Members, Moderate Members, Manage Messages, View Channels, Send Messages, Embed Links

Server ayarlarında **Laglix rolunu moderasiya edəcəyi rolların üstünə çək**, əks halda ban/kick/mute işləməz.

## 📁 Struktur

```
index.js              # botun giriş nöqtəsi
deploy-commands.js    # slash əmrlərin qeydiyyatı
commands/             # hər əmr ayrı fayl
utils/                # yardımçı funksiyalar (iyerarxiya, log, warn saxlanması)
data/                 # warnings.json (avtomatik yaranır, Git-ə düşmür)
```

Yeni əmr əlavə etmək üçün `commands/` qovluğunda `data` və `execute` ixrac edən fayl yaz, sonra `npm run deploy` işlət.

## 📜 Lisenziya

MIT
