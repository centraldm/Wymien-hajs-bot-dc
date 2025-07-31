const {
  Events,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
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

    // Obsługa wyboru z menu ustawień
    if (interaction.isStringSelectMenu()) {
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
