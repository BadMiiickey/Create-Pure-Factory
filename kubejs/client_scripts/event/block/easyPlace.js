RenderJSEvents.onLevelRender(event => {

    const { player, level } = Client
    const { offHandItem, stringUuid } = player

    if (Client.shiftDown) return
    if (offHandItem.id !== 'purefactory:smart_block_counter') return

    const rayTrace = player.rayTrace()
    const { block, facing, distance } = rayTrace

    if (!block || distance > 5) return

    const canBePlacedPos = block.offset(facing).getPos()
    const entity = level.getBlockEntity(canBePlacedPos)

    if (placePoses[stringUuid] === undefined) placePoses[stringUuid] = { count: 0 }

    switch (placePoses[stringUuid].count) {
        case 0:
            showFrame(entity, createAABBForBlocks(canBePlacedPos, canBePlacedPos), 0x708090)
            break
        case 1: {
            const firstPos = placePoses[stringUuid].firstPos
            const frameAABB = createAABBForBlocks(firstPos, canBePlacedPos)
            
            showFrame(entity, frameAABB, 0x708090)
            break
        }
        case 2: {
            const firstPos = placePoses[stringUuid].firstPos
            const secondPos = placePoses[stringUuid].secondPos
            const frameAABB = createAABBForBlocks(firstPos, secondPos)

            showFrame(entity, frameAABB, 0x708090)
            break
        }
    }
})

NativeEvents.onEvent($MouseButton$Pre,  event => {

    const { button, action } = event
    const { level, player, screen} = Client

    if (button !== $GLFW.GLFW_MOUSE_BUTTON_LEFT) return
    if (action !== $GLFW.GLFW_PRESS) return
    if (screen !== null) return
    if (!level || !player) return

    const { offHandItem, stringUuid, mainHandItem } = player

    if (offHandItem.id !== 'purefactory:smart_block_counter') return
    
    const rayTrace = player.rayTrace()
    const { block, facing, distance } = rayTrace
    
    if (Client.shiftDown) {
        placePoses[stringUuid] = { count: 0 }
        player.sendData('purefactory:easy_place_reset')
        return
    }
    if (!block || distance > 5) return

    const canBePlacedPos = block.offset(facing).getPos()
    const key = createPosKey(canBePlacedPos)
    const canResetMessage = Component.translate('message.purefactory.easy_place.can_reset').yellow()
    const data = new $CompoundTag()

    data.putString('pos', key)

    if (placePoses[stringUuid] === undefined) placePoses[stringUuid] = { count: 0 }

    switch (placePoses[stringUuid].count) {
        case 0:
            placePoses[stringUuid].firstPos = canBePlacedPos
            placePoses[stringUuid].count = 1
            Client.tell(canResetMessage)
            player.sendData('purefactory:easy_place_first_pos', data)
            break
        case 1:
            placePoses[stringUuid].secondPos = canBePlacedPos
            placePoses[stringUuid].count = 2
            player.sendData('purefactory:easy_place_second_pos', data)
            break
        case 2:
            player.sendData('purefactory:easy_place_complete', data)

            if (!mainHandItem || !mainHandItem.block) {
                event.setCanceled(true)
                return
            }

            placePoses[stringUuid].count = 0
            placePoses[stringUuid].firstPos = undefined
            placePoses[stringUuid].secondPos = undefined
            break
    }

    event.setCanceled(true)
})