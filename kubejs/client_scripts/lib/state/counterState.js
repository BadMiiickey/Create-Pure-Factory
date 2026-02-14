/**
 * 
 * @constructor
 * @param { string } uuid 
 */
function CounterState(uuid) {
    /** @type { string } */
    this.uuid = uuid
    /** @type { import("net.minecraft.core.BlockPos").$BlockPos } */
    this.firstPos = null
    /** @type { import("net.minecraft.core.BlockPos").$BlockPos } */
    this.secondPos = null
    /** @type { boolean } */
    this.everyBlock = false
    /** @type { number } */
    this.scroll = 0
    /** @type { Object<string, number> } */
    this.cacheCounts = null
}

/** @type { Object<string, CounterState> } */
CounterState.cache = {}

/**
 * 
 * @param { string } uuid 
 */
CounterState.get = function(uuid) {
    if (!this.cache[uuid]) this.cache[uuid] = new CounterState(uuid)

    return this.cache[uuid]
}

/**
 * 
 * @param { string } uuid 
 */
CounterState.reset = function(uuid) {
    delete this.cache[uuid]
}

CounterState.prototype = {
    constructor: CounterState,

    /**
     * 
     * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
     */
    setFirstPos: function(pos) {
        this.firstPos = pos
        this.cacheCounts = null
        this.scroll = 0
    },

    /**
     * 
     * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
     */
    setSecondPos: function(pos) {
        this.secondPos = pos
        this.cacheCounts = null
        this.scroll = 0
    },

    /**
     * 
     * @param { boolean } everyBlock 
     */
    setEveryBlock: function(everyBlock) {
        this.everyBlock = everyBlock
    },

    /**
     * 
     * @param { number } delta 
     */
    doScroll: function(delta) {
        if (!this.everyBlock) return

        const newScroll = this.scroll - delta
        
        this.scroll = Math.max(0, newScroll)
    },

    /**
     * 
     * @param { import("net.minecraft.core.BlockPos").$BlockPos } currentRayTracePos 
     */
    getAABB: function(currentRayTracePos) {
        if (!this.firstPos) return null

        const secondPos = this.secondPos || currentRayTracePos

        if (!secondPos) return null

        return createAABBForBlocks(this.firstPos, secondPos)
    },

    /**
     * 
     * @param { import("net.minecraft.world.level.Level").$Level } level 
     */
    getBlockCount: function(level) {
        if (this.cacheCounts) return this.cacheCounts 
        if (!this.firstPos || !this.secondPos) return {}

        const aabb = this.getAABB(null)

        if (!aabb) return {}

        this.cacheCounts = getBlocksInAABB(level, aabb)

        return this.cacheCounts
    }
}