/**
 * 
 * @param { string } uuid 
 */
function CounterServerState(uuid) {
    /** @type { string } */
    this.uuid = uuid
    /** @type { number } */
    this.step = 0
    /** @type { import("net.minecraft.core.BlockPos").$BlockPos } */
    this.firstPos = null
    /** @type { import("net.minecraft.core.BlockPos").$BlockPos } */
    this.secondPos = null
}

/** @type { Object<string, CounterServerState> } */
CounterServerState.cache = {}

/**
 * 
 * @param { string } uuid 
 */
CounterServerState.get = function(uuid) {
    if (!this.cache[uuid]) this.cache[uuid] = new CounterServerState(uuid)

    return this.cache[uuid]
}

/**
 * 
 * @param { string } uuid 
 */
CounterServerState.reset = function(uuid) {
    delete this.cache[uuid]
}