const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { CLIENT_ID: clientId, GUILD_ID: guildId, DISCORD_TOKEN: token } = process.env;

if (!clientId || !guildId || !token) {
  console.error('❌ Brakuje CLIENT_ID, GUILD_ID lub DISCORD_TOKEN w .env!');
  process.exit(1);
}

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  try {
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`⚠️ Komenda w ${file} nie zawiera właściwości "data" lub "execute".`);
    }
  } catch (err) {
    console.error(`❌ Błąd ładowania komendy z pliku ${file}:`, err);
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`⏳ Rejestruję ${commands.length} komend(y) aplikacji w serwerze GUILD (${guildId})...`);
    
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`✅ Zarejestrowano ${data.length} komend(y) lokalnie (GUILD).`);
  } catch (error) {
    console.error('❌ Błąd przy rejestracji komend:', error);
  }
})();
