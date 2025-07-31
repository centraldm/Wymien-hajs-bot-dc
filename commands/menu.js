const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Wyślij system tworzenia ticketów'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📩 Wymień Hajs × STWÓRZ TICKET')
      .setDescription('Jeżeli chcesz stworzyć ticketa, to wybierz opcję z **poniższego menu.**')
      .setColor('#ff0000');

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_select')
      .setPlaceholder('❌ » Nie wybrałeś/aś żadnej opcji.')
      .addOptions(
        {
          label: 'Wymiana',
          value: 'wymiana',
          description: 'Kliknij, aby dokonać wymiany!',
          emoji: '1400550053596364910', // bez <> i nazwy
        },
        {
          label: 'Pomoc',
          value: 'pomoc',
          description: 'Kliknij, aby otrzymać pomoc!',
          emoji: '❗',
        },
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: false // ustaw na false jeśli ma być publiczne
    });
  },
};
