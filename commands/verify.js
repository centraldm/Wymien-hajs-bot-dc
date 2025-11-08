const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Wysyła wiadomość o backupie z linkiem Vaultcord'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#00acff')
      .setTitle('✅ WW EXCHANGE × WERYFIKACJA')
      .setDescription('**Zweryfikuj się**  aby nie stracić **naszego serwera.**')
      .setImage('https://i.imgur.com/7dRq9dF.jpeg') // <-- Podmień na swój banner
      .setTimestamp();

    const button = new ButtonBuilder()
      .setLabel('VAULTCORD')
      .setStyle(ButtonStyle.Link)
      .setURL('https://vaultcord.win/wymieńmamone')
      .setEmoji('<:cord:1401945099159470190>');

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.deferReply({ ephemeral: true });
    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.deleteReply();
  },
};
