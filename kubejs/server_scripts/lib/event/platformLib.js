//priority: 99
const scrollYOffsets = {}

/**
 * 
 * @param { import("net.minecraft.world.level.block.state.BlockState").$BlockState } state 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { import("net.minecraft.world.level.Level").$Level } level 
 */
const setNeighborBlocks = (state, pos, level) => {
    neighbors.forEach(([offX, offZ]) => level.setBlockAndUpdate(new BlockPos(pos.x + offX, pos.y, pos.z + offZ), state))
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } placePos
 */
const isSnowCenter = (pos, placePos) => {
    let relativeX = placePos.x - pos.x
    let relativeZ = placePos.z - pos.z

    return ((relativeX + relativeZ) % 6 === 0) && (Math.abs(relativeX - relativeZ) % 6 === 0)
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } placePos
 */
const isConcreteCenter = (pos, placePos) => {
    let relativeX = placePos.x - pos.x
    let relativeZ = placePos.z - pos.z

    return ((relativeX + relativeZ + 3) % 6 === 0) && (Math.abs(relativeX - relativeZ + 3) % 6 === 0)
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } placePos
 */
const isBlackFrame = (pos, placePos) => {
    let relativeX = placePos.x - pos.x
    let relativeZ = placePos.z - pos.z
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
    const { stone, snowBlock, lightGrayConcrete, blackConcrete, yellowConcrete } = blockStates
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

        const fillAABB = frameAABB.setMinY(dy).setMaxY(dy + 1)

        forEachPosInAABB(fillAABB, pos => {
            if (stoneAABB.contains(pos.center)) {
                level.setBlockAndUpdate(pos, stone)
            } else if (platformAABB.contains(pos.center)) {
                if (innerAABB.contains(pos.center)) {
                    if (isSnowCenter(blockPos, pos)) {
                        level.setBlockAndUpdate(pos, snowBlock)
                        setNeighborBlocks(lightGrayConcrete, pos, level)
                    } else if (isConcreteCenter(blockPos, pos)) {
                        level.setBlockAndUpdate(pos, lightGrayConcrete)
                        setNeighborBlocks(snowBlock, pos, level)
                    }
                } else {
                    if (isBlackFrame(blockPos, pos)) {
                        level.setBlockAndUpdate(pos, blackConcrete)
                    } else {
                        level.setBlockAndUpdate(pos, yellowConcrete)
                    }
                }
            } else {
                level.destroyBlock(pos, false)
            }
        })
        
        counter++

        if (counter <= totalSteps) {
            server.scheduleInTicks(10, () => fillStep(frameAABB.minY + counter))
        } else {
            player.tell(completionMessage)
        }
    }

    fillStep(frameAABB.minY)
}