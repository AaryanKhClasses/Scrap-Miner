// Importing modules
const { Collection, MessageEmbed } = require('discord.js')
const fs = require('fs')
const config = require('./config.json')
const emojis = require('./utils/emojis.json')
const profile = require('./models/profile')

const { botname, prefix } = config

module.exports = (client) => {
    const folders = fs.readdirSync('./commands') // Gets all folders in commands folder
    for(const folder of folders) { // Loops through all folders
        const files = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js')) // Gets all files in folder
        for(const file of files) { // Loops through all files
            const command = require(`./commands/${folder}/${file}`) // Require the file
            client.commands.set(command.name, command) // Sets the command
            console.log(`Registered ${file}`) // Logs that the file was registered
        }
    }

    client.on('messageCreate', async (message) => { // Emits when a message is created
        if(message.author.bot || !message.content.startsWith(prefix) || !message.guild) return // If the message is a bot, or the prefix is not used, or the message is not in a guild, do nothing

        const args = message.content.slice(prefix.length).trim().split(/ +/) // Gets the arguments
        const commandName = args.shift().toLowerCase() // Gets the command name

        const command = client.commands.get(commandName) // Gets the command
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) // Gets the command by alias
        if(!command) return // If the command does not exist, do nothing

        if(command.name !== 'start') {
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

            let cmdsUsed = userProfile.cmdsUsed || 0
            cmdsUsed++
            await profile.findOneAndUpdate({ userID: message.author.id }, { userID: message.author.id, cmdsUsed: cmdsUsed }, { upsert: true })
        }

        const { cooldowns } = client // Gets the cooldowns
        if(!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection()) // If the cooldowns do not have the command, set it to a new collection

        const now = Date.now() // Gets the current time
        const timestamps = cooldowns.get(command.name) // Gets the timestamps
        const cooldownAMT = (command.cooldown || 3) * 1000 // Gets the cooldown amount

        if(timestamps.has(message.author.id)) { // If the author has a cooldown
            const expirationTime = timestamps.get(message.author.id) + cooldownAMT // Gets the expiration time
            if(now < expirationTime) { // If the current time is less than the expiration time
                const timeLeft = (expirationTime - now) / 1000 // Gets the time left
                const embed = new MessageEmbed() // Creates a new embed
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('RED')
                .setDescription(`${emojis.slowmode} You need to wait ${timeLeft.toFixed(1)} seconds before using this command again.`)
                .setFooter(botname)
                .setTimestamp()
                return message.reply({ embeds: [embed] })
            }
        }

        timestamps.set(message.author.id, now) // Sets the author's cooldown
        setTimeout(() => timestamps.delete(message.author.id), cooldownAMT) // Deletes the author's cooldown after the cooldown amount

        try { // Tries to execute the command
            command.run(client, message, args) // Runs the command
        } catch(err) { // Catches any errors
            console.error(err) // Logs the error
            message.reply('There was an error while executing the command!') // Replies with an error
        }
    })

}