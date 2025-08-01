const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField,
} = require('discord.js');

const ADMIN_ID = '944198199453814834';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Dodaje użytkownika do czarnej listy (tylko dla administratora).')
    .addUserOption(option =>
      option.setName('użytkownik')
        .setDescription('Osoba do zblacklistowania')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('powód')
        .setDescription('Powód dodania na czarną listę')
        .setRequired(true)),

  async execute(interaction) {
    if (interaction.user.id !== ADMIN_ID) {
      return await interaction.reply({
        content: '❌ Nie masz uprawnień do użycia tej komendy.',
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser('użytkownik');
    const reason = interaction.options.getString('powód');

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('🏴‍☠️ Wymień Hajs × BLACKLISTA')
      .setDescription(
        `**NICK:** <@${user.id}>\n` +
        `**ID:** \`${user.id}\`\n\n` +
        `**POWÓD:** ${reason}\n\n` +
        `Wystawione przez administratora: ${interaction.user.tag}`
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true }));

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('usun_blacklist')
        .setLabel('🗡️ Kliknij, aby usunąć.')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('odwolaj_blacklist')
        .setLabel('Kliknij, aby się odwołać.')
        .setStyle(ButtonStyle.Secondary),
    );

    try {
      await interaction.channel.send({
        embeds: [embed],
        components: [row],
      });

      await interaction.reply({
        content: '✅ Użytkownik został dodany do czarnej listy.',
        ephemeral: true,
      });

    } catch (error) {
      console.error('❌ Błąd przy wysyłaniu wiadomości na kanał:', error);

      await interaction.reply({
        content: '❌ Wystąpił błąd podczas wysyłania wiadomości. Sprawdź uprawnienia bota!',
        ephemeral: true,
      });
    }
  },
};
