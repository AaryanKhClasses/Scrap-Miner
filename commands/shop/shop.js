const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')
const { botname } = require('../../config.json')
const emojis = require('../../utils/emojis.json')
const profile = require('../../models/profile')

module.exports = {
    name: 'shop',
    aliases: ['store', 'market'],
    async run(client, message, args) {
        const userProfile = await profile.findOne({ userID: message.author.id })
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('Ores Shop')
            .addOptions([
                {
                    label: 'Ores Shop',
                    description: 'Buy & Sell Ores here!',
                    value: 'ores',
                },
                {
                    label: 'Ingots Shop',
                    description: 'Sell the smelted ingots here!',
                    value: 'ingots',
                },
                {
                    label: 'Misc Shop',
                    description: 'Buy Miscellenous items here!',
                    value: 'misc',
                },
            ]),
        )

        const embed = new MessageEmbed()
        .setTitle('Scrap Miner - Ore Shop')
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
            `${emojis.ironOre} **Iron Ore:** Another material used for making different tools and items.\n` +
            `${emojis.blank} Buying Price: $30 | Selling Price: $20\n\n` +
            `${emojis.goldOre} **Gold Ore:** Used for golden items which sell in a high value.\n` +
            `${emojis.blank} Buying Price: $100 | Selling Price: $50\n\n` +
            `${emojis.diamondOre} **Diamond Ore:** The most valuable resource. Used to create the best tools.\n` +
            `${emojis.blank} Buying Price: $300 | Selling Price: $100`,
        )
        message.reply({ embeds: [embed], components: [row] })

        client.on('interactionCreate', async (interaction) => {
            if(interaction.customId === 'select') {
                if(interaction.values[0] === 'ores') {
                    embed.setDescription(
                        `**Welcome the the Shop!**\n` +
                        `Your Balance: ${userProfile.currency === 1 ? emojis.coin : emojis.coins} ${userProfile.currency}\n` +
                        `You can buy an item from the shop using the \`/buy <item> <amount>\` command.\n` +
                        `You can sell an item using the \`/sell <item> <amount>\` command.\n\n` +
                        `**Items in the shop (Refreshes every week):**\n` +
                        `${emojis.stone} **Stone:** The most basic resource. The first thing you do is mine some stone!\n` +
                        `${emojis.blank} Buying Price: $3 | Selling Price: $1\n\n` +
                        `${emojis.copperOre} **Copper Ore:** The second most basic resource. Used to craft advance items.\n` +
                        `${emojis.blank} Buying Price: $7 | Selling Price: $5\n\n` +
                        `${emojis.ironOre} **Iron Ore:** Another material used for making different tools and items.\n` +
                        `${emojis.blank} Buying Price: $30 | Selling Price: $20\n\n` +
                        `${emojis.goldOre} **Gold Ore:** Used for golden items which sell in a high value.\n` +
                        `${emojis.blank} Buying Price: $100 | Selling Price: $50\n\n` +
                        `${emojis.diamondOre} **Diamond Ore:** The most valuable resource. Used to create the best tools.\n` +
                        `${emojis.blank} Buying Price: $300 | Selling Price: $100`,
                    )
                    interaction.update({ embeds: [embed] })
                } else if(interaction.values[0] === 'ingots') {
                    embed.setTitle('Scrap Miner - Ingots Shop')
                    embed.setDescription(
                        `**Welcome the the Shop!**\n` +
                        `Your Balance: ${userProfile.currency === 1 ? emojis.coin : emojis.coins} ${userProfile.currency}\n` +
                        `You can buy an item from the shop using the \`/buy <item> <amount>\` command.\n` +
                        `You can sell an item using the \`/sell <item> <amount>\` command.\n\n` +
                        `**Items in the shop (Refreshes every week):**\n` +
                        `${emojis.copper} **Copper Ingot:** Used to make copper tools and items.\n` +
                        `${emojis.blank} Selling Price: $20\n\n` +
                        `${emojis.iron} **Iron Ingot:** Used to make iron tools and items.\n` +
                        `${emojis.blank} Selling Price: $50\n\n` +
                        `${emojis.gold} **Gold Ingot:** Used to make gold tools and items.\n` +
                        `${emojis.blank} Selling Price: $100\n\n` +
                        `${emojis.diamond} **Diamond:** Used to make diamond tools and items.\n` +
                        `${emojis.blank} Selling Price: $200`,
                    )
                    interaction.update({ embeds: [embed] })
                } else if(interaction.values[0] === 'misc') {
                    let furnaceStr
                    if(userProfile.inventory['furnace'] === 1) furnaceStr = ''
                    else furnaceStr = `${emojis.furnace} **Funace:** Used for smelting raw ores to ingots which have lots of uses.\n` +
                    `${emojis.blank} Buying Price: $50`

                    let pickStr
                    if(userProfile.pickaxeType === 'Stone') {
                        pickStr = `${emojis.pickaxe} **Copper Pickaxe:** Can be used to mine stone, copper and iron.\n` +
                        `${emojis.blank} Buying Price: $100 (Temporary)`
                    } else if(userProfile.pickaxeType === 'Copper') {
                        pickStr = `${emojis.pickaxe} **Iron Pickaxe:** Can be used to mine stone, copper, iron and gold.\n` +
                        `${emojis.blank} Buying Price: $250 (Temporary)`
                    } else if(userProfile.pickaxeType === 'Iron') {
                        pickStr = `${emojis.pickaxe} **Iron Pickaxe:** Can be used to mine copper, iron, gold and diamonds.\n` +
                        `${emojis.blank} Buying Price: $500 (Temporary)`
                    } else if(userProfile.pickaxeType === 'Gold') {
                        pickStr = `${emojis.pickaxe} **Gold Pickaxe:** Can be used to mine iron, gold and diamonds.\n` +
                        `${emojis.blank} Buying Price: $1000 (Temporary)`
                    }

                    embed.setTitle('Scrap Miner - Misc Shop')
                    embed.setDescription(
                        `**Welcome the the Shop!**\n` +
                        `Your Balance: ${userProfile.currency === 1 ? emojis.coin : emojis.coins} ${userProfile.currency}\n` +
                        `You can buy an item from the shop using the \`/buy <item> <amount>\` command.\n` +
                        `You can sell an item using the \`/sell <item> <amount>\` command.\n\n` +
                        `**Items in the shop (Refreshes every week):**\n` +
                        `${furnaceStr}\n\n${pickStr}`,
                    )
                    interaction.update({ embeds: [embed] })
                }
            }
        })
    },
}

/*

            */