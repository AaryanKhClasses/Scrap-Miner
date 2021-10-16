const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    userID: String,
    currency: Number,
    pickaxeType: String, // Stone > Copper > Iron > Gold > Diamond,
    pickaxeSpeed: Number,
    pickaxeDrops: Number,
    cmdsUsed: Number,
    advancements: [String],
    inventory: Object, // name: amount
})

const profile = mongoose.model('profiles', profileSchema)
module.exports = profile