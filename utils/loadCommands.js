const fs = require('fs');
const path = require('path');

// commands/ qovluğundakı bütün əmrləri yükləyir
function loadCommands() {
  const dir = path.join(__dirname, '..', 'commands');
  const commands = [];
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    const cmd = require(path.join(dir, file));
    if (cmd.data && cmd.execute) commands.push(cmd);
    else console.warn(`⚠️ ${file} faylında "data" və ya "execute" yoxdur, keçildi.`);
  }
  return commands;
}

module.exports = { loadCommands };
