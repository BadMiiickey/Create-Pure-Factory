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
    const { level } = Client
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

NativeEvents.onEvent($MouseScrollingEvent, /** @param { import("net.neoforged.neoforge.client.event.InputEvent$MouseScrollingEvent").$InputEvent$MouseScrollingEvent$$Type} event */ event => {

    const { scrollDeltaY } = event
    const { level, screen, player } = Client
    const { mainHandItem, stringUuid } = player

    if (!level || screen !== null) return
    if (scrollDeltaY === 0) return
    if (mainHandItem.id !== 'purefactory:smart_block_counter') return
    if (!counterPoses[stringUuid] || !counterPoses[stringUuid].everyBlock) return

    const newScroll = (counterPoses[stringUuid]?.scroll || 0) - scrollDeltaY

    counterPoses[stringUuid].scroll = Math.max(0, newScroll)
    event.setCanceled(true)
})

RenderJSEvents.onGuiPostRender(event => {
    
    const { player, level, screen, window } = Client
    const { stringUuid } = player
    const { guiScaledHeight } = window
    
    if (!level || screen !== null) return
    if (!counterPoses[stringUuid]) counterPoses[stringUuid] = {}
    if (!counterPoses[stringUuid].scroll) counterPoses[stringUuid].scroll = 0
    if (!counterPoses[stringUuid].everyBlock) return

    const firstPos = counterPoses[stringUuid].firstPos
    const secondPos = counterPoses[stringUuid].secondPos

    if (!firstPos || !secondPos) return
    if (!counterPoses[stringUuid].hasBuildFrame) {
        counterPoses[stringUuid].blocks = getBlocksInAABB(level, createAABBForBlocks(firstPos, secondPos))
        counterPoses[stringUuid].hasBuildFrame = true
    }
    
    const blocks = counterPoses[stringUuid].blocks || {}
    const allEntries = Object.entries(blocks)
    const length = allEntries.length
    const maxDisplay = Math.max(1, Math.floor((guiScaledHeight / 2 - 10) / 20))

    let currentScroll = counterPoses[stringUuid].scroll || 0
    const maxScroll = Math.max(0, length - maxDisplay)

    if (currentScroll > maxScroll) {
        currentScroll = maxScroll
        counterPoses[stringUuid].scroll = currentScroll
    }

    const visibleEntries = allEntries.slice(currentScroll, currentScroll + maxDisplay)

    visibleEntries.forEach(([id, count], index) => {
        let item = Item.of(id)
        let info = item.getDisplayName().append(Component.literal(` x ${count}`))

        event.renderGuiItem(item, 10, 10 + 20 * index)
        event.drawString(info, 36, 14 + 20 * index, 0xFFFFFF)
    })
})