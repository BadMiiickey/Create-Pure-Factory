NetworkEvents.dataReceived('purefactory:easy_break_0', event => {

    const { data } = event
    const firstKey = data.getString('firstKey')
    const outliner = $Outliner.getInstance()
    
    breakPoses[firstKey] = firstKey
})

NetworkEvents.dataReceived('purefactory:easy_break_1', event => {

    const { data } = event
    const firstKey = data.getString('firstKey')
    const secondKey = data.getString('secondKey')

    breakPoses[firstKey] = secondKey
})

NetworkEvents.dataReceived('purefactory:easy_break_reset', event => {

    const { data } = event
    const firstKey = data.getString('firstKey')

    delete breakPoses[firstKey]
})

RenderJSEvents.onLevelRender(event => {
    /** @type { import("net.createmod.catnip.outliner.Outliner").$Outliner$$Type } */
    const outliner = $Outliner.getInstance()

    for (let [firstKey, secondKey] of Object.entries(breakPoses)) {
        let firstPos = getPosFromKey(firstKey)
        let secondPos = secondKey === firstKey ? firstPos : getPosFromKey(secondKey)
        let frameAABB = createAABBForBlocks(firstPos, secondPos)
        let entity = Client.level.getBlockEntity(firstPos)

        outliner.showAABB(entity, frameAABB)
            .withFaceTextures($AllSpecialTextures.CHECKERED, $AllSpecialTextures.HIGHLIGHT_CHECKERED)
            .colored(0x00BFFF)
            .disableLineNormals()
            .lineWidth(0.0625)
    }
})