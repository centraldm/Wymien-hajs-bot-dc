const { Events } = require('discord.js');
const path = require('path');
const { repSessions } = require(path.join(__dirname, '..', 'commands', 'rep'));

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // Nie działaj na wiadomościach od botów
    if (message.author.bot) return;

    const legitCheckChannelId = '1286040567221846121';
    if (message.channel.id !== legitCheckChannelId) return;

    for (const [userId, session] of repSessions.entries()) {
      const repPattern = new RegExp(`\\+rep\\s+<@!?${userId}>|\\+rep\\s+@centraldm`, 'i');

      if (repPattern.test(message.content)) {
        try {
          const ticketChannel = await message.client.channels.fetch(session.ticketChannelId);
          if (ticketChannel) {
            await ticketChannel.delete('✅ Legit check wystawiony – zamykam ticket');
          }
        } catch (err) {
          console.error('❌ Nie udało się usunąć kanału:', err);
        }

        repSessions.delete(userId); // Usuń sesję po wykonaniu
        break;
      }
    }
  },
};
