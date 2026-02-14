/**
 * 
 * @param { import("net.minecraft.world.level.Level").$Level } level 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } aabb 
 * @returns { Object<string, number> }
 */
const getBlocksInAABB = (level, aabb) => {
    /** @type { Object<string, number> } */
    const blocks = {}

    forEachPosInAABB(aabb, pos => {
        let state = level.getBlockState(pos)

        if (!state || state.isAir()) return
        if (!state.fluidState.isEmpty() && !state.fluidState.isSource()) return

        blocks[state.getId()] = (blocks[state.getId()] || 0) + 1
    })

    /** @type { Object<string, number> } */
    const sortedBlocks = {}
    
    Object.keys(blocks).sort().forEach(id => {
        sortedBlocks[id] = blocks[id]
    })
    
    return sortedBlocks
}