const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { botname } = require('../../config.json')
const profile = require('../../models/profile')
const emojis = require('../../utils/emojis.json')

const items = [
    'stone', 'furnace',
    'copperore',
]

const thumbnail = 'https://raw.githubusercontent.com/AaryanKhClasses/Scrap-Miner/main/assets/shop.png'

module.exports = {
    name: 'buy',
    description: 'Buy an item from the shop',
    async run(client, message, args) {
        const confirmationRow = new MessageActionRow().addComponents(
            new MessageButton()
            .setCustomId('buy-yes')
            .setLabel('Yes')
            .setEmoji(emojis.success)
            .setStyle('SUCCESS'),

            new MessageButton()
            .setCustomId('buy-no')
            .setLabel('No')
            .setEmoji(emojis.error)
            .setStyle('DANGER'),
        )

        const disabledRow = new MessageActionRow().addComponents(
            new MessageButton()
            .setCustomId('buy-dis-yes')
            .setLabel('Yes')
            .setEmoji(emojis.success)
            .setStyle('SUCCESS')
            .setDisabled(),

            new MessageButton()
            .setCustomId('buy-dis-no')
            .setLabel('No')
            .setEmoji(emojis.error)
            .setStyle('DANGER')
            .setDisabled(),
        )

        const userProfile = await profile.findOne({ userID: message.author.id })
        if(!args[0]) {
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`${emojis.error} Please specify an item to buy from the shop!\n${emojis.blank} Use the \`/shop\` command to view the list of items you can buy.`)
            .setThumbnail(thumbnail)
            return message.reply({ embeds: [embed] })
        }

        if(!items.includes(args[0].toLowerCase())) {
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`${emojis.error} The item you specified is not valid! Please check the name of the item and try again.\n${emojis.blank} Use the \`/shop\` command to view the list of items you can buy.`)
            .setThumbnail(thumbnail)
            return message.reply({ embeds: [embed] })
        }

        /**
         *
         * @param {String} item The name (namespace) of the item to buy.
         * @param {Number} amount The amount of the items to buy.
         * @param {Number} currency The amount of money to pay after the item is purchased.
         * @param {String} itemName The displayed name of the item to buy.
         * @param {Number} maxItems The maximum amount of items that the user can have in inventory.
        */

         async function buy(item, amount, currency, itemName, maxItems = Infinity) {
            if(typeof amount !== 'number') amount = parseInt(amount)
            if(!amount) amount = 1
            if(amount <= 0) {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${emojis.error} You can't buy less than 1 item from the shop!`)
                .setThumbnail(thumbnail)
                return message.reply({ embeds: [embed] })
            }

            if(currency * amount > userProfile.currency) {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${emojis.error} You don't have enough coins to buy ${amount} ${itemName}!`)
                .setThumbnail(thumbnail)
                return message.reply({ embeds: [embed] })
            }

            if(userProfile.inventory[item] + amount > maxItems) {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${emojis.error} You can't have more than ${maxItems} ${itemName} in your inventory!`)
                .setThumbnail(thumbnail)
                return message.reply({ embeds: [embed] })
            }

            const confirmation = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('BLUE')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`${emojis.question} Are you sure you want to buy **${amount} ${itemName}**? You will have to pay ${currency * amount === 1 ? emojis.coin : emojis.coins} **${currency * amount}** for it.`)
            message.reply({ embeds: [confirmation], components: [confirmationRow] })

            client.on('interactionCreate', async (interaction) => {
                if(interaction.customId === 'buy-yes') {
                    let currentamt = userProfile.inventory[item] || 0
                    const newamt = currentamt + amount
                    const newcurrency = userProfile.currency - currency * amount
                    await profile.findOneAndUpdate({ userID: message.author.id }, { userID: message.author.id, $set: { [`inventory.${item}`]: newamt }, currency: newcurrency }, { upsert: true })

                    const embed = new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor('GREEN')
                    .setFooter(botname, client.user.displayAvatarURL())
                    .setTimestamp()
                    .setDescription(`${emojis.success} Successfully purchased ${amount} **${itemName}** for **${currency * amount}** ${currency * amount === 1 ? 'coin' : 'coins'}!`)
                    .setThumbnail(thumbnail)
                    interaction.update({ embeds: [embed], components: [disabledRow] })
                } else interaction.update({ embeds: [confirmation], components: [disabledRow] })
            })
        }

        const item = args[0]
        const amount = args[1]
        if(item.toLowerCase() === 'stone') buy('stone', amount, 3, 'stone')
        if(item.toLowerCase() === 'copperore') buy('copperOre', amount, 3, 'copper ore')
        if(item.toLowerCase() === 'furnace') buy('furnace', amount, 50, 'furnace', 1)
    },
}