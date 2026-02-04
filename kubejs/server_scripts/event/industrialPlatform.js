NetworkEvents.dataReceived('purefactory:platform_scroll', event => {

    const { data } = event
    const key = data.getString('key')
    const yOffset = data.getInt('yOffset')
    
    scrollYOffsets[key] = yOffset
})

BlockEvents.placed('purefactory:industrial_platform', event => {

    const { player } = event
    const warnMessage = Component.translatable('message.purefactory.platform_filling.warn').red()
    
    player.tell(warnMessage)
})

BlockEvents.rightClicked('purefactory:industrial_platform', event => {

    const { item, block, level, hand, server, player } = event

    if (hand.name() !== 'MAIN_HAND') return
    if (item.id === 'create:wrench') return

    const facing = block.getBlockState().getValue(BlockProperties.HORIZONTAL_FACING)
    const [expandX, expandY, expandZ] = expandMap[facing.toString()]
    const [x, y, z] = [block.getX(), block.getY(), block.getZ()]
    const key = `${x},${y},${z}`
    const yOffset = scrollYOffsets[key] || 0
    const blockPos = block.getPos()
    const frameAABB = AABB.ofBlock(blockPos)
        .expandTowards(expandX, expandY, expandZ)
        .expandTowards(0, -4, 0)
        .move(0, yOffset, 0)
    const stoneAABB = frameAABB.setMaxY(frameAABB.maxY - 8)
    const platformAABB = frameAABB.setMinY(frameAABB.minY + 4).setMaxY(frameAABB.maxY - 7)
    const innerAABB = platformAABB.deflate(2)
    
    platformFill(frameAABB, stoneAABB, platformAABB, innerAABB, level, blockPos, player)
    player.swing()
    delete scrollYOffsets[key]

    const dataTag = new $CompoundTag()

    dataTag.putString('key', key)
    server.sendData('purefactory:platform_complete', dataTag)
    event.cancel()
})