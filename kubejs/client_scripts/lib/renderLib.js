/** @type {{ string: import("net.minecraft.world.phys.AABB").$AABB$$Type }} */
const frameAABBs = {}
/** @type {{ string: number }} */
const scrollYOffsets = {}
/** @type {{ string: string }} */
const breakPoses = {}
const schematicRenderers = {}

/**
 * 
 * @param { import("net.minecraft.resources.ResourceKey").$ResourceKey$$Type<import("net.minecraft.world.level.block.Block").$Block$$Type> } id 
 * @param { double= } scrollDeltaY 
 */
const getHitBlock = (id, scrollDeltaY) => {
    const { level, hitResult } = Client
    const hitPos = hitResult.getLocation()
    let [x, y, z] = [Mth.floor(hitPos.x()), Mth.floor(hitPos.y()), Mth.floor(hitPos.z())]

    for (let dy of [-1, 0, 1]) {
        for (let dx of [-1, 0, 1]) {
            for (let dz of [-1, 0, 1]) {
                let block = level.getBlock(x + dx, y + dy, z + dz)

                if (block.getId() !== id) continue
                if (typeof scrollDeltaY !== 'undefined' && scrollDeltaY !== 0) {
                    let key = `${x + dx},${y},${z + dz}`
                
                    if (!scrollYOffsets[key]) scrollYOffsets[key] = 0

                    scrollYOffsets[key] += scrollDeltaY
                }

                return block
            }
        }
    }
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 */
const getAirPos = (hitPos) => {
    const { level } = Client

    for (let dy of [-1, 0, 1]) {
        for (let dx of [-1, 0, 1]) {
            for (let dz of [-1, 0, 1]) {
                let pos = new BlockPos(hitPos.x + dx, hitPos.y + dy, hitPos.z + dz)
                let block = level.getBlock(pos)

                if (block.getId() !== 'minecraft:air') continue

                return pos
            }
        }
    }

    return hitPos
}

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

    for (let dy = stoneAABB.minY; dy <= stoneAABB.maxY; dy++) {
        for (let dx = stoneAABB.minX; dx <= stoneAABB.maxX - 1; dx++) {
            for (let dz = stoneAABB.minZ; dz <= stoneAABB.maxZ - 1; dz++) {
                let fakePos = new BlockPos(dx, dy, dz)

                if (innerHollowAABB.contains(fakePos.center)) continue

                setBlock(fakePos, blockStates.stone)
            }
        }
    }
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
    const neighbors = [[1,0], [-1,0], [0,1], [0,-1], [1,1], [-1,-1], [1,-1], [-1,1]]
    const { snowBlock, lightGrayConcrete, yellowConcrete, blackConcrete } = blockStates

    for (let dx = platformAABB.minX; dx <= platformAABB.maxX - 1; dx++) {
        for (let dz = platformAABB.minZ; dz <= platformAABB.maxZ - 1; dz++) {
            let fakePos = new BlockPos(dx, y, dz)

            if (innerPatternAABB.contains(fakePos.center)) {
                if (isSnowCenter(hitPos, dx, dz)) {
                    setBlock(fakePos, snowBlock)
                    neighbors.forEach(([offX, offZ]) => setBlock(new BlockPos(dx + offX, y, dz + offZ), lightGrayConcrete))
                    
                } else if (isConcreteCenter(hitPos, dx, dz)) {
                    setBlock(fakePos, lightGrayConcrete)
                    neighbors.forEach(([offX, offZ]) => setBlock(new BlockPos(dx + offX, y, dz + offZ), snowBlock))
                }
            } else {
                if (isBlackFrame(hitPos, dx, dz)) {
                    setBlock(fakePos, blackConcrete)
                } else {
                    setBlock(fakePos, yellowConcrete)
                }
            }
        }
    }
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
 * @param { string } key 
 */
const getPosFromKey = (key) => {
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