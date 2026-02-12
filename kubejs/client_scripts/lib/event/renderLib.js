/** @type {{ string: import("net.minecraft.world.phys.AABB").$AABB$$Type }} */
const frameAABBs = {}
/** @type {{ string: number }} */
const scrollYOffsets = {}
/** @type {{ string: { string: string }}} */
const breakPoses = {}
const schematicRenderers = {}
/** @type {{ string: { string: string }}} */
const counterPoses = {}
/** @type {{ string: { string: string }}} */
const placePoses = {}

/**
 * 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } frameAABB 
 */
const prepareSchematicLevel = (frameAABB) => {
    const anchor = new BlockPos(frameAABB.minX, frameAABB.minY, frameAABB.minZ)
    const level = new $SchematicLevel(anchor, Client.level)
    /**
     * 
     * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
     * @param { import("net.minecraft.world.level.block.state.BlockState").$BlockState$$Type } state 
     */
    const setBlock = (pos, state) => {
        const realState = Client.level.getBlockState(pos)

        if (!realState.isAir()) return

        level.setBlock(pos, state, 3)
    }

    return { 
        level: level, 
        anchor: anchor, 
        setBlock: setBlock  
    }
}

/**
 * 
 * @param { (pos: import("net.minecraft.core.BlockPos").$BlockPos, state: import("net.minecraft.world.level.block.state.BlockState").$BlockState$$Type) => void } setBlock 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } frameAABB 
 */
const buildStoneBase = (setBlock, frameAABB) => {
    const stoneAABB = frameAABB.setMaxY(frameAABB.maxY - 9)
    const innerHollowAABB = stoneAABB.deflate(1).setMaxY(frameAABB.maxY - 9)

    forEachPosInAABB(stoneAABB, pos => {
        if (innerHollowAABB.contains(pos.center)) return

        setBlock(pos, blockStates.stone)
    })
}

/**
 * 
 * @param { (pos: import("net.minecraft.core.BlockPos").$BlockPos, state: import("net.minecraft.world.level.block.state.BlockState").$BlockState$$Type) => void } setBlock 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } frameAABB 
 */
const buildPlatform = (setBlock, hitPos, frameAABB) => {
    const platformAABB = frameAABB.setMinY(frameAABB.minY + 4).setMaxY(frameAABB.maxY - 8)
    const innerPatternAABB = platformAABB.deflate(2)
    const y = platformAABB.minY
    const { snowBlock, lightGrayConcrete, yellowConcrete, blackConcrete } = blockStates

    forEachPosInAABB(platformAABB, fakePos => {
        if (innerPatternAABB.contains(fakePos.center)) {
            if (isSnowCenter(hitPos, fakePos)) {
                setBlock(fakePos, snowBlock)
                setNeighborBlocks(setBlock, fakePos, lightGrayConcrete)
                
            } else if (isConcreteCenter(hitPos, fakePos)) {
                setBlock(fakePos, lightGrayConcrete)
                setNeighborBlocks(setBlock, fakePos, snowBlock)
            }
        } else {
            if (isBlackFrame(hitPos, fakePos)) {
                setBlock(fakePos, blackConcrete)
            } else {
                setBlock(fakePos, yellowConcrete)
            }
        }
    })
}

/**
 * 
 * @param { (pos: import("net.minecraft.core.BlockPos").$BlockPos, state: import("net.minecraft.world.level.block.state.BlockState").$BlockState$$Type) => void } setBlock 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 * @param { import("net.minecraft.world.level.block.state.BlockState").$BlockState$$Type } state 
 */
const setNeighborBlocks = (setBlock, pos, state) => {
    neighbors.forEach(([offX, offZ]) => setBlock(new BlockPos(pos.x + offX, pos.y, pos.z + offZ), state))
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { import("net.minecraft.world.phys.AABB").$AABB } frameAABB 
 * @returns 
 */
const createPlatformRenderer = (hitPos, frameAABB) => {
    const { level, setBlock } = prepareSchematicLevel(frameAABB)

    buildStoneBase(setBlock, frameAABB)
    buildPlatform(setBlock, hitPos, frameAABB)

    return new $SchematicRenderer(level)
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