NetworkEvents.dataReceived('purefactory:smart_block_counter_0', event => {

    const { data } = event
    const stringUuid = data.getString('stringUuid')
    const x = data.getInt('x')
    const y = data.getInt('y')
    const z = data.getInt('z')

    const pos = new BlockPos(x, y, z)
    const state = CounterState.get(stringUuid)

    state.setFirstPos(pos)
})

NetworkEvents.dataReceived('purefactory:smart_block_counter_1', event => {

    const { data } = event
    const stringUuid = data.getString('stringUuid')
    const x = data.getInt('x')
    const y = data.getInt('y')
    const z = data.getInt('z')

    const pos = new BlockPos(x, y, z)
    const state = CounterState.get(stringUuid)

    state.setSecondPos(pos)
})

NetworkEvents.dataReceived('purefactory:smart_block_counter_reset', event => {

    const { data } = event
    const stringUuid = data.getString('stringUuid')

    const state = CounterState.get(stringUuid)

    CounterState.reset(stringUuid)
})

NetworkEvents.dataReceived('purefactory:smart_block_counter_every_block', event => {

    const { data } = event
    const stringUuid = data.getString('stringUuid')

    const state = CounterState.get(stringUuid)

    state.setEveryBlock(true)
})

RenderJSEvents.onLevelRender(event => {

    const { player, level } = Client
    const { stringUuid } = player
    const state = CounterState.get(stringUuid)
    
    if (!state.firstPos) return
    
    const rayTraceBlock = player.rayTrace().block
    const currentRayTracePos = rayTraceBlock ? rayTraceBlock.getPos() : null
    const aabb = state.getAABB(currentRayTracePos)

    if (!aabb) return

    const entity = level.getBlockEntity(state.firstPos)
    
    showFrame(entity, aabb, 0x00BFFF)
})

NativeEvents.onEvent($MouseScrollingEvent, /** @param { import("net.neoforged.neoforge.client.event.InputEvent$MouseScrollingEvent").$InputEvent$MouseScrollingEvent$$Type} event */ event => {

    const { scrollDeltaY } = event
    const { level, screen, player } = Client
    const { mainHandItem, stringUuid } = player

    if (!level || screen !== null) return
    if (scrollDeltaY === 0) return
    if (mainHandItem.id !== 'purefactory:smart_block_counter') return

    const state = CounterState.get(stringUuid)

    if (!state.everyBlock || !state.firstPos) return

    state.doScroll(scrollDeltaY)
    event.setCanceled(true)
})

RenderJSEvents.onGuiPostRender(event => {
    
    const { player, level, screen, window } = Client
    const { stringUuid } = player
    const { guiScaledHeight } = window
    
    if (!level || screen !== null) return

    const state = CounterState.get(stringUuid)

    if (!state.everyBlock) return

    const blocks = state.getBlockCount(level)
    const allEntries = Object.entries(blocks)
    const length = allEntries.length
    const maxDisplay = Math.max(1, Math.floor((guiScaledHeight / 2 - 10) / 20))
    const maxScroll = Math.max(0, length - maxDisplay)

    state.scroll = Math.min(state.scroll, maxScroll)

    const visibleEntries = allEntries.slice(state.scroll, state.scroll + maxDisplay)

    visibleEntries.forEach(([id, count], index) => {
        let item = Item.of(id)
        let info = item.getDisplayName().append(Component.literal(` x ${count}`))

        event.renderGuiItem(item, 10, 10 + 20 * index)
        event.drawString(info, 36, 14 + 20 * index, 0xFFFFFF)
    })
})