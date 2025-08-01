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
    // ------------------ /menu COMMAND ------------------
    if (interaction.isChatInputCommand() && interaction.commandName === 'menu') {
      const embed = new EmbedBuilder()
        .setTitle('📨 Wymień Hajs × STWÓRZ TICKET')
        .setDescription('Jeżeli chcesz stworzyć ticketa, to wybierz opcję z poniższego menu.')
        .setImage('https://i.imgur.com/XNg7Y61.jpeg')
        .setColor('#ff0000');

      const select = new StringSelectMenuBuilder()
        .setCustomId('ticket_select')
        .setPlaceholder('📩 Wybierz powód utworzenia ticketa')
        .addOptions(
          {
            label: 'Wymiana',
            description: 'Rozpocznij wymianę',
            value: 'wymiana',
            emoji: '💸',
          },
          {
            label: 'Pomoc',
            description: 'Skontaktuj się z administracją',
            value: 'pomoc',
            emoji: '🆘',
          }
        );

      const row = new ActionRowBuilder().addComponents(select);

      await interaction.channel.send({ embeds: [embed], components: [row] });
      await interaction.deleteReply().catch(() => {}); // usuwa "użytkownik używa /menu"
      return;
    }

    // ------------------ MODAL SUBMIT ------------------
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

    // ------------------ BUTTON HANDLERS ------------------
    if (interaction.isButton()) {
      if (interaction.customId === 'przejmij_ticket') {
        await interaction.reply({
          content: `✅ Ticket przejęty przez ${interaction.user.tag}`,
          ephemeral: true,
        });
      }

      if (interaction.customId === 'ustawienia_ticket') {
        const menu = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('ustawienia_menu')
            .setPlaceholder('🔧 Wybierz akcję')
            .addOptions(
              {
                label: 'Zamknij ticket',
                value: 'zamknij',
                emoji: '🔒',
              },
              {
                label: 'Ustaw status: W TRAKCIE',
                value: 'w_trakcie',
                emoji: '🟡',
              },
              {
                label: 'Ustaw status: ZAKOŃCZONY',
                value: 'zakonczony',
                emoji: '✅',
              }
            )
        );

        await interaction.reply({
          content: '🔧 Wybierz jedną z opcji:',
          components: [menu],
          ephemeral: true,
        });
      }
    }

    // ------------------ SELECT MENUS ------------------
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'ticket_select') {
        const choice = interaction.values[0];

        if (choice === 'wymiana') {
          const modal = new ModalBuilder()
            .setCustomId('ticket_modal')
            .setTitle('Wymień Hajs');

          const kwotaInput = new TextInputBuilder()
            .setCustomId('kwota')
            .setLabel('KWOTA:')
            .setPlaceholder('Przykład: 100 (w PLN)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const zCzegoInput = new TextInputBuilder()
            .setCustomId('z_czego')
            .setLabel('Z CZEGO:')
            .setPlaceholder('Przykład: BLIK')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const naCoInput = new TextInputBuilder()
            .setCustomId('na_co')
            .setLabel('NA CO:')
            .setPlaceholder('Przykład: PAYPAL')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          await interaction.showModal(
            modal.addComponents(
              new ActionRowBuilder().addComponents(kwotaInput),
              new ActionRowBuilder().addComponents(zCzegoInput),
              new ActionRowBuilder().addComponents(naCoInput)
            )
          );
        }

        if (choice === 'pomoc') {
          await interaction.reply({
            content: '🆘 Skontaktuj się z administracją w celu uzyskania pomocy.',
            ephemeral: true,
          });
        }
      }

      if (interaction.customId === 'ustawienia_menu') {
        const choice = interaction.values[0];

        if (choice === 'zamknij') {
          await interaction.reply({
            content: '🔒 Ticket zostanie zamknięty za 5 sekund.',
            ephemeral: true,
          });
          setTimeout(() => {
            interaction.channel.delete().catch(console.error);
          }, 5000);
        }

        if (choice === 'w_trakcie') {
          await interaction.channel.setName('🟡・w-trakcie').catch(console.error);
          await interaction.reply({
            content: '🟡 Status zmieniony na „W trakcie”.',
            ephemeral: true,
          });
        }

        if (choice === 'zakonczony') {
          await interaction.channel.setName('✅・zakonczony').catch(console.error);
          await interaction.reply({
            content: '✅ Status zmieniony na „Zakończony”.',
            ephemeral: true,
          });
        }
      }
    }
  },
};
