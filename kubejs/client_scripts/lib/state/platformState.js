/**
 * 
 * @constructor
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } pos 
 */
function PlatformState(pos) {
    /** @type { import("net.minecraft.core.BlockPos").$BlockPos } */
    this.pos = pos
    /** @type { number } */
    this.yOffset = 0
    /** @type { import("net.minecraft.world.phys.AABB").$AABB } */
    this.frameAABB = null
    /** @type { import("com.simibubi.create.content.schematics.client.SchematicRenderer").$SchematicRenderer$$Type[] } */
    this.renderers = null
    /** @type { string } */
    this.lastFingerprint = ''
}

PlatformState.prototype = {
    constructor: PlatformState,

    /**
     * 
     * @param { import("net.minecraft.world.level.block.state.properties.DirectionProperty").$DirectionProperty$$Type } facing 
     */
    tick: function(facing) {
        const [expandX, expandY, expandZ] = expandMap[facing.toString()]

        this.frameAABB = AABB.ofBlock(this.pos)
            .expandTowards(expandX, expandY, expandZ)
            .expandTowards(0, -4, 0)
            .move(0, this.yOffset, 0)

        const fingerprint = this.frameAABB.toString()

        if (this.lastFingerprint !== fingerprint) {
            this.renderers = null
            this.lastFingerprint = fingerprint
        }
    },

    /**
     * 
     * @param { number } delta 
     */
    scroll: function(delta) {
        if (delta === 0) return

        this.yOffset += delta
        this.renderers = null
    },

    getRenderers: function() {
        if (!this.renderers && this.frameAABB) {
            this.renderers = createChunkedPlatformRenderer(this.pos, this.frameAABB)
        }

        return this.renderers
    },

    destroy: function() {
        this.frameAABB = null
        this.renderers = null
    }
}

PlatformState.get = function(pos) {
    const key = pos.x + ":" + pos.y + ":" + pos.z

    if (!_activeStates[key]) _activeStates[key] = new PlatformState(pos)

    return _activeStates[key]
}

PlatformState.remove = function(pos) {
    const key = pos.x + ":" + pos.y + ":" + pos.z

    if (_activeStates[key]) {
        _activeStates[key].destroy()
        delete _activeStates[key]
    }
}

/** @type { Object.<string, PlatformState> } */
const _activeStates = {}