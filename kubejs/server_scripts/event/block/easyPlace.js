NetworkEvents.dataReceived('purefactory:easy_place_first_pos', event => {

    const { data, player } = event
    const { stringUuid } = player

    const pos = getPosFromData(data)
    const state = PlaceServerState.get(stringUuid)

    state.firstPos = pos
})

NetworkEvents.dataReceived('purefactory:easy_place_second_pos', event => {

    const { data, player } = event
    const { stringUuid } = player

    const pos = getPosFromData(data)
    const state = PlaceServerState.get(stringUuid)
    state.secondPos = pos
})

NetworkEvents.dataReceived('purefactory:easy_place_complete', event => {

    const { player, level } = event
    const { stringUuid, mainHandItem } = player
    
    const state = PlaceServerState.get(stringUuid)
    const frameAABB = createAABBForBlocks(state.firstPos, state.secondPos)
    const warnMessage = Component.translate('message.purefactory.easy_place.warn').red()

    if (!mainHandItem || !mainHandItem.block) {
        player.tell(warnMessage)
        return
    }

    forEachPosInAABB(frameAABB, pos => {
        level.getBlock(pos).set(mainHandItem.id)
    })

    state.firstPos = undefined
    state.secondPos = undefined
})

NetworkEvents.dataReceived('purefactory:easy_place_reset', event => {

    const { player } = event
    const { stringUuid } = player
    const resetMessage = Component.translate('message.purefactory.easy_place.reset').green()

    PlaceServerState.reset(stringUuid)
    player.tell(resetMessage)
})