const { MessageEmbed } = require('discord.js')
const { botname } = require('../../config.json')
const emojis = require('../../utils/emojis.json')
const profile = require('../../models/profile')

module.exports = {
    name: 'shop',
    aliases: ['store', 'market'],
    async run(client, message, args) {
        const userProfile = await profile.findOne({ userID: message.author.id })
        const embed = new MessageEmbed()
        .setTitle('Scrap Miner - Shop')
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setColor('GREEN')
        .setFooter(botname, client.user.avatarURL())
        .setTimestamp()
        .setDescription(
            `**Welcome the the Shop!**\n` +
            `Your Balance: ${userProfile.currency === 1 ? emojis.coin : emojis.coins} ${userProfile.currency}\n` +
            `You can buy an item from the shop using the \`/buy <item> <amount>\` command.\n` +
            `You can sell an item using the \`/sell <item> <amount>\` command.\n\n` +
            `**Items in the shop (Refreshes every week):**\n` +
            `${emojis.stone} **Stone:** The most basic resource. The first thing you do is mine some stone!\n` +
            `${emojis.blank} Buying Price: $3 | Selling Price: $1\n\n` +
            `${emojis.copperOre} **Copper Ore:** The second most basic resource. Used to craft advance items.\n` +
            `${emojis.blank} Buying Price: $7 | Selling Price: $5\n\n` +
            `${emojis.furnace} **Funace:** Used for smelting raw ores to ingots which have lots of uses.\n` +
            `${emojis.blank} Buying Price: $50 | Selling Price: Can't Sell`,
        )
        message.reply({ embeds: [embed] })
    },
}