const { MessageEmbed } = require('discord.js')
const { botname } = require('../../config.json')
const profile = require('../../models/profile.js')
const { minedStone, minedCopperOre } = require('../../utils/miningQuotes')

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
            .setDescription(`You haven't started your mining jouney yet! Start your mining jouney by using the \`/start\` command.`)
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
                setTimeout(async () => {
                    if(type === 'Stone') {
                        const randomDrops = Math.floor(Math.random() * 2) + 1
                        if(randomDrops === 1) {
                            const currentStone = userProfile.inventory.stone || 0
                            const stone = currentStone + mined
                            await profile.findOneAndUpdate({ userID: message.author.id }, { userID: message.author.id, $set: { 'inventory.stone': stone } }, { upsert: true })

                            embed.setTitle(`Successful mining mission!`)
                            embed.setDescription(minedStone(type, mined)[Math.floor(Math.random() * minedStone.length)])
                            msg.edit({ embeds: [embed] })
                        } else {
                            const currentCopper = userProfile.inventory.copperOre || 0
                            const copperOre = currentCopper + mined
                            await profile.findOneAndUpdate({ userID: message.author.id }, { userID: message.author.id, $set: { 'inventory.copperOre': copperOre } }, { upsert: true })

                            embed.setTitle(`Successful mining mission!`)
                            embed.setDescription(minedCopperOre(type, mined)[Math.floor(Math.random() * minedCopperOre.length)])
                            msg.edit({ embeds: [embed] })
                        }
                    }
                }, speed * 1000)
            })
        }

        if(userProfile.pickaxeType === 'Stone') mine('Stone', 5, 1)
    },
}

