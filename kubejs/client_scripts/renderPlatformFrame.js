NativeEvents.onEvent($MouseScrollingEvent, /** @param { import("net.neoforged.neoforge.client.event.InputEvent$MouseScrollingEvent").$InputEvent$MouseScrollingEvent$$Type} event */ event => {
    
    const { scrollDeltaY } = event
    const { level, screen, hitResult } = Client
    
    if (!level || screen !== null) return
    if (scrollDeltaY === 0) return
    if (!hitResult || hitResult.getType().name() !== 'BLOCK') return
    
    const hitPos = hitResult.getLocation()
    let [x, y, z] = [Mth.floor(hitPos.x()), Mth.floor(hitPos.y()), Mth.floor(hitPos.z())]
    const hitBlock = getHitBlock('purefactory:industrial_platform', scrollDeltaY)

    if (!hitBlock || hitBlock.getId() !== 'purefactory:industrial_platform') return

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
        .colored(0x00CD00)
        .disableLineNormals()
        .lineWidth(0.0625)

    frameAABBs[key] = frameAABB
    scrollYOffsets[key] = scrollYOffsets[key] || 0
})

RenderJSEvents.onLevelRender(event => {

    const { poseStack, bufferSource, stage, camera } = event
    const { level, levelRenderer, blockRenderer, hitResult, player } = Client

    if (!level || !level.isClientSide()) return
    if (!hitResult || hitResult.getType().name() !== 'BLOCK') return
    if (stage !== RenderJSLevelRenderStage.AFTER_ENTITIES) return

    const hitBlock = getHitBlock('purefactory:industrial_platform')
    
    if (!hitBlock || hitBlock.getId() !== 'purefactory:industrial_platform') return
    
    const hitPos = hitBlock.getPos()
    const [x, y, z] = [hitPos.x, hitPos.y, hitPos.z]
    const key = `${x},${y},${z}`
    
    if (scrollYOffsets[key] === undefined || !frameAABBs[key]) return
    
    const yOffset = scrollYOffsets[key]
    /** @type { import("net.minecraft.world.phys.AABB").$AABB } */
    const frameAABB = frameAABBs[key]
    const stoneAABB = frameAABB.setMaxY(frameAABB.maxY - 9)
    const stoneInnerAABB = stoneAABB.deflate(1).setMaxY(frameAABB.maxY - 9)
    const platformAABB = frameAABB.setMinY(frameAABB.minY + 4).setMaxY(frameAABB.maxY - 8)
    const innerAABB = platformAABB.deflate(2)
    const lightColor = levelRenderer.getLightColor(level, getAirPos(hitPos))
    const cameraPos = camera.position
    
    for (let dy = stoneAABB.minY; dy <= stoneAABB.maxY; dy++) {
        for (let dx = stoneAABB.minX; dx <= stoneAABB.maxX - 1; dx++) {
            for (let dz = stoneAABB.minZ; dz <= stoneAABB.maxZ - 1; dz++) {
                let fakePos = new BlockPos(dx, dy, dz)

                if (stoneInnerAABB.contains(fakePos.center)) continue
                
                renderFakeBlock('minecraft:stone', fakePos, event, lightColor)
            }
        }
    }

    for (let dx = platformAABB.minX; dx <= platformAABB.maxX - 1; dx++) {
        for (let dz = platformAABB.minZ; dz <= platformAABB.maxZ - 1; dz++) {
            let fakePos = new BlockPos(dx, platformAABB.minY, dz)

            if (innerAABB.contains(fakePos.center)) {
                if (isSnowCenter(hitPos, dx, dz)) {
                    renderFakeBlock('minecraft:snow_block', fakePos, event, lightColor)
                    renderSideBlock('minecraft:light_gray_concrete', fakePos, event, lightColor, hitPos)
                } else if (isConcreteCenter(hitPos, dx, dz)) {
                    renderFakeBlock('minecraft:light_gray_concrete', fakePos, event, lightColor)
                    renderSideBlock('minecraft:snow_block', fakePos, event, lightColor, hitPos)
                }
                
            } else {
                if (isBlackFrame(hitPos, dx, dz)) {
                    renderFakeBlock('minecraft:black_concrete', fakePos, event, lightColor)
                } else {
                    renderFakeBlock('minecraft:yellow_concrete', fakePos, event, lightColor)
                }
            }
        }
    }

    const dataTag = new $CompoundTag()

    dataTag.putString('key', key)
    dataTag.putInt('yOffset', yOffset)
    player.sendData('purefactory:platform_scroll', dataTag)
})

NetworkEvents.dataReceived('purefactory:platform_complete', event => {

    const { data } = event
    const key = data.getString('key')

    delete frameAABBs[key]
    delete scrollYOffsets[key]
})