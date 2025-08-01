const {
  Events,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionsBitField,
} = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: '❌ Wystąpił błąd podczas wykonywania komendy.',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: '❌ Wystąpił błąd podczas wykonywania komendy.',
            ephemeral: true,
          });
        }
      }
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
      const choice = interaction.values[0];

      if (choice === 'wymiana') {
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
          new ActionRowBuilder().addComponents(naCoInput)
        );

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit() && interaction.customId === 'ticket_modal') {
      const kwota = interaction.fields.getTextInputValue('kwota');
      const zCzego = interaction.fields.getTextInputValue('z_czego');
      const naCo = interaction.fields.getTextInputValue('na_co');
      const otrzymasz = (parseFloat(kwota) * 0.9).toFixed(2);

      const guild = interaction.guild;
      const user = interaction.user;

      const ticketChannel = await guild.channels.create({
        name: `🎫・ticket-${user.username}`,
        type: ChannelType.GuildText,
        parent: '1399754161511338125',
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: '1400736771989569586',
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: interaction.client.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ManageChannels,
            ],
          },
        ],
      });

      const embed = new EmbedBuilder()
        .setTitle('💸 Wymień Hajs × WYMIANA')
        .setColor('#00ff00')
        .addFields(
          {
            name: '<:info:1400550505620443216> INFORMACJE O UŻYTKOWNIKU',
            value: `> PING: ${user}\n> NICK: ${user.username}\n> ID: ${user.id}`,
          },
          {
            name: '<:exchange:1400550053596364910> INFORMACJE O WYMIANIE',
            value: `> JAKA KWOTA: ${kwota} PLN\n> Z CZEGO: ${zCzego}\n> NA CO: ${naCo}\n> OTRZYMASZ: ${otrzymasz} PLN`,
          }
        )
        .setImage('https://i.imgur.com/XNg7Y61.jpeg');

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('przejmij_ticket')
          .setLabel('Przejmij')
          .setStyle(ButtonStyle.Success)
          .setEmoji('<:przejmij:1400551668134707392>'),
        new ButtonBuilder()
          .setCustomId('ustawienia_ticket')
          .setLabel('Ustawienia')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('<:ustawienia:1400551685293740042>')
      );

      await ticketChannel.send({
        content: `<@${user.id}>`,
        embeds: [embed],
        components: [buttons],
      });

      await interaction.reply({
        content: `✅ Ticket został utworzony: ${ticketChannel}`,
        ephemeral: true,
      });
    }
  },
};
