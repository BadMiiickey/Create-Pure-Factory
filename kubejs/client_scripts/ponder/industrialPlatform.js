Ponder.registry(event => {
    event.create('purefactory:industrial_platform')
        .scene('purefactory:industrial_platform', '工业平台的使用', (scene, util) => {
            /** @type { import("net.createmod.ponder.api.scene.WorldInstructions").$WorldInstructions } */
            const world = scene.world
            /** @type { import("net.createmod.ponder.api.scene.OverlayInstructions").$OverlayInstructions } */
            const overlay = scene.overlay
            /** @type { import("net.createmod.ponder.api.scene.VectorUtil").$VectorUtil } */
            const vector = util.vector

            scene.showBasePlate()
            world.setBlock([2, 1, 2], Block.getBlock('purefactory:industrial_platform').defaultBlockState(), true)
            overlay.showText(60)
                .placeNearTarget()
                .pointAt(vector.of(2, 1, 2))
                .text("工业平台是一个多功能的方块，可以用来放置和展示物品。")
        })
})