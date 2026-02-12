/**
 * 
 * @param { import("net.minecraft.world.entity.player.Player").$Player$$Type } player 
 */
const getMaxMiningItems = (player) => {
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
    const shovelItem = allItems.stream()
        .filter(item => item.isCorrectToolForDrops(Blocks.SNOW_BLOCK.defaultBlockState()))
        .findFirst()
        .orElse(null)
    const axeItem = allItems.stream()
        .filter(item => item.isCorrectToolForDrops(Blocks.OAK_WOOD.defaultBlockState()))
        .findFirst()
        .orElse(null)

    if (canMineObsidianItem) return [canMineObsidianItem, shovelItem, axeItem]
    if (canMineIronBlockItem) return [canMineIronBlockItem, shovelItem, axeItem]
    if (canMineStoneItem) return [canMineStoneItem, shovelItem, axeItem]

    return [null, shovelItem, axeItem]
}

/**
 * 
 * @param { import("net.minecraft.world.level.Level").$Level } level 
 * @param { import("net.minecraft.server.MinecraftServer").$MinecraftServer$$Type } server
 * @param { import("net.minecraft.world.entity.player.Player").$Player$$Type } player
 * @param { import("net.minecraft.world.phys.AABB").$AABB } frameAABB 
 * @param { import("net.minecraft.world.item.ItemStack").$ItemStack } maxMiningLevelItem 
 * @param { import("net.minecraft.world.item.ItemStack").$ItemStack } shovelItem
 * @param { import("net.minecraft.world.item.ItemStack").$ItemStack } axeItem
 */
const breakBlocks = (level, server, player, frameAABB, maxMiningLevelItem, shovelItem, axeItem) => {
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
                    || (shovelItem && shovelItem.isCorrectToolForDrops(blockState))
                    || (axeItem && axeItem.isCorrectToolForDrops(blockState))
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