const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { clientId, guildId, token } = require('./config.json');

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[UWAGA] Komenda w ${filePath} nie ma właściwości "data" lub "execute".`);
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('⏳ Rejestruję komendy aplikacji (GUILD)...');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
    console.log('✅ Komendy zostały pomyślnie zarejestrowane.');
  } catch (error) {
    console.error('❌ Błąd przy rejestracji komend:', error);
  }
})();
