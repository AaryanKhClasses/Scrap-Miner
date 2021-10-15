const { MessageEmbed } = require('discord.js')
const { botname } = require('../../config.json')
const profile = require('../../models/profile')
const itemNames = require('../../utils/itemNames.json')
const emojis = require('../../utils/emojis.json')

const thumbnail = 'https://raw.githubusercontent.com/AaryanKhClasses/Scrap-Miner/main/assets/inventory.png'

module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    description: 'View your inventory',
    async run(client, message, args) {
        let target
        if(message.mentions.users.first()) target = message.mentions.users.first()
        else if(args[0]) {
            if(client.users.cache.get(args[0])) target = client.users.cache.get(args[0])
            else {
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setFooter(botname, client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${emojis.error} Cannot find user with ID: ${args[0]} in my database as we do not share any servers.`)
                .setThumbnail(client.user.displayAvatarURL())
                return message.reply({ embeds: [embed] })
            }
        } else target = message.author

        const userProfile = await profile.findOne({ userID: target.id })
        if(!userProfile) {
            const embed = new MessageEmbed()
            .setAuthor(target.username, target.displayAvatarURL({ dynamic: true }))
            .setColor('RED')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL())
            if(target === message.author) embed.setDescription(`${emojis.error} You haven't started your mining jouney yet! Start your mining jouney by using the \`/start\` command.`)
            else embed.setDescription(`${emojis.error} ${target.username} has't started their mining jouney yet! They can start their mining jouney by using the \`/start\` command.`)
            return message.reply({ embeds: [embed] })
        }

        const items = Array.from(Object.keys(userProfile.inventory))
        .filter(item => userProfile.inventory[item] > 0)
        .sort((a, b) => userProfile.inventory[b] - userProfile.inventory[a])
        .map(item => `${emojis[item]} ${itemNames[item]} x${userProfile.inventory[item]}`)
        .join(`\n ${emojis.blank}`)

        const embed = new MessageEmbed()
        .setAuthor(target.username, target.displayAvatarURL({ dynamic: true }))
        .setColor('GREEN')
        .setFooter(botname, client.user.displayAvatarURL())
        .setTimestamp()
        .setThumbnail(thumbnail)
        if(target === message.author) embed.setDescription(`${emojis.inventory} **Your inventory:**\n${emojis.blank} ${items || 'No items'}`)
        else embed.setDescription(`${emojis.inventory} **${target.username}'s inventory:**\n${emojis.blank} ${items || 'No items'}`)
        message.reply({ embeds: [embed] })
    },
}