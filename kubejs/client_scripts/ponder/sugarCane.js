// Ponder.registry(event => {
//     event.create('minecraft:sugar_cane')
//         .scene('minecraft:sugar_cane', '甘蔗催熟', (scene, util) => {
//             const world = scene.world

//             scene.showBasePlate()
//             world.setBlock([2, 1, 2], 'minecraft:sugar_cane', false)
//             scene.idle(10)
//             scene.overlay().showText(20).text()
//         })
// })