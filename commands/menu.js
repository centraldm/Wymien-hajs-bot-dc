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
      .setTitle('💌 WW Exchange × STWÓRZ TICKET')
      .setDescription(
        'Jeżeli chcesz stworzyć ticketa, wybierz opcję z poniższego menu.'
      )
      .setColor('#083E49')
      .setImage('https://i.imgur.com/PbWh1yJ.jpeg');

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

    // Wyślij embed na kanał, ale NIE jako odpowiedź na interakcję
    const channel = await interaction.channel.send({
      embeds: [embed],
      components: [row],
    });

    // Odpowiedz ephemeral i usuń odpowiedź, żeby Discord nie pokazał „używa /menu”
    await interaction.deferReply({ ephemeral: true });
    await interaction.deleteReply().catch(() => {});
  },
};
