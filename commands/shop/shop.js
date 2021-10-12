const { MessageEmbed } = require('discord.js')
const { botname } = require('../../config.json')
const emojis = require('../../utils/emojis.json')

module.exports = {
    name: 'shop',
    aliases: ['store', 'market'],
    async run(client, message, args) {
        const embed = new MessageEmbed()
        .setTitle('Scrap Miner - Shop')
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setColor('GREEN')
        .setFooter(botname, client.user.avatarURL())
        .setTimestamp()
        .setDescription(
            `You can buy an item from the shop using the \`/buy <item> <amount>\` command.\n` +
            `You can sell an item using the \`/sell <item> <amount>\` command.\n\n` +
            `**Items in the shop (Refreshes every week):**\n` +
            `${emojis.stone} **Stone:** The most basic resource. The first thing you do is mine some stone!\n` +
            `${emojis.blank} Buying Price: $3 | Selling Price: $1\n\n` +
            `${emojis.copperOre} **Copper Ore:** The second most basic resource. Used to craft advance items.\n` +
            `${emojis.blank} Buying Price: $7 | Selling Price: $5`,
        )
        message.channel.send({ embeds: [embed] })
    },
}