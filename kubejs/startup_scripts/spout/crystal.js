CreateEvents.spoutHandler(event => {
    event.add('kubejs:amethyst', 'minecraft:budding_amethyst', (block, fluid, simulate) => {
        if (
            Object.keys(budMap).includes(block.getUp().getId())
            && block.getDown().getId() === 'create_connected:fan_smoking_catalyst'
            && fluid.id === 'kubejs:underground_water'
            && fluid.amount >= 50
            && checkHorizontalSpace(block)
        ) {
            if (!simulate) {
                block.getLevel().playLocalSound(block.getPos(), 'create:spout', 'blocks', 1.0, 1.0, true)
            }

            for (let direction of Object.keys(Direction.ALL)) {
                if (direction === Direction.UP || direction === Direction.DOWN) continue

                let spawnBlock = block.offset(direction)
                let id = spawnBlock.getId()

                if (!(id in budMap)) continue

                if (spawnBlock.getId() !== 'minecraft:amethyst_cluster') {
                    spawnBlock.set(budMap[id], { facing: direction })
                } else {
                    let container = spawnBlock.getDown()
                    
                    if (container.getId() === 'create:depot') {
                        /** @type { import("com.simibubi.create.content.logistics.depot.DepotBlockEntity").$DepotBlockEntity$$Type} */
                        let entity = container.getEntity()

                        if (!entity.getHeldItem().isEmpty()) continue 

                        entity.setHeldItem(Item.of('minecraft:amethyst_shard', 3))
                        entity.sendData()
                        spawnBlock.set('minecraft:air')
                    } else if ( container.getId() === 'create:belt') {
                        /** @type { import("com.simibubi.create.content.kinetics.belt.BeltBlockEntity").$BeltBlockEntity$$Type} */
                        let entity = container.getEntity()

                        if (!entity.inventory.getTransportedItems().isEmpty()) continue

                        entity.inventory.addItem(new $TransportedItemStack(Item.of('minecraft:amethyst_shard', 3)))
                        entity.sendData()
                        spawnBlock.set('minecraft:air')
                    }
                }
            }

            return 50
        }

        return 0
    })
})