BlockEvents.rightClicked(event => {

    const { block, item, player, hand } = event
    const canResetMessage = Component.translate('message.purefactory.smart_block_counter.can_reset').yellow()
    
    if (hand.name() !== 'MAIN_HAND') return
    if (item.id !== 'purefactory:smart_block_counter') return
    
    const { stringUuid } = player
    const pos = block.getPos()
    const { x, y, z } = pos
    const state = CounterServerState.get(stringUuid)
    
    switch (state.step) {
        case 0:
            state.firstPos = pos
            state.step = 1
            player.tell(canResetMessage)
            player.sendData('purefactory:smart_block_counter_0', {
                stringUuid: stringUuid,
                x: x,
                y: y,
                z: z
            })
            break
        case 1:
            state.secondPos = pos
            state.step = 2
            player.sendData('purefactory:smart_block_counter_1', {
                stringUuid: stringUuid,
                x: x,
                y: y,
                z: z
            })
            break
    }

    player.swing()
    event.cancel()
})

ItemEvents.rightClicked('purefactory:smart_block_counter', event => {
    
    const { player, hand } = event
    
    if (hand.name() !== 'MAIN_HAND') return
    
    const { stringUuid } = player
    const state = CounterServerState.get(stringUuid)

    if (state.step !== 2) return

    const resetMessage = Component.translate('message.purefactory.smart_block_counter.reset').green()
    

    if (player.isShiftKeyDown()) {
        CounterServerState.reset(stringUuid)
        player.swing()
        player.tell(resetMessage)
        player.sendData('purefactory:smart_block_counter_reset', {
            stringUuid: stringUuid
        })
        return
    } 

    const frameAABB = createAABBForBlocks(state.firstPos, state.secondPos)
    const countMessage = Component.translatable('message.purefactory.smart_block_counter.count', counterAABB(frameAABB))

    player.swing()
    player.tell(countMessage)
    player.sendData('purefactory:smart_block_counter_every_block', {
        stringUuid: stringUuid
    })
})