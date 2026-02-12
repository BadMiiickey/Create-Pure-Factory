BlockEvents.rightClicked('purefactory:industrial_platform', event => {

    const { item, block, level, hand, server, player } = event

    if (hand.name() !== 'MAIN_HAND') return
    if (item.id !== 'create:wrench') return
    if (!Client.shiftDown) return

    const key = createPosKey(block.getPos())

    if (frameAABBs[key]) delete frameAABBs[key]
    if (scrollYOffsets[key] !== undefined) delete scrollYOffsets[key]
    if (schematicRenderers[key]) delete schematicRenderers[key]
})