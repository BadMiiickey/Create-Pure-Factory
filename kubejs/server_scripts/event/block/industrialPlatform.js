NetworkEvents.dataReceived('purefactory:platform_scroll', event => {

    const { data } = event
    const x = data.getInt('x')
    const y = data.getInt('y')
    const z = data.getInt('z')
    const yOffset = data.getInt('yOffset')
    
    const pos = new BlockPos(x, y, z)
    const state = PlatformServerState.get(pos)

    state.yOffset = yOffset
})

BlockEvents.placed('purefactory:industrial_platform', event => {

    const { player } = event
    const warnMessage = Component.translatable('message.purefactory.platform_filling.warn').red()
    
    player.tell(warnMessage)
})

BlockEvents.rightClicked('purefactory:industrial_platform', event => {

    const { item, block, level, hand, server, player } = event

    if (hand.name() !== 'MAIN_HAND') return
    if (item.id !== 'create:wrench') return
    if (!player.isShiftKeyDown()) return

    const facing = block.getBlockState().getValue(BlockProperties.HORIZONTAL_FACING)
    const [expandX, expandY, expandZ] = expandMap[facing.toString()]
    const blockPos = block.getPos()

    const state = PlatformServerState.get(blockPos)
    const yOffset = state.yOffset
    const frameAABB = AABB.ofBlock(blockPos)
        .expandTowards(expandX, expandY, expandZ)
        .expandTowards(0, -4, 0)
        .move(0, yOffset, 0)

    const stoneAABB = frameAABB.setMaxY(frameAABB.maxY - 8)
    const platformAABB = frameAABB.setMinY(frameAABB.minY + 4).setMaxY(frameAABB.maxY - 7)
    const innerAABB = platformAABB.deflate(2)
    
    platformFill(frameAABB, stoneAABB, platformAABB, innerAABB, level, blockPos, player)
    player.swing()
    level.destroyBlock(blockPos, false)
    PlatformServerState.remove(blockPos)
    server.sendData('purefactory:platform_complete', {
        x: blockPos.x,
        y: blockPos.y,
        z: blockPos.z
    })
    event.cancel()
})

BlockEvents.broken('purefactory:industrial_platform', event => {

    const { block, server } = event
    const pos = block.getPos()

    PlatformServerState.remove(pos)
    server.sendData('purefactory:platform_complete', {
        x: pos.x,
        y: pos.y,
        z: pos.z
    })
})