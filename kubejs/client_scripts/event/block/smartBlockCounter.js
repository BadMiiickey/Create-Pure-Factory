NetworkEvents.dataReceived('purefactory:smart_block_counter_0', event => {

    const { data } = event
    const stringUuid = data.getString('stringUuid')
    const firstKey = data.getString('firstKey')

    if (!counterPoses[stringUuid]) counterPoses[stringUuid] = {}
    
    counterPoses[stringUuid].firstPos = getPosFromKey(firstKey)
})

NetworkEvents.dataReceived('purefactory:smart_block_counter_1', event => {

    const { data } = event
    const stringUuid = data.getString('stringUuid')
    const secondKey = data.getString('secondKey')

    counterPoses[stringUuid].secondPos = getPosFromKey(secondKey)
})

NetworkEvents.dataReceived('purefactory:smart_block_counter_reset', event => {

    const { data } = event
    const stringUuid = data.getString('stringUuid')

    counterPoses[stringUuid] = {}
})

NetworkEvents.dataReceived('purefactory:smart_block_counter_every_block', event => {

    const { data } = event
    const stringUuid = data.getString('stringUuid')

    counterPoses[stringUuid].everyBlock = true
})

RenderJSEvents.onLevelRender(event => {

    const { player, level } = Client
    const { stringUuid } = player
    const rayTraceBlock = player.rayTrace().block

    if (!counterPoses[stringUuid]) counterPoses[stringUuid] = {}

    const firstPos = counterPoses[stringUuid].firstPos
    const secondPos = counterPoses[stringUuid].secondPos || (rayTraceBlock ? rayTraceBlock.getPos() : undefined)
    
    if (!firstPos || !secondPos) return

    const frameAABB = createAABBForBlocks(firstPos, secondPos)
    const entity = level.getBlockEntity(firstPos)

    showFrame(entity, frameAABB, 0x00BFFF)
})

RenderJSEvents.onGuiPostRender(event => {
    
    const { player, level } = Client
    const { stringUuid } = player

    if (!counterPoses[stringUuid]) counterPoses[stringUuid] = {}
    if (!counterPoses[stringUuid].everyBlock) return

    const firstPos = counterPoses[stringUuid].firstPos
    const secondPos = counterPoses[stringUuid].secondPos

    if (!firstPos || !secondPos) return

    const frameAABB = createAABBForBlocks(firstPos, secondPos)
    const blocks = getBlocksInAABB(level, frameAABB)

    for (let [id, count] of Object.entries(blocks)) {
        let item = Item.of(id)
        let info = item.getDisplayName().append(Component.literal(` x ${count}`))
        let index = Object.keys(blocks).indexOf(id)

        event.renderGuiItem(item, 10, 10 + 20 * index)
        event.drawString(info, 36, 14 + 20 * index, 0xFFFFFF)
    }
})