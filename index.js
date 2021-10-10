// Importing Modules
const { Client, Intents, Collection } = require('discord.js')
const mongoose = require('mongoose')
const config = require('./config.json')
const handler = require('./handler')
require('dotenv').config()

const { prefix } = config // Gets variables from config

const client = new Client({ // Creates a new client
    intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES ], // Sets intents
    partials: ['CHANNEL', 'MESSAGE', 'USER'], // Sets partials
})

// Discord collections
client.commands = new Collection()
client.cooldowns = new Collection()

mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

client.on('ready', () => { // Emits when the client is ready
    console.log(`${client.user.username} is ready!`) // Logs that the bot is ready
    client.user.setActivity(`${prefix}help`, { type: 'LISTENING' }) // Sets the activity
    handler(client) // Calls the handler
})

client.login(process.env.TOKEN) // Logs in the bot