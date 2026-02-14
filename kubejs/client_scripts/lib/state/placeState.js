/**
 * 
 * @constructor
 * @param { string } uuid 
 */
function PlaceState(uuid) {
    /** @type { string } */
    this.uuid = uuid
    /** @type { number } */
    this.step = 0
    /** @type { import("net.minecraft.core.BlockPos").$BlockPos } */
    this.firstPos = null
    /** @type { import("net.minecraft.core.BlockPos").$BlockPos } */
    this.secondPos = null
}

/** @type { Object<string, PlaceState> } */
PlaceState.cache = {}

PlaceState.get = function(uuid) {
    if (!PlaceState.cache[uuid]) PlaceState.cache[uuid] = new PlaceState(uuid)

    return PlaceState.cache[uuid]
}

PlaceState.reset = function(uuid) {
    delete PlaceState.cache[uuid]
}

PlaceState.prototype = {
    constructor: PlaceState,

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
}