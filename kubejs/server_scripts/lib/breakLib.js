/**
 * 
 * @param { string } key 
 */
const getPosFromKey = (key) => {
    const [x, y, z] = key.split(',').map(char => Number(char))

    return new BlockPos(x, y, z)
}

/**
 * 
 * @param { import("net.minecraft.world.entity.player.Player").$Player$$Type } player 
 */
const getMaxMiningLevelItem = (player) => {
    const allItems = player.inventory.getAllItems()
    const canMineObsidianItem = allItems.stream()
        .filter(item => item.isCorrectToolForDrops(Blocks.OBSIDIAN.defaultBlockState()))
        .findFirst()
        .orElse(null)
    const canMineIronBlockItem = allItems.stream()
        .filter(item => item.isCorrectToolForDrops(Blocks.IRON_BLOCK.defaultBlockState()))
        .findFirst()
        .orElse(null)
    const canMineStoneItem = allItems.stream()
        .filter(item => item.isCorrectToolForDrops(Blocks.STONE.defaultBlockState()))
        .findFirst()
        .orElse(null)

    if (canMineObsidianItem) return canMineObsidianItem
    if (canMineIronBlockItem) return canMineIronBlockItem
    if (canMineStoneItem) return canMineStoneItem
    return null
}

/**
 * 
 * @param { import("net.minecraft.world.level.Level").$Level } level 
 * @param { import("net.minecraft.server.MinecraftServer").$MinecraftServer$$Type } server
 * @param { import("net.minecraft.world.entity.player.Player").$Player$$Type } player
 * @param { import("net.minecraft.world.phys.AABB").$AABB } frameAABB 
 * @param { import("net.minecraft.world.item.ItemStack").$ItemStack } maxMiningLevelItem 
 */
const breakBlocks = (level, server, player, frameAABB, maxMiningLevelItem) => {
    let counter = 0
    const totalSteps = frameAABB.maxY - frameAABB.minY
    let cannotMine = false
    const cannotMineMessage = Component.translate('message.purefactory.easy_break.cannot_mine').red()

    function breakStep(dy) {
        for (let dx = frameAABB.minX; dx <= frameAABB.maxX - 1; dx++) {
            for (let dz = frameAABB.minZ; dz <= frameAABB.maxZ - 1; dz++) {
                let breakPos = new BlockPos(dx, dy, dz)
                let blockState = level.getBlockState(breakPos)

                if (
                    !blockState.requiresCorrectToolForDrops()
                    || (maxMiningLevelItem && maxMiningLevelItem.isCorrectToolForDrops(blockState))
                ) {
                    level.destroyBlock(breakPos, true)
                    continue
                }

                if (!cannotMine) {
                    player.tell(cannotMineMessage)
                    cannotMine = true
                }
            }
        }

        counter++

        if (counter <= totalSteps) {
            server.scheduleInTicks(10, () => breakStep(frameAABB.minY + counter))
        }
    }

    breakStep(frameAABB.minY)
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } firstPos 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } secondPos 
 */
const createAABBForBlocks = (firstPos, secondPos) => {
    const minX = Math.min(firstPos.x, secondPos.x)
    const minY = Math.min(firstPos.y, secondPos.y)
    const minZ = Math.min(firstPos.z, secondPos.z)
    const maxX = Math.max(firstPos.x, secondPos.x) + 1
    const maxY = Math.max(firstPos.y, secondPos.y) + 1
    const maxZ = Math.max(firstPos.z, secondPos.z) + 1

    return AABB.of(minX, minY, minZ, maxX, maxY, maxZ)
}