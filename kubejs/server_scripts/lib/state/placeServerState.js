/**
 * 
 * @constructor
 * @param { string } uuid 
 */
function PlaceServerState(uuid) {
    /** @type { string } */
    this.uuid = uuid
    /** @type { import("net.minecraft.core.BlockPos").$BlockPos } */
    this.firstPos = null
    /** @type { import("net.minecraft.core.BlockPos").$BlockPos } */
    this.secondPos = null
}

/** @type { Object<string, PlaceServerState> } */
PlaceServerState.cache = {}

PlaceServerState.get = function(uuid) {
    if (!PlaceServerState.cache[uuid]) PlaceServerState.cache[uuid] = new PlaceServerState(uuid)

    return PlaceServerState.cache[uuid]
}

PlaceServerState.reset = function(uuid) {
    delete PlaceServerState.cache[uuid]
}