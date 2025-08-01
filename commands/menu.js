const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('menu')
    .setDescription('Wyślij menu wyboru powodu utworzenia ticketa'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('💌 Wymień Hajs × STWÓRZ TICKET')
      .setDescription(
        'Jeżeli chcesz stworzyć ticketa, wybierz opcję z poniższego menu.'
      )
      .setColor('#ff0000')
      .setImage('https://i.imgur.com/XNg7Y61.jpeg');

    const select = new StringSelectMenuBuilder()
      .setCustomId('ticket_select')
      .setPlaceholder('✉️ Wybierz powód utworzenia ticketa')
      .addOptions([
        {
          label: 'Wymiana',
          value: 'wymiana',
          description: 'Rozpocznij wymianę',
          emoji: '<:exchange:1400550053596364910>',
        },
        {
          label: 'Pomoc',
          value: 'pomoc',
          description: 'Skontaktuj się z administracją',
          emoji: '🆘',
        },
      ]);

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
