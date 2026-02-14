/**
 * 
 * @constructor
 * @param { string } uuid 
 */
function CounterState(uuid) {
    this.uuid = uuid
    this.firstPos = null
    this.secondPos = null
    this.everyBlock = false
    this.scroll = 0
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

    setFirstPos: function(pos) {
        this.firstPos = pos
        this.cacheCounts = null
        this.scroll = 0
    },

    setSecondPos: function(pos) {
        this.secondPos = pos
        this.cacheCounts = null
        this.scroll = 0
    },

    setEveryBlock: function(everyBlock) {
        this.everyBlock = everyBlock
    },

    doScroll: function(delta) {
        if (!this.everyBlock) return

        const newScroll = this.scroll - delta
        
        this.scroll = Math.max(0, newScroll)
    },

    getAABB: function(currentRayTracePos) {
        if (!this.firstPos) return null

        const secondPos = this.secondPos || currentRayTracePos

        if (!secondPos) return null

        return createAABBForBlocks(this.firstPos, secondPos)
    },

    getBlockCount: function(level) {
        if (this.cacheCounts) return this.cacheCounts 
        if (!this.firstPos || !this.secondPos) return {}

        const aabb = this.getAABB(null)

        if (!aabb) return {}

        this.cacheCounts = getBlocksInAABB(level, aabb)

        return this.cacheCounts
    }
}