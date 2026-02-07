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

/**
 * 
 * @param { import("net.minecraft.resources.ResourceKey").$ResourceKey$$Type<import("net.minecraft.world.level.block.Block").$Block$$Type> } id 
 */
const getHitBlock = (id) => {
    const { level, hitResult } = Client
    const hitPos = hitResult.getLocation()
    let [x, y, z] = [Math.floor(hitPos.x()), Math.floor(hitPos.y()), Math.floor(hitPos.z())]

    for (let dy of [-1, 0, 1]) {
        for (let dx of [-1, 0, 1]) {
            for (let dz of [-1, 0, 1]) {
                let block = level.getBlock(x + dx, y + dy, z + dz)

                if (block.getId() !== id) continue

                return block
            }
        }
    }

    return null
}