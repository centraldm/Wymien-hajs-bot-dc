const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

// Mapa do śledzenia, kto wystawił /rep i komu
const repSessions = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rep')
    .setDescription('Wysyła embed legit checka i zamyka ticket')
    .addUserOption(option =>
      option.setName('użytkownik')
        .setDescription('Osoba do oznaczenia w wiadomości')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('transakcja')
        .setDescription('Np. "LTC to BLIK 100 PLN"')
        .setRequired(true)
    ),

  async execute(interaction) {
    const allowedRoles = ['1393205657087246467', '1400736771989569586'];
    const memberRoles = interaction.member.roles.cache;
    const hasPermission = allowedRoles.some(roleId => memberRoles.has(roleId));

    if (!hasPermission) {
      return await interaction.reply({
        content: '❌ Nie masz uprawnień do użycia tej komendy.',
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser('użytkownik');
    const transakcja = interaction.options.getString('transakcja');
    const targetChannelId = '1401155086864093226';

    const embed = new EmbedBuilder()
      .setColor('#00acff')
      .setTitle('✅ WW EXCHANGE × WYSTAW LEGIT CHECKA')
      .setDescription(
        `Dziękujemy ${user} za skorzystanie z naszych usług.\n` +
        `Prosimy o wystawienie legit checka na kanale: <#${targetChannelId}>\n\n` +
        `**Wzór:**\n+rep @centraldm Exchanged ${transakcja}\n\n` +
        `*Po wystawieniu legit checka ticket zostanie automatycznie zamknięty.*`
      );

    try {
      // Zapisz sesję rep, by messageCreate mógł ją zidentyfikować
      repSessions.set(user.id, {
        ticketChannelId: interaction.channel.id,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minut
      });

      await interaction.channel.send({ embeds: [embed] });

      await interaction.deferReply({ ephemeral: true });
      await interaction.deleteReply();

      // Ustaw awaryjne usunięcie kanału po 10 minutach
      setTimeout(async () => {
        const session = repSessions.get(user.id);
        if (session && session.ticketChannelId === interaction.channel.id) {
          try {
            await interaction.channel.delete('Automatyczne zamknięcie ticketu po 10 minutach od /rep');
            repSessions.delete(user.id);
          } catch (err) {
            console.error('❌ Nie udało się usunąć kanału po czasie:', err);
          }
        }
      }, 10 * 60 * 1000);
    } catch (err) {
      console.error('❌ Błąd przy komendzie /rep:', err);
      await interaction.reply({
        content: '❌ Wystąpił błąd przy wykonaniu komendy.',
        ephemeral: true,
      });
    }
  },

  repSessions, // eksport sesji do użycia w messageCreate
};
