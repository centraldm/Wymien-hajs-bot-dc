const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('menu')
    .setDescription('Wyświetla menu tworzenia ticketa'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📩 Wymień Hajs × STWÓRZ TICKET')
      .setDescription('Jeżeli chcesz stworzyć ticketa, wybierz opcję z poniższego menu.')
      .setImage('https://i.imgur.com/XNg7Y61.jpeg')
      .setColor('#ff0000');

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_select')
      .setPlaceholder('📨 Wybierz powód utworzenia ticketa')
      .addOptions([
        {
          label: 'Wymiana',
          value: 'wymiana',
          description: 'Rozpocznij wymianę',
          emoji: '💸',
        },
        {
          label: 'Pomoc',
          value: 'pomoc',
          description: 'Skontaktuj się z administracją',
          emoji: '🆘',
        },
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Ukryj użycie komendy
    await interaction.deferReply({ ephemeral: true });

    // Wyślij embed jako wiadomość bota
    await interaction.channel.send({
      embeds: [embed],
      components: [row],
    });

    // Usuń ephemeral reply
    await interaction.deleteReply();
  },
};
