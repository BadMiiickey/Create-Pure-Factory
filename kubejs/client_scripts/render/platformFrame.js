NativeEvents.onEvent($MouseScrollingEvent, /** @param { import("net.neoforged.neoforge.client.event.InputEvent$MouseScrollingEvent").$InputEvent$MouseScrollingEvent$$Type} event */ event => {
    
    const { scrollDeltaY } = event
    const { level, screen, player } = Client
    const { mainHandItem } = player
    
    if (!level || screen !== null) return
    if (scrollDeltaY === 0) return
    if (mainHandItem.id !== 'create:wrench') return
    
    const hitBlock = player.rayTrace().block

    if (!hitBlock || hitBlock.getId() !== 'purefactory:industrial_platform') return

    const pos = hitBlock.getPos()
    const { x, y, z } = pos
    const state = PlatformState.get(pos)

    state.scroll(scrollDeltaY)
    player.sendData('purefactory:platform_scroll', {
        x: x,
        y: y,
        z: z,
        yOffset: state.yOffset
    })
    event.setCanceled(true)
})

BlockEvents.blockEntityTick('purefactory:industrial_platform', event => {

    const { block, level } = event
    const { player } = Client

    if (!level.isClientSide()) return

    const hitBlock = player.rayTrace().block
    const pos = block.getPos()

    if (!hitBlock || hitBlock.getId() !== 'purefactory:industrial_platform') return

    const entity = block.getEntity()
    const facing = entity.blockState.getValue(BlockProperties.HORIZONTAL_FACING)
    const state = PlatformState.get(pos)

    state.tick(facing)

    if (!state.frameAABB) return

    showFrame(entity, state.frameAABB, 0xEEEE00)
})

RenderJSEvents.onLevelRender(event => {

    const { poseStack, stage, camera, frustum } = event
    const { level, player } = Client

    if (!level || !level.isClientSide()) return
    if (stage !== RenderJSLevelRenderStage.AFTER_ENTITIES) return
    
    const hitBlock = player.rayTrace().block
    
    if (!hitBlock || hitBlock.getId() !== 'purefactory:industrial_platform') return
    
    const hitPos = hitBlock.getPos()
    const [cameraX, cameraY, cameraZ] = [camera.position.x(), camera.position.y(), camera.position.z()]
    const state = PlatformState.get(hitPos)
    const chunks = state.getRenderers()

    if (!chunks) return

    chunks.forEach(chunk => {
        if (!frustum.isVisible(chunk.aabb)) return

        let { renderer, anchor } = chunk

        poseStack.pushPose()
        poseStack.translate(anchor.x - cameraX, anchor.y - cameraY, anchor.z - cameraZ)
        renderer.render(poseStack, superBuffer)
        poseStack.popPose()
    })
    
    superBuffer.draw()
})

NetworkEvents.dataReceived('purefactory:platform_complete', event => {

    const { data } = event

    const pos = getPosFromData(data)

    PlatformState.remove(pos)
})