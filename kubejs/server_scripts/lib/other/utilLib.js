/**
 * 
 * @param { string } key 
 */
const getPosFromKey = (key) => {
    if (!key) return null

    const [x, y, z] = key.split(',').map(char => Number(char))

    return new BlockPos(x, y, z)
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
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 */
const createPosKey = (pos) => {
    return `${pos.x},${pos.y},${pos.z}`
}

/**
 * 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } aabb 
 * @param { (pos: import("net.minecraft.core.BlockPos").$BlockPos) => void } callback 
 */
const forEachPosInAABB = (aabb, callback) => {
    for (let y = aabb.minY; y <= aabb.maxY - 1; y++) {
        for (let x = aabb.minX; x <= aabb.maxX - 1; x++) {
            for (let z = aabb.minZ; z <= aabb.maxZ - 1; z++) {
                callback(new BlockPos(x, y, z))
            }
        }
    }
}