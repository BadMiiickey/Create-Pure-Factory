NativeEvents.onEvent($MouseScrollingEvent, /** @param { import("net.neoforged.neoforge.client.event.InputEvent$MouseScrollingEvent").$InputEvent$MouseScrollingEvent$$Type} event */ event => {
    
    const { scrollDeltaY } = event
    const { level, screen, player } = Client
    const { mainHandItem } = player
    
    if (!level || screen !== null) return
    if (scrollDeltaY === 0) return
    if (mainHandItem.id !== 'create:wrench') return
    
    const hitBlock = player.rayTrace().block

    if (!hitBlock || hitBlock.getId() !== 'purefactory:industrial_platform') return

    const key = createPosKey(hitBlock.getPos())

    if (scrollDeltaY !== 0) {
        if (scrollYOffsets[key] === undefined) scrollYOffsets[key] = 0

        scrollYOffsets[key] += scrollDeltaY
    }

    const dataTag = new $CompoundTag()
    const yOffset = scrollYOffsets[key] || 0

    dataTag.putString('key', key)
    dataTag.putInt('yOffset', yOffset)
    player.sendData('purefactory:platform_scroll', dataTag)

    event.setCanceled(true)
})

BlockEvents.blockEntityTick('purefactory:industrial_platform', event => {

    const { block, level } = event
    const { player } = Client

    if (!level.isClientSide()) return

    const hitBlock = player.rayTrace().block

    if (!hitBlock || hitBlock.getId() !== 'purefactory:industrial_platform') return

    const entity = block.getEntity()
    const pos = block.getPos()
    const facing = entity.blockState.getValue(BlockProperties.HORIZONTAL_FACING)
    const [expandX, expandY, expandZ] = expandMap[facing.toString()]
    const key = createPosKey(pos)
    const yOffset = scrollYOffsets[key] || 0

    const frameAABB = AABB.ofBlock(pos)
        .expandTowards(expandX, expandY, expandZ)
        .expandTowards(0, -4, 0)
        .move(0, yOffset, 0)

    showFrame(entity, frameAABB, 0xEEEE00)

    frameAABBs[key] = frameAABB
    scrollYOffsets[key] = scrollYOffsets[key] || 0
})

RenderJSEvents.onLevelRender(event => {

    const { poseStack, stage, camera } = event
    const { level, player } = Client

    if (!level || !level.isClientSide()) return
    if (stage !== RenderJSLevelRenderStage.AFTER_ENTITIES) return
    
    const hitBlock = player.rayTrace().block
    
    if (!hitBlock || hitBlock.getId() !== 'purefactory:industrial_platform') return
    
    const hitPos = hitBlock.getPos()
    const key = createPosKey(hitPos)
    
    if (!frameAABBs[key]) return
    
    const yOffset = scrollYOffsets[key]
    /** @type { import("net.minecraft.world.phys.AABB").$AABB } */
    const frameAABB = frameAABBs[key]
    const renderer = schematicRenderers[key] || createPlatformRenderer(hitPos, frameAABB)
    const [anchorX, anchorY, anchorZ] = [frameAABB.minX, frameAABB.minY, frameAABB.minZ]
    const [cameraX, cameraY, cameraZ] = [camera.position.x(), camera.position.y(), camera.position.z()]

    poseStack.pushPose()
    poseStack.translate(anchorX - cameraX, anchorY - cameraY, anchorZ - cameraZ)
    renderer.render(poseStack, superBuffer)
    poseStack.popPose()
    superBuffer.draw()
})

NetworkEvents.dataReceived('purefactory:platform_complete', event => {

    const { data } = event
    const key = data.getString('key')

    delete frameAABBs[key]
    delete scrollYOffsets[key]
})