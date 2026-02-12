NetworkEvents.dataReceived('purefactory:easy_place_first_pos', event => {

    const { data, player } = event
    const { stringUuid } = player
    const firstPos = getPosFromKey(data.getString('pos'))

    placePoses[stringUuid] = {}
    placePoses[stringUuid].firstPos = firstPos
})

NetworkEvents.dataReceived('purefactory:easy_place_second_pos', event => {

    const { data, player } = event
    const { stringUuid } = player
    const secondPos = getPosFromKey(data.getString('pos'))

    placePoses[stringUuid].secondPos = secondPos
})

NetworkEvents.dataReceived('purefactory:easy_place_complete', event => {

    const { player, level } = event
    const { stringUuid, mainHandItem } = player
    
    const frameAABB = createAABBForBlocks(placePoses[stringUuid].firstPos, placePoses[stringUuid].secondPos)
    const warnMessage = Component.translate('message.purefactory.easy_place.warn').red()

    if (!mainHandItem || !mainHandItem.block) {
        player.tell(warnMessage)
        return
    }

    forEachPosInAABB(frameAABB, pos => {
        level.getBlock(pos).set(mainHandItem.id)
    })

    placePoses[stringUuid].firstPos = undefined
    placePoses[stringUuid].secondPos = undefined
})

