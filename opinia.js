const { Events, EmbedBuilder } = require('discord.js');

const DOZWOLONY_KANAL_ID = '1399748374961459361';

function dodajObslugeOpinii(client) {
  client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    if (message.channel.id !== DOZWOLONY_KANAL_ID) return;
    if (!message.content.startsWith('+rep')) return;

    const opiniaTekst = message.content.slice(4).trim();
    if (!opiniaTekst) {
      return message.reply('✏️ Napisz treść opinii po `+rep`!');
    }

    const embed = new EmbedBuilder()
      .setTitle('📝 Nowa opinia - WYMIEŃ HAJS')
      .setDescription(opiniaTekst)
      .setFooter({ text: `Opinia od: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setColor('#ff0000');

    await message.channel.send({ embeds: [embed] });
    await message.delete().catch(() => {});
  });
}

module.exports = { dodajObslugeOpinii };
