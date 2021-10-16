const { MessageEmbed } = require('discord.js')
const profile = require('../../models/profile')
const { botname } = require('../../config.json')
const emojis = require('../../utils/emojis.json')

module.exports = {
    name: 'start',
    description: 'Start your new journey to become the most successful miner!',
    async run(client, message, args) {
        const userProfile = await profile.findOne({ userID: message.author.id })
        if(userProfile) {
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`${emojis.error} You already have started your mining journey! You can start mining by using the \`/mine\` command!`)
            return message.reply({ embeds: [embed] })
        }

        new profile({ userID: message.author.id, currency: 0, pickaxeType: 'Stone', pickaxeSpeed: 5, pickaxeDrops: 1, advancements: ['Start of a new journey!'], inventory: {
            stone: 0,
            copperOre: 0,
            ironOre: 0,
            goldOre: 0,
            diamondOre: 0,
        } }).save()
        const embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setColor('GREEN')
        .setFooter(botname, client.user.displayAvatarURL())
        .setTimestamp()
        .setDescription(`${emojis.success} Your mining journey starts now! You can start mining by using the \`/mine\` command!`)
        message.reply({ embeds: [embed] })

        setTimeout(() => {
            const advEmbed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('GREEN')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setTitle('New Advancement Unlocked!')
            .setDescription(`${emojis.success} This is your first advancement! Play more to earn more of these!`)
            message.reply({ embeds: [advEmbed] }).then((msg) => {
                advEmbed.setTitle('Start of a new journey!')
                setTimeout(() => msg.edit({ embeds: [advEmbed] }), 2000)
            })
        }, 2000)
    },
}