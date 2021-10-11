const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { botname } = require('../../config.json')
const profile = require('../../models/profile')

const items = [
    'stone',
    'copperOre',
    'ironOre',
    'goldOre',
    'diamondOre',
]

module.exports = {
    name: 'sell',
    description: 'Sell an item from your inventory',
    async run(client, message, args) {
        const userProfile = await profile.findOne({ userID: message.author.id })
        if(!userProfile) {
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`You haven't started your mining jouney yet! Start your mining jouney by using the \`/start\` command.`)
            return message.channel.send({ embeds: [embed] })
        }

        if(!args[0]) {
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`Please specify an item to sell!`)
            return message.channel.send({ embeds: [embed] })
        }

        if(!items.includes(args[0])) {
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`The item you specified is not valid! Please check the name of the item and try again.`)
            return message.channel.send({ embeds: [embed] })
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
                .setDescription(`You don't have any **${itemName}** to sell!`)
                return message.channel.send({ embeds: [embed] })
            }

            if(userProfile.inventory[item] < amount) {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`You don't have enough **${itemName}** to sell!`)
                return message.channel.send({ embeds: [embed] })
            }

            if(amount <= 0) {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`You can't sell less than 1 item!`)
                return message.channel.send({ embeds: [embed] })
            }

            const newamt = userProfile.inventory[item] -= amount
            const newcurrency = userProfile.currency += currency * amount
            await profile.findOneAndUpdate({ userID: message.author.id }, { userID: message.author.id, $set: { [`inventory.${item}`]: newamt }, currency: newcurrency }, { upsert: true })

            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('GREEN')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`Successfully sold ${amount} **${itemName}** for **${currency * amount}** ${currency * amount === 1 ? 'coin' : 'coins'}!`)
            return message.channel.send({ embeds: [embed] })
        }

        const item = args[0]
        const amount = args[1]
        if(item.toLowerCase() === 'stone') sell('stone', amount, 1, 'stone')
        if(item.toLowerCase() === 'copperore') sell('copperOre', amount, 5, 'copper ore')
    },
}