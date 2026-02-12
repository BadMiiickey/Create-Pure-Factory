const heightPlants = [
    'minecraft:sugar_cane',
    'minecraft:cactus'
]

const smallPlants = ['minecraft:lily_pad']
    .concat(Ingredient.of('#minecraft:small_flowers').itemIds.toArray())

/**
 * 
 * @param { import("dev.latvian.mods.kubejs.level.LevelBlock").$LevelBlock$$Type  } block
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { import("net.minecraft.world.level.Level").$Level } level 
 */
const getHeight = (block, pos, level) => {
    let height = 1
    let currentAbovePos = pos.above()
    let currentBelowPos = pos.below()
    let aboveBlock = level.getBlock(currentAbovePos)
    let belowBlock = level.getBlock(currentBelowPos)

    while (aboveBlock.getId() === block.getId()) {
        height++
        currentAbovePos = currentAbovePos.above()
        aboveBlock = level.getBlock(currentAbovePos)
    }

    while (belowBlock.getId() === block.getId()) {
        height++
        currentBelowPos = currentBelowPos.below()
        belowBlock = level.getBlock(currentBelowPos)
    }

    return height
}

/**
 * 
 * @param { import("dev.latvian.mods.kubejs.level.LevelBlock").$LevelBlock$$Type  } block
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { import("net.minecraft.world.level.Level").$Level } level 
 */
const getTopAir = (block, pos, level) => {
    let currentPos = pos.above()
    let aboveBlock = level.getBlock(currentPos)

    while (aboveBlock.getId() === block.getId()) {
        currentPos = currentPos.above()
        aboveBlock = level.getBlock(currentPos)
    }
    
    return currentPos
}

/**
 * 
 * @param { import("net.minecraft.world.level.Level").$Level } level 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 */
const composterSpawn = (level, pos) => {
    for (let i = 0; i <= 25; i++) {
        level.spawnParticles(
            'minecraft:composter', false,
            pos.x + level.random.nextDouble(),
            pos.y + level.random.nextDouble(),
            pos.z + level.random.nextDouble(),
            0, 0, 0, 1, 0
        )
    }
}