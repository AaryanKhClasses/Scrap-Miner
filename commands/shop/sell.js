const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { botname } = require('../../config.json')
const profile = require('../../models/profile')
const emojis = require('../../utils/emojis.json')

const items = [
    'stone',
    'copperore',
    'ironore',
    'goldore',
    'diamondore',
]

const thumbnail = 'https://raw.githubusercontent.com/AaryanKhClasses/Scrap-Miner/main/assets/shop.png'

module.exports = {
    name: 'sell',
    description: 'Sell an item from your inventory',
    async run(client, message, args) {
        const confirmationRow = new MessageActionRow().addComponents(
            new MessageButton()
            .setCustomId('yes')
            .setLabel('Yes')
            .setEmoji(emojis.success)
            .setStyle('SUCCESS'),

            new MessageButton()
            .setCustomId('no')
            .setLabel('No')
            .setEmoji(emojis.error)
            .setStyle('DANGER'),
        )

        const disabledRow = new MessageActionRow().addComponents(
            new MessageButton()
            .setCustomId('yes')
            .setLabel('Yes')
            .setEmoji(emojis.success)
            .setStyle('SUCCESS')
            .setDisabled(),

            new MessageButton()
            .setCustomId('no')
            .setLabel('No')
            .setEmoji(emojis.error)
            .setStyle('DANGER')
            .setDisabled(),
        )

        const userProfile = await profile.findOne({ userID: message.author.id })
        if(!userProfile) {
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`${emojis.error} You haven't started your mining jouney yet! Start your mining jouney by using the \`/start\` command.`)
            .setThumbnail(client.user.displayAvatarURL())
            return message.reply({ embeds: [embed] })
        }

        if(!args[0]) {
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`${emojis.error} Please specify an item to sell!`)
            .setThumbnail(thumbnail)
            return message.reply({ embeds: [embed] })
        }

        if(!items.includes(args[0].toLowerCase())) {
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`${emojis.error} The item you specified is not valid! Please check the name of the item and try again.`)
            .setThumbnail(thumbnail)
            return message.reply({ embeds: [embed] })
        }

        /**
         *
         * @param {String} item The name (namespace) of the item to sell.
         * @param {Number} amount The amount of the item to sell.
         * @param {Number} currency The amount of money to give the user after the item is sold.
         * @param {String} itemName The displayed name of the item to sell.
         */

        async function sell(item, amount, currency, itemName) {
            if(!amount) amount = 1
            if(userProfile.inventory[item] < 1) {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${emojis.error} You don't have any **${itemName}** to sell!`)
                .setThumbnail(thumbnail)
                return message.reply({ embeds: [embed] })
            }

            if(userProfile.inventory[item] < amount) {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${emojis.error} You don't have enough **${itemName}** to sell!`)
                .setThumbnail(thumbnail)
                return message.reply({ embeds: [embed] })
            }

            if(amount <= 0) {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${emojis.error} You can't sell less than 1 item!`)
                .setThumbnail(thumbnail)
                return message.reply({ embeds: [embed] })
            }

            const confirmation = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('BLUE')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`${emojis.question} Are you sure you want to sell **${amount} ${itemName}**? You will get ${currency * amount === 1 ? emojis.coin : emojis.coins} **${currency * amount}** in return.`)
            message.reply({ embeds: [confirmation], components: [confirmationRow] })

            client.on('interactionCreate', async (interaction) => {
                if(interaction.customId === 'yes') {
                    const newamt = userProfile.inventory[item] -= amount
                    const newcurrency = userProfile.currency += currency * amount
                    await profile.findOneAndUpdate({ userID: message.author.id }, { userID: message.author.id, $set: { [`inventory.${item}`]: newamt }, currency: newcurrency }, { upsert: true })

                    const embed = new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor('GREEN')
                    .setFooter(botname, client.user.displayAvatarURL())
                    .setTimestamp()
                    .setDescription(`${emojis.success} Successfully sold ${amount} **${itemName}** for **${currency * amount}** ${currency * amount === 1 ? 'coin' : 'coins'}!`)
                    .setThumbnail(thumbnail)
                    interaction.update({ embeds: [embed], components: [disabledRow] })
                } else interaction.update({ embeds: [confirmation], components: [disabledRow] })
            })
        }

        const item = args[0]
        const amount = args[1]
        if(item.toLowerCase() === 'stone') sell('stone', amount, 1, 'stone')
        if(item.toLowerCase() === 'copperore') sell('copperOre', amount, 5, 'copper ore')
    },
}