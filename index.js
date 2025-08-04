require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Ładowanie komend slash z folderu commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// Ładowanie eventów
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// ----- PROWIZJE -----
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
    fs.unlinkSync(sentFlagPath); // usunięcie pliku, żeby ponownie wysłać wiadomość
    console.log('🗑️ Usunięto embed_sent.flag – wymuszam ponowne wysłanie embeda.');
  }

  const menu = new StringSelectMenuBuilder()
    .setCustomId('wybor_metody')
    .setPlaceholder('Wybierz metodę płatności')
    .addOptions([
      { label: 'Kod Blik', value: 'kodblik', emoji: { id: '1399694813456109579' } },
      { label: 'BLIK', value: 'blik', emoji: { id: '1399694813456109579' } },
      { label: 'PayPal', value: 'paypal', emoji: { id: '1399694205290418227' } },
      { label: 'Kod Psc', value: 'kodpsc', emoji: { id: '1399695302885245033' } },
      { label: 'My Paysafecard', value: 'mypsc', emoji: { id: '1399695302885245033' } },
      { label: 'Crypto', value: 'crypto', emoji: { id: '1399694890828566540' } }
    ]);

  const row = new ActionRowBuilder().addComponents(menu);

  const embed = new EmbedBuilder()
    .setTitle('📄 Wymień Mamone x Lista Prowizji')
    .setDescription(
      `Wybierz metodę, aby zobaczyć dostępne opcje wymiany i prowizje.

**Dostępne metody:**

${emoji.kodblik} Kod Blik  
${emoji.blik} BLIK  
${emoji.paypal} PayPal  
${emoji.kodpsc} Kod Psc  
${emoji.kodpsc} My Paysafecard  
${emoji.crypto} Crypto`
    )
    .setImage('https://i.imgur.com/XLZklOR.jpeg')
    .setColor('#00acff');

  try {
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      console.error(`❌ Nie znaleziono kanału o ID ${channelId}`);
      return;
    }

    await channel.send({ embeds: [embed], components: [row] });

    fs.writeFileSync(sentFlagPath, 'sent');
    console.log('✅ Embed wysłany i oznaczony jako wysłany');
  } catch (err) {
    console.error('❌ Błąd przy wysyłaniu wiadomości z prowizjami:', err);
  }
});

// ❌ NIE MA TU JUŻ drugiego client.on(Events.InteractionCreate...) — przeniesione do events/interactionCreate.js

client.login(process.env.DISCORD_TOKEN);

// Express do pingu
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot działa'));
app.listen(PORT, () => console.log(`🌐 Serwer pingowania działa na porcie ${PORT}`));
