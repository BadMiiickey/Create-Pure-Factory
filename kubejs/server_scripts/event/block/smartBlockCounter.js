BlockEvents.rightClicked(event => {

    const { block, server, item, player, hand } = event
    const { persistentData, stringUuid } = player
    const key = createPosKey(block.getPos())
    const dataTag = new $CompoundTag()
    const canResetMessage = Component.translate('message.purefactory.smart_block_counter.can_reset').yellow()
    
    if (hand.name() !== 'MAIN_HAND') return
    if (item.id !== 'purefactory:smart_block_counter') return
    if (!persistentData.contains('smartBlockCounter')) return
    if (!persistentData.contains('smartBlockCounterFirstPos')) return
    if (!persistentData.contains('smartBlockCounterSecondPos')) return

    dataTag.putString('stringUuid', stringUuid)

    switch (persistentData.getInt('smartBlockCounter')) {
        case 0:
            dataTag.putString('firstKey', key)
            server.sendData('purefactory:smart_block_counter_0', dataTag)
            persistentData.putInt('smartBlockCounter', 1)
            player.tell(canResetMessage)
            persistentData.putString('smartBlockCounterFirstPos', key)
            break
        case 1:
            dataTag.putString('secondKey', key)
            server.sendData('purefactory:smart_block_counter_1', dataTag)
            persistentData.putInt('smartBlockCounter', 2)
            persistentData.putString('smartBlockCounterSecondPos', key)
            break
    }

    player.swing()
    event.cancel()
})

ItemEvents.rightClicked('purefactory:smart_block_counter', event => {
    
    const { player, item, hand, level, server } = event
    const { persistentData, stringUuid } = player
    
    if (hand.name() !== 'MAIN_HAND') return
    if (persistentData.getInt('smartBlockCounter') !== 2) return

    const firstPos = getPosFromKey(persistentData.getString('smartBlockCounterFirstPos'))
    const secondPos = getPosFromKey(persistentData.getString('smartBlockCounterSecondPos'))
    const frameAABB = createAABBForBlocks(firstPos, secondPos)
    const resetMessage = Component.translate('message.purefactory.smart_block_counter.reset').green()
    const countMessage = Component.translatable('message.purefactory.smart_block_counter.count', counterAABB(frameAABB))
    const dataTag = new $CompoundTag()

    dataTag.putString('stringUuid', stringUuid)

    if (Client.shiftDown) {
        persistentData.putInt('smartBlockCounter', 0)
        player.swing()
        player.tell(resetMessage)
        server.sendData('purefactory:smart_block_counter_reset', dataTag)
        return
    } 

    player.swing()
    player.tell(countMessage)
    server.sendData('purefactory:smart_block_counter_every_block', dataTag)
})