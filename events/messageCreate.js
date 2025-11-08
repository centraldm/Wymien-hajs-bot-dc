const { Events } = require('discord.js');
const path = require('path');
const { repSessions } = require(path.join(__dirname, '..', 'commands', 'rep'));

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // Nie działaj na wiadomościach od botów
    if (message.author.bot) return;

    // ID kanału legit check (potwierdzone)
    const legitCheckChannelId = '1286040567221846121';
    if (message.channel.id !== legitCheckChannelId) return;

    // Szukamy, czy autor wiadomości ma otwartą sesję rep (jest właścicielem ticketu)
    for (const [userId, session] of repSessions.entries()) {
      // akceptujemy +rep rozpoczęte tym prefiksem i musimy upewnić się, że autorem jest właściciel
      if (message.author.id !== userId) continue;
      if (!message.content.trim().toLowerCase().startsWith('+rep')) continue;

      try {
        const ticketChannel = await message.client.channels.fetch(session.ticketChannelId);
        if (ticketChannel) {
          await ticketChannel.send(`✅ Legit check wystawiony przez <@${userId}> — zamykam ticket za 10 sekund.`);
          setTimeout(() => ticketChannel.delete().catch(() => {}), 10000);
        }
      } catch (err) {
        console.error('❌ Nie udało się zamknąć ticketa po +rep:', err);
      }

      repSessions.delete(userId);
      break;
    }
  },
};
