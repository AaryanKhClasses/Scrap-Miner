const { MessageEmbed } = require('discord.js')
const { botname } = require('../../config.json')
const emojis = require('../../utils/emojis.json')
const profile = require('../../models/profile')

const items = [
    'copper',
    'iron',
    'gold',
]

const thumbnail = 'https://raw.githubusercontent.com/AaryanKhClasses/Scrap-Miner/main/assets/furnace.png'

module.exports = {
    name: 'smelt',
    async run(client, message, args) {
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
            .setDescription(`${emojis.error} Please specify an item to smelt in the furnace!`)
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
         * @param {String} item The name (namespace) of the item to smelt
         * @param {String} product The name (namespace) of the item after smelting
         * @param {Number} amount The amount of items to smelt
         * @param {Number} time The time it takes to smelt each item (in seconds)
         * @param {String} itemName The display name of the product
         * @param {String} productName The display name of the product after smelting
        */

        async function smelt(item, product, amount, time, itemName, productName) {
            if(typeof amount !== 'number') amount = parseInt(amount)
            if(!amount) amount = 1
            if(userProfile.inventory[item] < 1) {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${emojis.error} You don't have any **${itemName}** to smelt!`)
                .setThumbnail(thumbnail)
                return message.reply({ embeds: [embed] })
            }

            if(userProfile.inventory[item] < amount) {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${emojis.error} You don't have enough **${itemName}** to smelt!`)
                .setThumbnail(thumbnail)
                return message.reply({ embeds: [embed] })
            }

            if(amount <= 0) {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${emojis.error} You can't smelt less than 1 item!`)
                .setThumbnail(thumbnail)
                return message.reply({ embeds: [embed] })
            }

            time = time * amount
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('GREEN')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setThumbnail(thumbnail)
            .setTitle(`Smelting ${itemName}...`)
            .setDescription(`Wait for ${time} more seconds to smelt ${itemName}.`)
            message.reply({ embeds: [embed] }).then(async (msg) => {
                for(let i = 0; i < time; i++) {
                    setTimeout(() => {
                        embed.setDescription(`Wait for ${time - i} more ${time - i === 1 ? 'second' : 'seconds'} to smelt ${itemName}.`)
                        msg.edit({ embeds: [embed] })
                    }, (i + 1) * 1000)
                }
                setTimeout(async () => {
                    let currentitems = userProfile.inventory[product] || 0
                    const newitem = userProfile.inventory[item] - amount
                    const newproduct = currentitems + amount
                    await profile.findOneAndUpdate({ userID: message.author.id }, { userID: message.author.id, $set: { [`inventory.${item}`]: newitem, [`inventory.${product}`]: newproduct } }, { upsert: true })

                    embed.setTitle(`Smelted ${itemName}!`)
                    embed.setDescription(`Successfully smelted ${amount} ${itemName} into ${amount} ${productName}!`)
                    msg.edit({ embeds: [embed] })
                }, time * 1000)
            })
        }

        const item = args[0]
        const amount = args[1]
        if(item.toLowerCase() === 'copper') smelt('copperOre', item, amount, 10, 'copper ore', 'copper ingots')
    },
}