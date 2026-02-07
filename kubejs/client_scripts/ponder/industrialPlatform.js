Ponder.registry(event => {
    event.create('purefactory:industrial_platform')
        .scene('industrial_platform', '工业平台的使用', (scene, util) => {
            const world = scene.world

            scene.showBasePlate()
            world.setBlock([2, 1, 2], 'purefactory:industrial_platform', false)
            
        })
})