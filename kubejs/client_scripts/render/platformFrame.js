NativeEvents.onEvent($MouseScrollingEvent, /** @param { import("net.neoforged.neoforge.client.event.InputEvent$MouseScrollingEvent").$InputEvent$MouseScrollingEvent$$Type} event */ event => {
    
    const { scrollDeltaY } = event
    const { level, screen, hitResult, player } = Client
    const { mainHandItem } = player
    
    if (!level || screen !== null) return
    if (scrollDeltaY === 0) return
    if (!hitResult || hitResult.getType().name() !== 'BLOCK') return
    if (mainHandItem.id !== 'create:wrench') return
    
    const hitPos = hitResult.getLocation()
    let [x, y, z] = [Mth.floor(hitPos.x()), Mth.floor(hitPos.y()), Mth.floor(hitPos.z())]
    const hitBlock = getHitBlock('purefactory:industrial_platform', scrollDeltaY)

    if (!hitBlock || hitBlock.getId() !== 'purefactory:industrial_platform') return

    const dataTag = new $CompoundTag()
    const key = `${x},${y},${z}`
    const yOffset = scrollYOffsets[key] || 0

    dataTag.putString('key', key)
    dataTag.putInt('yOffset', yOffset)
    player.sendData('purefactory:platform_scroll', dataTag)

    event.setCanceled(true)
})

BlockEvents.blockEntityTick('purefactory:industrial_platform', event => {

    const { block, level } = event
    const { hitResult } = Client

    if (!level.isClientSide()) return
    if (!hitResult || hitResult.getType().name() !== 'BLOCK') return

    const hitBlock = getHitBlock('purefactory:industrial_platform')

    if (!hitBlock || hitBlock.getId() !== 'purefactory:industrial_platform') return

    /** @type { import("net.createmod.catnip.outliner.Outliner").$Outliner$$Type } */
    const outliner = $Outliner.getInstance()
    const entity = block.getEntity()
    const pos = block.getPos()
    const facing = entity.blockState.getValue(BlockProperties.HORIZONTAL_FACING)
    const [expandX, expandY, expandZ] = expandMap[facing.toString()]
    const key = `${pos.x},${pos.y},${pos.z}`
    const yOffset = scrollYOffsets[key] || 0

    const frameAABB = AABB.ofBlock(pos)
        .expandTowards(expandX, expandY, expandZ)
        .expandTowards(0, -4, 0)
        .move(0, yOffset, 0)

    outliner.showAABB(entity, frameAABB)
        .withFaceTextures($AllSpecialTextures.CHECKERED, $AllSpecialTextures.HIGHLIGHT_CHECKERED)
        .colored(0xEEEE00)
        .disableLineNormals()
        .lineWidth(0.0625)

    frameAABBs[key] = frameAABB
    scrollYOffsets[key] = scrollYOffsets[key] || 0
})

RenderJSEvents.onLevelRender(event => {

    const { poseStack, stage, camera } = event
    const { level, hitResult, player } = Client

    if (!level || !level.isClientSide()) return
    if (!hitResult || hitResult.getType().name() !== 'BLOCK') return
    if (stage !== RenderJSLevelRenderStage.AFTER_ENTITIES) return
    
    const hitBlock = getHitBlock('purefactory:industrial_platform')
    
    if (!hitBlock || hitBlock.getId() !== 'purefactory:industrial_platform') return
    
    const hitPos = hitBlock.getPos()
    const [x, y, z] = [hitPos.x, hitPos.y, hitPos.z]
    const key = `${x},${y},${z}`
    
    if (!frameAABBs[key]) return
    
    const yOffset = scrollYOffsets[key]
    /** @type { import("net.minecraft.world.phys.AABB").$AABB } */
    const frameAABB = frameAABBs[key]
    const renderer = schematicRenderers[key] || createPlatformRenderer(hitPos, frameAABB)
    const anchorX = frameAABB.minX
    const anchorY = frameAABB.minY
    const anchorZ = frameAABB.minZ
    const camX = camera.position.x()
    const camY = camera.position.y()
    const camZ = camera.position.z()
    const superBuffer = $DefaultSuperRenderTypeBuffer.getInstance()

    poseStack.pushPose()
    poseStack.translate(anchorX - camX, anchorY - camY, anchorZ - camZ)
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