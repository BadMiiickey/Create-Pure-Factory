//priority: 99
const scrollYOffsets = {}

/**
 * 
 * @param { import("net.minecraft.resources.ResourceKey").$ResourceKey$$Type<import("net.minecraft.world.level.block.Block").$Block$$Type> } id 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { import("net.minecraft.world.level.Level").$Level$$Type } level 
 */
const setSideBlock = (id, pos, level) => {
    for (let dx of [-1, 0, 1]) {
        for (let dz of [-1, 0, 1]) {
            if (dx === 0 && dz === 0) continue
            
            level.getBlock(pos.x + dx, pos.y, pos.z + dz).set(id)
        }
    }
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { number } dx 
 * @param { number } dz 
 */
const isSnowCenter = (pos, dx, dz) => {
    let relativeX = dx - pos.x
    let relativeZ = dz - pos.z

    return ((relativeX + relativeZ) % 6 === 0) && (Math.abs(relativeX - relativeZ) % 6 === 0)
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { number } dx 
 * @param { number } dz 
 */
const isConcreteCenter = (pos, dx, dz) => {
    let relativeX = dx - pos.x
    let relativeZ = dz - pos.z

    return ((relativeX + relativeZ + 3) % 6 === 0) && (Math.abs(relativeX - relativeZ + 3) % 6 === 0)
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { number } dx 
 * @param { number } dz 
 */
const isBlackFrame = (pos, dx, dz) => {
    let relativeX = dx - pos.x
    let relativeZ = dz - pos.z
    let blockX = (relativeX / 2) | 0
    let blockZ = (relativeZ / 2) | 0

    return (blockX + blockZ) % 2 === 0
}

/**
 * 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } frameAABB 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } stoneAABB 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } platformAABB 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } innerAABB 
 * @param { import("net.minecraft.world.level.Level").$Level } level 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } blockPos
 * @param { import("net.minecraft.world.entity.player.Player").$Player$$Type } player 
 */
const platformFill = (frameAABB, stoneAABB, platformAABB, innerAABB, level, blockPos, player) => {
    const { server } = level
    let counter = 0
    const totalSteps = frameAABB.maxY - frameAABB.minY
    const frameFillingMessage = Component.translatable('message.purefactory.platform_filling.frame').yellow()
    const stoneFillingMessage = Component.translatable('message.purefactory.platform_filling.stone').yellow()
    const platformFillingMessage = Component.translatable('message.purefactory.platform_filling.platform').yellow()
    const airFillingMessage = Component.translatable('message.purefactory.platform_filling.air').yellow()
    const completionMessage = Component.translatable('message.purefactory.platform_filling.complete').green()

    player.tell(frameFillingMessage)

    function fillStep(dy) {
        switch (dy) {
            case stoneAABB.minY: 
                player.tell(stoneFillingMessage)
                break
            case platformAABB.minY:
                player.tell(platformFillingMessage)
                break
            case platformAABB.maxY + 1:
                player.tell(airFillingMessage)
                break
        }

        for (let dx = frameAABB.minX; dx <= frameAABB.maxX - 1; dx++) {
            for (let dz = frameAABB.minZ; dz <= frameAABB.maxZ - 1; dz++) {
                let pos = new BlockPos(dx, dy, dz)
                let placeBlock = level.getBlock(pos)
                
                if (stoneAABB.contains(pos.center)) {
                    placeBlock.set('minecraft:stone')
                } else if (platformAABB.contains(pos.center)) {
                    if (innerAABB.contains(pos.center)) {
                        if (isSnowCenter(blockPos, dx, dz)) {
                            placeBlock.set('minecraft:snow_block')
                            setSideBlock('minecraft:light_gray_concrete', pos, level)
                        } else if (isConcreteCenter(blockPos, dx, dz)) {
                            placeBlock.set('minecraft:light_gray_concrete')
                            setSideBlock('minecraft:snow_block', pos, level)
                        }
                    } else {
                        if (isBlackFrame(blockPos, dx, dz)) {
                            placeBlock.set('minecraft:black_concrete')
                        } else {
                            placeBlock.set('minecraft:yellow_concrete')
                        }
                    }
                } else {
                    level.destroyBlock(pos, false)
                }   
            }
        }
        
        counter++

        if (counter <= totalSteps) {
            server.scheduleInTicks(10, () => fillStep(frameAABB.minY + counter))
        } else {
            player.tell(completionMessage)
        }
    }

    fillStep(frameAABB.minY)
}