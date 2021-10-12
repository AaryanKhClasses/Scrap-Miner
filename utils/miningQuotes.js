/**
 *
 * @param {String} type The type of pickaxe the user has when used the command.
 * @param {Number} mined The amount of ore mined when used the command.
*/

module.exports.minedStone = (type, mined) => [
    `You went mining in search for copper, but got ${mined} stone instead.`,
    `When the game gives you a **${type} Pickaxe**, you mine ${mined} stone!`,
    `You mined at the surface of a cave and mined ${mined} stone!`,
    `You went mining deep down but had no luck in getting precious ores, instead you got ${mined} stone.`,
]

/**
 *
 * @param {String} type The type of pickaxe the user has when used the command.
 * @param {Number} mined The amount of ore mined when used the command.
*/

module.exports.minedCopperOre = (type, mined) => [
    `You went in the mines, not much deep with your trusty **${type} Pickaxe** and came back with ${mined} copper ore!`,
    `Imagine mining copper with a **${type} pickaxe**. Anyway u got ${mined} copper!`,
]

/**
 *
 * @param {String} type The type of pickaxe the user has when used the command.
 * @param {Number} mined The amount of ore mined when used the command.
*/

module.exports.minedIronOre = (type, mined) => [
    "",
]