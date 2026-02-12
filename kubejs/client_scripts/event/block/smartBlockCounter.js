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