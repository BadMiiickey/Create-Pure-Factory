/**
 * 
 * @constructor
 * @param { import("net.minecraft.world.phys.AABB").$AABB } aabb 
 */
function PlatformBuilder(aabb) {
    /** @type { import("net.minecraft.world.phys.AABB").$AABB } */
    this.aabb = aabb
    /** @type { import("net.minecraft.core.BlockPos").$BlockPos } */
    this.anchor = new BlockPos(aabb.minX, aabb.minY, aabb.minZ)
    /** @type { import("net.createmod.catnip.levelWrappers.SchematicLevel").$SchematicLevel$$Type } */
    this.level = new $SchematicLevel(this.anchor, Client.level)
}

PlatformBuilder.prototype = {
    constructor: PlatformBuilder,

    /**
     * 
     * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
     * @param { import("net.minecraft.world.level.block.state.BlockState").$BlockState$$Type } state 
     */
    setBlock: function(pos, state) {
        if (!Client.level.getBlockState(pos).isAir()) return
        
        this.level.setBlock(pos, state, 3)
    },

    buildStoneBase: function() {
        const stoneAABB = this.aabb.setMaxY(this.aabb.maxY - 9)
        const innerHollowAABB = stoneAABB.deflate(1).setMaxY(this.aabb.maxY - 9)

        forEachPosInAABB(stoneAABB, pos => {
            if (innerHollowAABB.contains(pos.center)) return

            this.setBlock(pos, blockStates.stone)
        })

        return this
    },

    /**
     * 
     * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
     * @param { import("net.minecraft.world.phys.AABB").$AABB } frameAABB 
     */
    buildPlatform: function(hitPos, frameAABB) {
        const { snowBlock, lightGrayConcrete, yellowConcrete, blackConcrete } = blockStates
        const y = frameAABB.minY + 4
        const platformInnerAABB = frameAABB
            .deflate(2, 0, 2)
            .setMinY(y)
            .setMaxY(y + 1)
        const chunkIterAABB = this.aabb
            .setMinY(y)
            .setMaxY(y + 1)

        forEachPosInAABB(chunkIterAABB, fakePos => {
            if (platformInnerAABB.contains(fakePos.center)) {
                if (isSnowCenter(hitPos, fakePos)) {
                    this.setBlock(fakePos, snowBlock)
                    return
                }

                if (isConcreteCenter(hitPos, fakePos)) {
                    this.setBlock(fakePos, lightGrayConcrete)
                    return
                }

                for (let [offX, offZ] of neighbors) {
                    let neighborPos = fakePos.offset(offX, 0, offZ)

                    if (isSnowCenter(hitPos, neighborPos)) {
                        this.setBlock(fakePos, lightGrayConcrete)
                        break
                    }

                    if (isConcreteCenter(hitPos, neighborPos)) {
                        this.setBlock(fakePos, snowBlock)
                        break
                    }
                }

                return
            } 

            if (isBlackFrame(hitPos, fakePos)) {
                this.setBlock(fakePos, blackConcrete)
                return
            } 

            this.setBlock(fakePos, yellowConcrete)
        })

        return this
    },

    buildRenderer: function() {
        return new $SchematicRenderer(this.level)
    }
}