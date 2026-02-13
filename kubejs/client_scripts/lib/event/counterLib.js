/**
 * 
 * @param { import("net.minecraft.world.level.Level").$Level } level 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } aabb 
 */
const getBlocksInAABB = (level, aabb) => {
    const blocks = {}

    forEachPosInAABB(aabb, pos => {
        let block = level.getBlock(pos)

        if (!block || block.getBlockState().isAir()) return

        blocks[block.getId()] = (blocks[block.getId()] || 0) + 1
    })
    
    return blocks
}