/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { import("net.minecraft.world.level.Level").$Level } level 
 */
const getSugarCaneTopAir = (pos, level) => {
    let currentPos = pos.above()
    let aboveBlock = level.getBlock(currentPos)

    while (aboveBlock.getId() === 'minecraft:sugar_cane') {
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