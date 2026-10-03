const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'warnings.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return {};
  }
}

function save(data) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function getWarnings(guildId, userId) {
  const data = load();
  return data[guildId]?.[userId] ?? [];
}

// Yeni xəbərdarlıq əlavə edir, ümumi sayı qaytarır
function addWarning(guildId, userId, entry) {
  const data = load();
  data[guildId] ??= {};
  data[guildId][userId] ??= [];
  data[guildId][userId].push({ ...entry, date: Date.now() });
  save(data);
  return data[guildId][userId].length;
}

function clearWarnings(guildId, userId) {
  const data = load();
  const count = data[guildId]?.[userId]?.length ?? 0;
  if (count) {
    delete data[guildId][userId];
    save(data);
  }
  return count;
}

module.exports = { getWarnings, addWarning, clearWarnings };
