/** @type {{ string: import("net.minecraft.world.phys.AABB").$AABB$$Type }} */
const frameAABBs = {}
/** @type {{ string: number }} */
const scrollYOffsets = {}

/**
 * 
 * @param { import("net.minecraft.resources.ResourceKey").$ResourceKey$$Type<import("net.minecraft.world.level.block.Block").$Block$$Type> } id 
 * @param { double= } scrollDeltaY 
 */
const getHitBlock = (id, scrollDeltaY) => {
    const { level, hitResult } = Client
    const hitPos = hitResult.getLocation()
    let [x, y, z] = [Mth.floor(hitPos.x()), Mth.floor(hitPos.y()), Mth.floor(hitPos.z())]

    for (let dy of [-1, 0, 1]) {
        for (let dx of [-1, 0, 1]) {
            for (let dz of [-1, 0, 1]) {
                let block = level.getBlock(x + dx, y + dy, z + dz)

                if (block.getId() !== id) continue
                if (typeof scrollDeltaY !== 'undefined' && scrollDeltaY !== 0) {
                    let key = `${x + dx},${y},${z + dz}`
                
                    if (!scrollYOffsets[key]) scrollYOffsets[key] = 0

                    scrollYOffsets[key] += scrollDeltaY
                }

                return block
            }
        }
    }
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 */
const getAirPos = (hitPos) => {
    const { level } = Client

    for (let dy of [-1, 0, 1]) {
        for (let dx of [-1, 0, 1]) {
            for (let dz of [-1, 0, 1]) {
                let pos = new BlockPos(hitPos.x + dx, hitPos.y + dy, hitPos.z + dz)
                let block = level.getBlock(pos)

                if (block.getId() !== 'minecraft:air') continue

                return pos
            }
        }
    }

    return hitPos
}

/**
 * 
 * @param { import("net.minecraft.resources.ResourceKey").$ResourceKey$$Type<import("net.minecraft.world.level.block.Block").$Block$$Type> } id 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } fakePos 
 * @param { import("com.chen1335.renderjs.client.events.renderEvent.RenderJSRenderLevelEvent").$RenderJSRenderLevelEvent$$Type } event 
 * @param { integer } lightColor 
 */
const renderFakeBlock = (id, fakePos, event, lightColor) => {
    const { poseStack, bufferSource, camera } = event
    const { level } = Client
    const fakeState = Block.getBlock(id).defaultBlockState()
    const cameraPos = camera.position

    if (level.getBlock(fakePos).getId() !== 'minecraft:air') return

    poseStack.pushPose()
    poseStack.translate(fakePos.x - cameraPos.x(), fakePos.y - cameraPos.y(), fakePos.z - cameraPos.z())
    event.renderSingleBlock(fakeState, poseStack, bufferSource, lightColor, $OverlayTexture.NO_OVERLAY)
    poseStack.popPose()
}

/**
 * 
 * @param { import("net.minecraft.resources.ResourceKey").$ResourceKey$$Type<import("net.minecraft.world.level.block.Block").$Block$$Type> } id 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } fakePos 
 * @param { import("com.chen1335.renderjs.client.events.renderEvent.RenderJSRenderLevelEvent").$RenderJSRenderLevelEvent$$Type } event 
 * @param { integer } lightColor 
 */
const renderSideBlock = (id, fakePos, event, lightColor) => {
    for (let dx of [-1, 0, 1]) {
        for (let dz of [-1, 0, 1]) {
            if (dx === 0 && dz === 0) continue
            
            renderFakeBlock(id, new BlockPos(fakePos.x + dx, fakePos.y, fakePos.z + dz), event, lightColor)
        }
    }
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { number } dx 
 * @param { number } dz 
 */
const isSnowCenter = (hitPos, dx, dz) => {
    let relativeX = dx - hitPos.x
    let relativeZ = dz - hitPos.z

    return ((relativeX + relativeZ) % 6 === 0) && (Math.abs(relativeX - relativeZ) % 6 === 0)
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { number } dx 
 * @param { number } dz 
 */
const isConcreteCenter = (hitPos, dx, dz) => {
    let relativeX = dx - hitPos.x
    let relativeZ = dz - hitPos.z

    return ((relativeX + relativeZ + 3) % 6 === 0) && (Math.abs(relativeX - relativeZ + 3) % 6 === 0)
}

/**
 * 
 * @param { import("net.minecraft.core.BlockPos").$BlockPos } hitPos 
 * @param { number } dx 
 * @param { number } dz 
 */
const isBlackFrame = (hitPos, dx, dz) => {
    let relativeX = dx - hitPos.x
    let relativeZ = dz - hitPos.z
    let blockX = (relativeX / 2) | 0
    let blockZ = (relativeZ / 2) | 0

    return (blockX + blockZ) % 2 === 0
}