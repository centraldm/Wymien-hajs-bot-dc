
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = []; // Brak slash commandów

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('⏳ Rejestruję (lub czyszczę) komendy aplikacji...');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('✅ Komendy zostały pomyślnie zarejestrowane.');
  } catch (error) {
    console.error('❌ Wystąpił błąd podczas rejestracji komend:', error);
  }
})();
