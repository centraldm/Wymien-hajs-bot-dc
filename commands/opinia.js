const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('opinia')
    .setDescription('Wystaw opinię o wymianie.')
    .addStringOption(option =>
      option.setName('czas_realizacji')
        .setDescription('Ocena czasu realizacji (np. ⭐⭐⭐⭐⭐)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('przebieg_wymiany')
        .setDescription('Ocena przebiegu wymiany (np. ⭐⭐⭐⭐⭐)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('obsluga_klienta')
        .setDescription('Ocena obsługi klienta (np. ⭐⭐⭐⭐⭐)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('opinia')
        .setDescription('Twoja opinia tekstowa')
        .setRequired(true)),

  async execute(interaction) {
    const czas = interaction.options.getString('czas_realizacji');
    const przebieg = interaction.options.getString('przebieg_wymiany');
    const obsluga = interaction.options.getString('obsluga_klienta');
    const opinia = interaction.options.getString('opinia');

    const embed = new EmbedBuilder()
      .setColor('#ff0000') // czerwony kolor
      .setAuthor({
        name: '⭐ WYMIEŃ HAJS × OPINIA',
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`\`\`\`${opinia}\`\`\``)
      .addFields(
        { name: 'CZAS REALIZACJI:', value: `${czas}`, inline: false },
        { name: 'PRZEBIEG WYMIANY:', value: `${przebieg}`, inline: false },
        { name: 'OBSŁUGA KLIENTA:', value: `${obsluga}`, inline: false },
      )
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: interaction.user.tag });

    await interaction.reply({
      content: `<@${interaction.user.id}> APL`,
      embeds: [embed],
    });
  },
};
