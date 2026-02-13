/** @type {{ string: { string: string }}} */
const breakPoses = {}
/** @type {{ string: { string: string }}} */
const counterPoses = {}
/** @type {{ string: { string: string }}} */
const placePoses = {}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } frameAABB 
 */
const createChunkedPlatformRenderer = (hitPos, frameAABB) => {
    const chunkRenderers = []
    const { minX, minY, minZ, maxX, maxY, maxZ } = frameAABB
    const chunkSize = 16

    for (let x = minX; x < maxX; x += chunkSize) {
        for (let z = minZ; z < maxZ; z += chunkSize) {
            let chunkAABB = AABB.of(x, minY, z, x + chunkSize, maxY, z + chunkSize)
            let builder = new PlatformBuilder(chunkAABB)

            builder.buildStoneBase()
                .buildPlatform(hitPos, frameAABB)

            chunkRenderers.push({
                renderer: builder.buildRenderer(),
                aabb: chunkAABB,
                anchor: builder.anchor
            })
        }
    }

    return chunkRenderers
}

/**
 * 
 * @param { import("net.minecraft.world.level.block.entity.BlockEntity").$BlockEntity$$Type } blockEntity 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } frameAABB 
 * @param { number } color 
 */
const showFrame = (blockEntity, frameAABB, color) => {
    outliner.showAABB(blockEntity, frameAABB)
        .withFaceTextures($AllSpecialTextures.CHECKERED, $AllSpecialTextures.HIGHLIGHT_CHECKERED)
        .colored(color)
        .disableLineNormals()
        .lineWidth(0.0625)
}