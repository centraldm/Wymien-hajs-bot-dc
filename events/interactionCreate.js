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
    // Obsługa komend slash
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: '❌ Wystąpił błąd podczas wykonywania komendy.',
          ephemeral: true,
        });
      }
    }

    // Obsługa wyboru metody prowizji (wyświetlane tylko dla użytkownika)
    if (interaction.isStringSelectMenu() && interaction.customId === 'wybor_metody') {
      const prowizje = {
        kodblik: { paypal: 7, kodpsc: 12, crypto: 8 },
        blik: { paypal: 4, kodpsc: 9, crypto: 5 },
        paypal: { kodblik: 8, kodpsc: 10, crypto: 5 },
        kodpsc: { kodblik: 10, paypal: 12, crypto: 15 },
        mypsc: { kodblik: 15, paypal: 17, crypto: 20 },
        crypto: { kodblik: 5, paypal: 4, kodpsc: 6 }
      };

      const emoji = {
        blik: '<:blik:1399694813456109579>',
        kodblik: '<:blik:1399694813456109579>',
        paypal: '<:paypal:1399694205290418227>',
        kodpsc: '<:paysafe:1399695302885245033>',
        mypsc: '<:paysafe:1399695302885245033>',
        crypto: '<:crypto:1399694890828566540>'
      };

      const methodLabels = {
        blik: 'BLIK',
        kodblik: 'Kod Blik',
        paypal: 'PayPal',
        kodpsc: 'Kod Psc',
        mypsc: 'My Paysafecard',
        crypto: 'Crypto'
      };

      const method = interaction.values[0];
      const wymiany = prowizje[method];

      const lines = Object.entries(wymiany).map(([target, procent]) => {
        return `${emoji[method]} ➜ ${emoji[target]} ${methodLabels[target]} — **${procent}%**`;
      });

      const embed = new EmbedBuilder()
        .setTitle(`📊 Prowizje dla ${methodLabels[method]}`)
        .setDescription(`${lines.join('\n')}\n\n❗️MINIMALNA PROWIZJA TO 3ZŁ`)
        .setColor('#00acff');

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    // Obsługa wyboru z menu ticketowego (menu.js)
    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
      const choice = interaction.values[0];

      if (choice === 'wymiana') {
        const modal = new ModalBuilder()
          .setCustomId('ticket_modal')
          .setTitle('Wymień Mamone');

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

    // Obsługa formularza ticketowego
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
        parent: '1399754161511338125', // <-- ID kategorii
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
            id: '1400736771989569586', // Rola exchangerów
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
        .setTitle('💸 WW Exchange × WYMIANA')
        .setColor('#00acff')
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
        .setImage('https://i.imgur.com/L7EmAVP.jpeg');

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

   // Obsługa przycisków (ustawienia/przejmij)
if (interaction.isButton()) {
  if (interaction.customId === 'przejmij_ticket') {
    const allowedRoleId = '1400736771989569586';
    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!member.roles.cache.has(allowedRoleId)) {
      return await interaction.reply({
        content: '❌ Nie masz uprawnień do przejęcia tego ticketu.',
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: `✅ Ticket został przejęty przez ${interaction.user}`,
      ephemeral: false, // widoczne dla wszystkich w kanale
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

    // Obsługa zmian statusu ticketu
    if (interaction.isStringSelectMenu() && interaction.customId === 'ustawienia_menu') {
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
  },
};
