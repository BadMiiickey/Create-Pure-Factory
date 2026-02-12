/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } fakePos
 */
const isSnowCenter = (hitPos, fakePos) => {
    let relativeX = fakePos.x - hitPos.x
    let relativeZ = fakePos.z - hitPos.z

    return ((relativeX + relativeZ) % 6 === 0) && (Math.abs(relativeX - relativeZ) % 6 === 0)
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } fakePos
 */
const isConcreteCenter = (hitPos, fakePos) => {
    let relativeX = fakePos.x - hitPos.x
    let relativeZ = fakePos.z - hitPos.z

    return ((relativeX + relativeZ + 3) % 6 === 0) && (Math.abs(relativeX - relativeZ + 3) % 6 === 0)
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } fakePos
 */
const isBlackFrame = (hitPos, fakePos) => {
    let relativeX = fakePos.x - hitPos.x
    let relativeZ = fakePos.z - hitPos.z
    let blockX = (relativeX / 2) | 0
    let blockZ = (relativeZ / 2) | 0

    return (blockX + blockZ) % 2 === 0
}