const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Otwiera system ticketa'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('ticket_modal')
      .setTitle('Wymień Hajs');

    const kwotaInput = new TextInputBuilder()
      .setCustomId('kwota')
      .setLabel('KWOTA:')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('Np. 100');

    const zCzegoInput = new TextInputBuilder()
      .setCustomId('z_czego')
      .setLabel('Z CZEGO:')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('Np. BLIK');

    const naCoInput = new TextInputBuilder()
      .setCustomId('na_co')
      .setLabel('NA CO:')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('Np. PAYPAL');

    modal.addComponents(
      new ActionRowBuilder().addComponents(kwotaInput),
      new ActionRowBuilder().addComponents(zCzegoInput),
      new ActionRowBuilder().addComponents(naCoInput),
    );

    await interaction.showModal(modal);

    // 🟢 Odpowiedź prywatna (ephemeral)
    await interaction.reply({
      content: '✅ Formularz został otwarty. Wypełnij go, aby zgłosić ticket.',
      ephemeral: true,
    });
  }
};
