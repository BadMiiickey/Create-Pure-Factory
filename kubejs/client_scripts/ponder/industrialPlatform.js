Ponder.registry(event => {
    
    const titleComponent = Component.translatable('ponder.purefactory.industrial_platform')

    event.create('purefactory:industrial_platform')
        .scene('purefactory:industrial_platform', titleComponent, (scene, util) => {
            const world = scene.world

            scene.showBasePlate()
            world.setBlock([2, 1, 2], 'purefactory:industrial_platform', false)
            
        })
})