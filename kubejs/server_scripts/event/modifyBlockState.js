BlockEvents.rightClicked(event => {

    const { player, item, block, level, hand } = event

    if (hand.name() !== 'MAIN_HAND') return
    if (item.id !== 'create:wrench') return
    if (block.getMod() === 'create') return

    const state = block.getBlockState()
    const pos = block.getPos()
    const values = state.getValues()

    if (values.containsKey(BlockProperties.HORIZONTAL_FACING)) {
        let modifyCount = nextCount(horizontalFacing, state.getValue(BlockProperties.HORIZONTAL_FACING))
        let newState = state.setValue(BlockProperties.HORIZONTAL_FACING, horizontalFacing[modifyCount])

        player.swing()
        level.setBlockAndUpdate(pos, newState)
    }

    if (values.containsKey(BlockProperties.SLAB_TYPE)) {
        if (state.getValue(BlockProperties.SLAB_TYPE) === $SlabType.DOUBLE) return

        let modifyCount = nextCount(slabType, state.getValue(BlockProperties.SLAB_TYPE))
        let newState = state.setValue(BlockProperties.SLAB_TYPE, slabType[modifyCount])

        player.swing()
        level.setBlockAndUpdate(pos, newState)
    }

    if (values.containsKey(BlockProperties.AXIS)) {
        let modifyCount = nextCount(axis, state.getValue(BlockProperties.AXIS))
        let newState = state.setValue(BlockProperties.AXIS, axis[modifyCount])

        player.swing()
        level.setBlockAndUpdate(pos, newState)
    }

    if (!Client.altDown && !Client.shiftDown) return
    
    if (values.containsKey(BlockProperties.HALF)) {
        let modifyCount = nextCount(half, state.getValue(BlockProperties.HALF))
        let newState = state.setValue(BlockProperties.HALF, half[modifyCount])

        player.swing()
        level.setBlockAndUpdate(pos, newState)
    }
})

BlockEvents.rightClicked('create:encased_fluid_pipe', event => {

    const { player, item, block, level, hand, facing } = event

    if (hand.name() !== 'MAIN_HAND') return
    if (!item.empty) return

    const $Boolean = Java.loadClass('java.lang.Boolean')
    const state = block.getBlockState()
    const pos = block.getPos()
    const direction = facing.toString().toUpperCase()
    const currentState = state.getValue(BlockProperties[direction])
    let newState = state.setValue(BlockProperties[direction], currentState ? $Boolean.FALSE : $Boolean.TRUE)

    player.swing()
    level.setBlockAndUpdate(pos, newState)
})
