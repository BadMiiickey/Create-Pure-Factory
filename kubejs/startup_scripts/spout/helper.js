const budMap = {
    'minecraft:air': 'minecraft:small_amethyst_bud',
    'minecraft:small_amethyst_bud': 'minecraft:medium_amethyst_bud',
    'minecraft:medium_amethyst_bud': 'minecraft:large_amethyst_bud',
    'minecraft:large_amethyst_bud': 'minecraft:amethyst_cluster',
    'minecraft:amethyst_cluster': 'minecraft:air'
}

/**
 * 
 * @param { import("dev.latvian.mods.kubejs.level.LevelBlock").$LevelBlock$$Type } block 
 */
const checkHorizontalSpace = (block) => {
    let horizontalDirections = [
        Direction.NORTH,
        Direction.SOUTH,
        Direction.EAST,
        Direction.WEST
    ]

    for (let direction of horizontalDirections) {
        if (Object.keys(budMap).includes(block.offset(direction).getId())) return true
    }

    return false
}