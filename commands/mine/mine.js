const { MessageEmbed } = require('discord.js')
const { botname } = require('../../config.json')
const profile = require('../../models/profile.js')
const { minedStone, minedCopperOre } = require('../../utils/miningQuotes')
const emojis = require('../../utils/emojis.json')

const stoneThumbnail = 'https://raw.githubusercontent.com/AaryanKhClasses/Scrap-Miner/main/assets/stone.png'
const copperThumbnail = 'https://raw.githubusercontent.com/AaryanKhClasses/Scrap-Miner/main/assets/copperOre.png'
const ironThumbnail = 'https://raw.githubusercontent.com/AaryanKhClasses/Scrap-Miner/main/assets/ironOre.png'
const goldThumbnail = 'https://raw.githubusercontent.com/AaryanKhClasses/Scrap-Miner/main/assets/goldOre.png'
const diamondThumbnail = 'https://raw.githubusercontent.com/AaryanKhClasses/Scrap-Miner/main/assets/diamondOre.png'

module.exports = {
    name: 'mine',
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

        /**
         *
         * @param {String} type Type of pickaxe, the higher the type, the better the drops
         * @param {Number} speed The amount of duration for each time you mine
         * @param {Number} drops The multiplier for how much amount of each material you mine.
        */

        function mine(type, speed, drops) {
            const random = Math.floor(Math.random() * 10) + 1
            const mined = random * drops

            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('GREEN')
            .setFooter(botname, client.user.displayAvatarURL())
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`Mining...`)
            .setDescription(`Wait for ${speed} more seconds to mine.`)
            message.reply({ embeds: [embed] }).then((msg) => {
                for(let i = 0; i < speed; i++) {
                    setTimeout(() => {
                        embed.setDescription(`Wait for ${speed - i} more ${speed - i === 1 ? 'second' : 'seconds'} to mine.`)
                        msg.edit({ embeds: [embed] })
                    }, (i + 1) * 1000)
                }
                setTimeout(async () => {
                    if(type === 'Stone') {
                        const randomDrops = Math.floor(Math.random() * 2) + 1
                        if(randomDrops === 1) afterMined('stone', minedStone, mined, embed, stoneThumbnail, msg)
                        else afterMined('copperOre', minedCopperOre, mined, embed, copperThumbnail, msg)
                    }
                }, speed * 1000)
            })
        }

        /**
         *
         * @param {String} type The type of ore to mine
         * @param {String} minedType The type of random mining quote imported from randomQuotes.js
         * @param {Number} minedItems The number of mined items
         * @param {MessageEmbed} embed The Discord.MessageEmbed() object
         * @param {String} thumbnail The thumbnail of the mined item
         * @param {Message} msg The message itself of which the embed is a part
        */

        async function afterMined(type, minedType, minedItems, editedEmbed, thumbnailType, msg) {
            const currentType = userProfile.inventory[type] || 0
            const newType = currentType + minedItems
            await profile.findOneAndUpdate({ userID: message.author.id }, { userID: message.author.id, $set: { [`inventory.${type}`]: newType } }, { upsert: true })

            editedEmbed.setTitle(`Successful mining mission!`)
            editedEmbed.setDescription(minedType(type, minedItems)[Math.floor(Math.random() * minedType.length)])
            editedEmbed.setThumbnail(thumbnailType)
            msg.edit({ embeds: [editedEmbed] })
        }

        if(userProfile.pickaxeType === 'Stone') mine('Stone', 5, 1)
        if(userProfile.pickaxeType === 'Copper') mine('Copper', 4, 1)
        if(userProfile.pickaxeType === 'Iron') mine('Iron', 4, 2)
        if(userProfile.pickaxeType === 'Gold') mine('Gold', 3, 2)
        if(userProfile.pickaxeType === 'Diamond') mine('Diamond', 3, 3)
    },
}