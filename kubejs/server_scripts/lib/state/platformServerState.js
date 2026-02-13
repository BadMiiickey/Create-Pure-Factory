/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 */
function PlatformServerState(pos) {
    /** @type { import("net.minecraft.core.BlockPos").$BlockPos } */
    this.pos = pos
    /** @type { number } */
    this.yOffset = 0
}

PlatformServerState.get = function(pos) {
    var key = pos.x + ":" + pos.y + ":" + pos.z
    if (!_serverStates[key]) {
        _serverStates[key] = new PlatformServerState(pos)
    }
    return _serverStates[key]
}

PlatformServerState.remove = function(pos) {
    var key = pos.x + ":" + pos.y + ":" + pos.z
    if (_serverStates[key]) {
        delete _serverStates[key]
    }
}

/** @type { Object.<string, PlatformServerState> } */
const _serverStates = {}