/**
 * 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } frameAABB 
 */
const counterAABB = (frameAABB) => {
    const lengthX = Math.floor(frameAABB.maxX - frameAABB.minX)
    const lengthY = Math.floor(frameAABB.maxY - frameAABB.minY)
    const lengthZ = Math.floor(frameAABB.maxZ - frameAABB.minZ)
    const totalBlock = Math.floor(lengthX * lengthY * lengthZ)

    return [
        Component.literal(lengthX).green(), 
        Component.literal(lengthY).green(), 
        Component.literal(lengthZ).green(), 
        Component.literal(totalBlock).green()
    ]
}