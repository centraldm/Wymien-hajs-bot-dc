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
      .setColor('#083E49')
      .setTitle('🏴‍☠️ WW EXCHANGE × BLACKLISTA')
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
      // Odpowiedź ephemeral dla admina
      await interaction.reply({
        content: '✅ Użytkownik został dodany do czarnej listy.',
        ephemeral: true,
      });

      // Spróbuj usunąć ostatnią wiadomość wywołującą tego admina (jeśli istnieje) — przy slash nie ma bezpośredniej wiadomości autora,
      // więc usuwamy ostatnią zwykłą wiadomość admina w kanale (bezpieczne)
      try {
        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: 10 });
        const lastByAdmin = messages.find(m => m.author.id === interaction.user.id && !m.interaction);
        if (lastByAdmin) {
          await lastByAdmin.delete().catch(() => {});
        }
      } catch (err) {
        // ignorujemy błędy podczas usuwania wiadomości (np. brak uprawnień)
      }

      // Wstaw embed publicznie
      await interaction.followUp({
        embeds: [embed],
        components: [row],
      });

    } catch (error) {
      console.error('❌ Błąd przy wysyłaniu wiadomości:', error);

      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Wystąpił błąd podczas wysyłania wiadomości. Sprawdź uprawnienia bota!',
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: '❌ Wystąpił błąd przy wysyłaniu wiadomości na kanał.',
          ephemeral: true,
        });
      }
    }
  },
};
