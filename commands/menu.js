const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('menu')
    .setDescription('Wyślij system tworzenia ticketów'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📩 Wymień Hajs × STWÓRZ TICKET')
      .setDescription('Jeżeli chcesz stworzyć ticketa, to wybierz opcję z **poniższego menu.**')
      .setColor('#ff0000')
      .setImage('https://i.imgur.com/XNg7Y61.jpeg');

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_select')
      .setPlaceholder('❌ » Nie wybrałeś/aś żadnej opcji.')
      .addOptions(
        {
          label: 'Wymiana',
          value: 'wymiana',
          description: 'Kliknij, aby dokonać wymiany!',
          emoji: '💸', // użyj standardowego emoji
        },
        {
          label: 'Pomoc',
          value: 'pomoc',
          description: 'Kliknij, aby otrzymać pomoc!',
          emoji: '❗',
        },
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    // wysyłamy embed do kanału (wszyscy widzą)
    await interaction.channel.send({
      embeds: [embed],
      components: [row],
    });

    // potwierdzenie tylko do autora
    await interaction.reply({
      content: '✅ System tworzenia ticketów został wysłany.',
      ephemeral: true,
    });
  },
};
