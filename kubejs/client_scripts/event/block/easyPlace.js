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
    const state = PlaceState.get(stringUuid)

    switch (state.step) {
        case 0:
            showFrame(entity, createAABBForBlocks(canBePlacedPos, canBePlacedPos), 0x708090)
            break
        case 1: {
            const firstPos = state.firstPos
            const frameAABB = createAABBForBlocks(firstPos, canBePlacedPos)
            
            showFrame(entity, frameAABB, 0x708090)
            break
        }
        case 2: {
            const firstPos = state.firstPos
            const secondPos = state.secondPos
            const frameAABB = createAABBForBlocks(firstPos, secondPos)

            showFrame(entity, frameAABB, 0x708090)
            break
        }
    }
})

NativeEvents.onEvent($MouseButton$Pre,  event => {

    const { button, action } = event
    const { level, player, screen } = Client

    if (button !== $GLFW.GLFW_MOUSE_BUTTON_LEFT) return
    if (action !== $GLFW.GLFW_PRESS) return
    if (screen !== null) return
    if (!level || !player) return

    const { offHandItem, stringUuid, mainHandItem } = player

    if (offHandItem.id !== 'purefactory:smart_block_counter') return
    
    const rayTrace = player.rayTrace()
    const { block, facing, distance } = rayTrace
    
    if (Client.shiftDown) {
        PlaceState.reset(stringUuid)
        player.sendData('purefactory:easy_place_reset')
        return
    }
    if (!block || distance > 5) return

    const canBePlacedPos = block.offset(facing).getPos()
    const { x, y, z } = canBePlacedPos
    const canResetMessage = Component.translate('message.purefactory.easy_place.can_reset').yellow()
    const state = PlaceState.get(stringUuid)

    switch (state.step) {
        case 0:
            state.firstPos = canBePlacedPos
            state.step = 1
            Client.tell(canResetMessage)
            player.sendData('purefactory:easy_place_first_pos', {
                x: x,
                y: y,
                z: z,
            })
            break
        case 1:
            state.secondPos = canBePlacedPos
            state.step = 2
            player.sendData('purefactory:easy_place_second_pos', {
                x: x,
                y: y,
                z: z,
            })
            break
        case 2:
            player.sendData('purefactory:easy_place_complete')
            
            if (!mainHandItem || !mainHandItem.block) {
                event.setCanceled(true)
                return
            }

            state.step = 0
            state.firstPos = null
            state.secondPos = null
            break
    }

    event.setCanceled(true)
})