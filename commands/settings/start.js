const { MessageEmbed } = require('discord.js')
const profile = require('../../models/profile')
const { botname } = require('../../config.json')

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
            .setDescription(`You already have started your mining journey! You can start mining by using the \`/mine\` command!`)
            return message.channel.send({ embeds: [embed] })
        }

        new profile({ userID: message.author.id, currency: 0, pickaxeType: 'Stone', pickaxeSpeed: 5, pickaxeDrops: 1, inventory: {
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
        .setDescription(`Your mining journey starts now! You can start mining by using the \`/mine\` command!`)
        message.channel.send({ embeds: [embed] })
    },
}