const { Events } = require('discord.js');
const { repSessions } = require('../commands/rep');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const legitChannelId = '1286040567221846121';
    if (message.channel.id !== legitChannelId) return;

    const content = message.content.toLowerCase();
    const expectedPhrase = '+rep @centraldm';

    // Czy wiadomość zawiera frazę?
    if (!content.includes(expectedPhrase)) return;

    const userId = message.author.id;

    // Sprawdź czy mamy aktywną sesję /rep
    if (!repSessions.has(userId)) return;

    const channelIdToDelete = repSessions.get(userId);
    repSessions.delete(userId);

    try {
      const channel = await message.client.channels.fetch(channelIdToDelete);
      if (channel) {
        await channel.delete('Kanał zamknięty po wystawieniu legit checka.');
      }
    } catch (err) {
      console.error('❌ Błąd podczas próby usunięcia kanału po legit checku:', err);
    }
  },
};
