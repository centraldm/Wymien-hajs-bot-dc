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
} = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Obsługa komend
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

    // Obsługa modala (formularz zgłoszenia)
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'ticket_modal') {
        const kwota = interaction.fields.getTextInputValue('kwota');
        const zCzego = interaction.fields.getTextInputValue('z_czego');
        const naCo = interaction.fields.getTextInputValue('na_co');

        const otrzymasz = (parseFloat(kwota) * 0.9).toFixed(2);

        const embed = new EmbedBuilder()
          .setTitle('💸 Wymień Hajs × WYMIANA')
          .setColor('#ff0000')
          .addFields(
            {
              name: '<:info:1400550505620443216> INFORMACJE O UŻYTKOWNIKU',
              value: `> PING: ${interaction.user}\n> NICK: ${interaction.user.username}\n> ID: ${interaction.user.id}`,
            },
            {
              name: '<:exchange:1400550053596364910> INFORMACJE O WYMIANIE',
              value: `> JAKA KWOTA: ${kwota} PLN\n> Z CZEGO: ${zCzego}\n> NA CO: ${naCo}\n> OTRZYMASZ: ${otrzymasz} PLN`,
            }
          );

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

        await interaction.reply({
          content: '@everyone',
          embeds: [embed],
          components: [buttons],
        });
      }
    }

    // Obsługa przycisków
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

    // Obsługa menu wyboru
    if (interaction.isStringSelectMenu()) {
      // Nowe: wybór opcji z głównego menu (Wymiana / Pomoc)
      if (interaction.customId === 'ticket_select') {
        const choice = interaction.values[0];

        if (choice === 'wymiana') {
          const modal = new ModalBuilder()
            .setCustomId('ticket_modal')
            .setTitle('Wymień Hajs');

          const kwotaInput = new TextInputBuilder()
            .setCustomId('kwota')
            .setLabel('KWOTA:')
            .setPlaceholder('Przykład: 100 ( w PLN )')
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

          await interaction.showModal(modal.addComponents(
            new ActionRowBuilder().addComponents(kwotaInput),
            new ActionRowBuilder().addComponents(zCzegoInput),
            new ActionRowBuilder().addComponents(naCoInput)
          ));
        }

        if (choice === 'pomoc') {
          await interaction.reply({
            content: '🆘 Skontaktuj się z administracją w celu uzyskania pomocy.',
            ephemeral: true,
          });
        }
      }

      // Obsługa menu ustawień
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
