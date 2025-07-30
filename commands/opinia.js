const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('opinia')
    .setDescription('Wystaw opinię o wymianie.')
    .addStringOption(option =>
      option.setName('czas_realizacji')
        .setDescription('Ocena czasu realizacji')
        .setRequired(true)
        .addChoices(
          { name: '⭐️', value: '1' },
          { name: '⭐️⭐️', value: '2' },
          { name: '⭐️⭐️⭐️', value: '3' },
          { name: '⭐️⭐️⭐️⭐️', value: '4' },
          { name: '⭐️⭐️⭐️⭐️⭐️', value: '5' },
        )
    )
    .addStringOption(option =>
      option.setName('przebieg_wymiany')
        .setDescription('Ocena przebiegu wymiany')
        .setRequired(true)
        .addChoices(
          { name: '⭐️', value: '1' },
          { name: '⭐️⭐️', value: '2' },
          { name: '⭐️⭐️⭐️', value: '3' },
          { name: '⭐️⭐️⭐️⭐️', value: '4' },
          { name: '⭐️⭐️⭐️⭐️⭐️', value: '5' },
        )
    )
    .addStringOption(option =>
      option.setName('obsluga_klienta')
        .setDescription('Ocena obsługi klienta')
        .setRequired(true)
        .addChoices(
          { name: '⭐️', value: '1' },
          { name: '⭐️⭐️', value: '2' },
          { name: '⭐️⭐️⭐️', value: '3' },
          { name: '⭐️⭐️⭐️⭐️', value: '4' },
          { name: '⭐️⭐️⭐️⭐️⭐️', value: '5' },
        )
    )
    .addStringOption(option =>
      option.setName('opinia')
        .setDescription('Twoja opinia tekstowa')
        .setRequired(true)
    ),

  async execute(interaction) {
    const czas = interaction.options.getString('czas_realizacji');
    const przebieg = interaction.options.getString('przebieg_wymiany');
    const obsluga = interaction.options.getString('obsluga_klienta');
    const opinia = interaction.options.getString('opinia');

    const embed = new EmbedBuilder()
      .setColor('#ff0000') // czerwony
      .setAuthor({
        name: '⭐ WYMIEŃ HAJS × OPINIA',
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`\`\`\`${opinia}\`\`\``)
      .addFields(
        { name: 'CZAS REALIZACJI:', value: '⭐️'.repeat(Number(czas)), inline: false },
        { name: 'PRZEBIEG WYMIANY:', value: '⭐️'.repeat(Number(przebieg)), inline: false },
        { name: 'OBSŁUGA KLIENTA:', value: '⭐️'.repeat(Number(obsluga)), inline: false },
      )
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: `${interaction.user.username} | ${new Date().toLocaleString('pl-PL')}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      });

    await interaction.reply({
      content: `<@${interaction.user.id}> APL`, // tag użytkownika + skrót
      embeds: [embed],
      ephemeral: false, // widoczna publicznie
    });
  },
};
