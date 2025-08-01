const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField
} = require('discord.js');

const ADMIN_ID = '944198199453814834'; // ← 🔴 ZAMIEŃ to na swoje ID użytkownika!

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
    // 🔒 Sprawdzenie czy osoba to Ty
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
      .setTitle('🏴‍☠️ Wymień Flote × BLACKLISTA')
      .setDescription(
        `**NICK:** <@${user.id}>\n` +
        `**ID:** ${user.id}\n\n` +
        `**POWÓD:** ${reason}\n\n` +
        `Wystawione przez administratora: ${interaction.user.tag}`
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true }));

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('usun_blacklist')
        .setLabel('❌ Kliknij, aby usunąć.')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('odwolaj_blacklist')
        .setLabel('Kliknij, aby się odwołać.')
        .setStyle(ButtonStyle.Secondary),
    );

    // ✅ Odpowiedź do admina (ephemeral)
    await interaction.reply({
      content: '✅ Użytkownik został dodany do czarnej listy.',
      ephemeral: true,
    });

    // 📢 Publiczna wiadomość do kanału
    await interaction.channel.send({
      embeds: [embed],
      components: [row],
    });
  },
};
