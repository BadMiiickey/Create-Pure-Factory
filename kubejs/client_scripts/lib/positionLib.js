/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { number } dx 
 * @param { number } dz 
 */
const isSnowCenter = (hitPos, dx, dz) => {
    let relativeX = dx - hitPos.x
    let relativeZ = dz - hitPos.z

    return ((relativeX + relativeZ) % 6 === 0) && (Math.abs(relativeX - relativeZ) % 6 === 0)
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { number } dx 
 * @param { number } dz 
 */
const isConcreteCenter = (hitPos, dx, dz) => {
    let relativeX = dx - hitPos.x
    let relativeZ = dz - hitPos.z

    return ((relativeX + relativeZ + 3) % 6 === 0) && (Math.abs(relativeX - relativeZ + 3) % 6 === 0)
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { number } dx 
 * @param { number } dz 
 */
const isBlackFrame = (hitPos, dx, dz) => {
    let relativeX = dx - hitPos.x
    let relativeZ = dz - hitPos.z
    let blockX = (relativeX / 2) | 0
    let blockZ = (relativeZ / 2) | 0

    return (blockX + blockZ) % 2 === 0
}