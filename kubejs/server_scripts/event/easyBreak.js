BlockEvents.rightClicked(event => {

    const { block, server, item, player, hand } = event
    const { persistentData, stringUuid } = player
    const pos = block.getPos()
    const key = `${pos.x},${pos.y},${pos.z}`
    const dataTag = new $CompoundTag()
    const warnMessage = Component.translate('message.purefactory.easy_break.warn').red()
    const canResetMessage = Component.translate('message.purefactory.easy_break.can_reset').yellow()
    
    if (hand.name() !== 'MAIN_HAND') return
    if (item.id !== 'create:wrench') return
    if (!Client.altDown) return
    if (!persistentData.contains('easyBreakCount')) return
    if (!persistentData.contains('easyBreakFirstPos')) return
    if (!persistentData.contains('easyBreakSecondPos')) return

    switch (persistentData.getInt('easyBreakCount')) {
        case 0:
            dataTag.putString('firstKey', key)
            server.sendData('purefactory:easy_break_0', dataTag)
            persistentData.putInt('easyBreakCount', 1)
            player.tell(canResetMessage)
            persistentData.putString('easyBreakFirstPos', key)
            break
        case 1:
            dataTag.putString('firstKey', persistentData.getString('easyBreakFirstPos'))
            dataTag.putString('secondKey', key)
            server.sendData('purefactory:easy_break_1', dataTag)
            persistentData.putInt('easyBreakCount', 2)
            persistentData.putString('easyBreakSecondPos', key)
            player.tell(warnMessage)
            break
    }

    player.swing()
    event.cancel()
})

ItemEvents.rightClicked('create:wrench', event => {
    
    const { player, item, hand, level, server } = event
    const { persistentData, stringUuid } = player
    
    if (hand.name() !== 'MAIN_HAND') return
    if (Client.altDown) return

    const firstPos = getPosFromKey(persistentData.getString('easyBreakFirstPos'))
    const secondPos = getPosFromKey(persistentData.getString('easyBreakSecondPos'))
    const frameAABB = createAABBForBlocks(firstPos, secondPos)
    const resetMessage = Component.translate('message.purefactory.easy_break.reset').green()
    const dataTag = new $CompoundTag()
    const hitBlock = getHitBlock('purefactory:industrial_platform')

    dataTag.putString('firstKey', persistentData.getString('easyBreakFirstPos'))

    if (Client.shiftDown && hitBlock === null) {
        persistentData.putInt('easyBreakCount', 0)
        player.swing()
        player.tell(resetMessage)
        server.sendData('purefactory:easy_break_reset', dataTag)
        return
    }

    if (persistentData.getInt('easyBreakCount') !== 2) return
    
    const [maxMiningLevelItem, shovelItem, axeItem] = getMaxMiningItems(player)

    player.swing()
    breakBlocks(level, server, player, frameAABB, maxMiningLevelItem, shovelItem, axeItem)
    persistentData.putInt('easyBreakCount', 0)
    server.sendData('purefactory:easy_break_reset', dataTag)
})