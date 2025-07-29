
require('dotenv').config();
const fs = require('fs');
const {
  Client,
  GatewayIntentBits,
  Events,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

const channelId = '1392555186802655434';
const sentFlagPath = 'embed_sent.flag';

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot uruchomiony jako ${client.user.tag}`);

  if (fs.existsSync(sentFlagPath)) {
    console.log('⚠️ Wiadomość z embedem została już wcześniej wysłana. Pomijam...');
    return;
  }

  const menu = new StringSelectMenuBuilder()
    .setCustomId('wybor_metody')
    .setPlaceholder('Wybierz metodę płatności')
    .addOptions([
      { label: 'Kod Blik', value: 'kodblik', emoji: '1399694813456109579' },
      { label: 'BLIK', value: 'blik', emoji: '1399694813456109579' },
      { label: 'PayPal', value: 'paypal', emoji: '1399694205290418227' },
      { label: 'Kod Psc', value: 'kodpsc', emoji: '1399695302885245033' },
      { label: 'My Paysafecard', value: 'mypsc', emoji: '1399695302885245033' },
      { label: 'Crypto', value: 'crypto', emoji: '1399694890828566540' }
    ]);

  const row = new ActionRowBuilder().addComponents(menu);

  const embed = new EmbedBuilder()
    .setTitle('💸 Wymień Hajs x Lista Prowizji')
    .setDescription(
      `Wybierz metodę, aby zobaczyć dostępne opcje wymiany i prowizje.

` +
      `**Dostępne metody:**

` +
      `${emoji.kodblik} Kod Blik
` +
      `${emoji.blik} BLIK
` +
      `${emoji.paypal} PayPal
` +
      `${emoji.kodpsc} Kod Psc
` +
      `${emoji.kodpsc} My Paysafecard
` +
      `${emoji.crypto} Crypto

`
    )
    .setImage('https://i.imgur.com/LAABcSv.jpeg')
    .setColor('#ff0000');

  const channel = await client.channels.fetch(channelId);
  await channel.send({ embeds: [embed], components: [row] });

  fs.writeFileSync(sentFlagPath, 'sent');
  console.log('✅ Embed wysłany i oznaczony jako wysłany');
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== 'wybor_metody') return;

  const method = interaction.values[0];
  const wymiany = prowizje[method];

  const lines = Object.entries(wymiany).map(([target, procent]) => {
    return `${emoji[method]} ➜ ${emoji[target]} ${methodLabels[target]} — **${procent}%**`;
  });

  const embed = new EmbedBuilder()
    .setTitle(`Lista Prowizji dla ${methodLabels[method]}`)
    .setDescription(`${lines.join('
')}`)}

❗️MINIMALNA PROWIZJA TO 3ZŁ`)
    .setColor('#ff0000');

  await interaction.reply({
    embeds: [embed],
    ephemeral: true
  });
});

client.login(process.env.DISCORD_TOKEN);

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot działa');
});

app.listen(PORT, () => {
  console.log(`🌐 Serwer pingowania działa na porcie ${PORT}`);
});
