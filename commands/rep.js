const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

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

    const targetChannelId = '1286040567221846121';

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('✅ Wymień Hajs × WYSTAW LEGIT CHECKA')
      .setDescription(
        `Dziękujemy ${user} za skorzystanie z naszych usług.\n` +
        `Prosimy o wystawienie legit checka na kanale: <#${targetChannelId}>\n\n` +
        `**Wzór:**\n+rep ${user} Exchanged ${transakcja}\n\n` +
        `*Po wystawieniu legit checka ticket zostanie automatycznie zamknięty.*`
      );

    try {
      const targetChannel = await interaction.client.channels.fetch(targetChannelId);
      if (!targetChannel) throw new Error('Nie można znaleźć kanału docelowego.');

      // Wyślij embed do kanału legit check
      await targetChannel.send({ embeds: [embed] });

      // Ukryj odpowiedź użytkownika
      await interaction.deferReply({ ephemeral: true });
      await interaction.deleteReply();

      // Zaplanuj usunięcie kanału po 10 minutach
      setTimeout(async () => {
        try {
          await interaction.channel.delete('Automatyczne zamknięcie ticketu po 10 minutach od /rep');
        } catch (err) {
          console.error('❌ Nie udało się usunąć kanału:', err);
        }
      }, 10 * 60 * 1000); // 10 minut

    } catch (error) {
      console.error('❌ Błąd przy wykonaniu komendy /rep:', error);
      await interaction.reply({
        content: '❌ Wystąpił błąd przy wysyłaniu wiadomości lub usuwaniu kanału.',
        ephemeral: true,
      });
    }
  },
};
