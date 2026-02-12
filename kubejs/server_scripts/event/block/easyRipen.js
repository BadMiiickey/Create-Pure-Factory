BlockEvents.rightClicked(event => {

    const { block, item, player, hand, level } = event
    const state = block.getBlockState()
    const pos = block.getPos()

    if (hand.name() !== 'MAIN_HAND') return
    if (item.id !== 'minecraft:bone_meal') return
    if (!heightPlants.includes(block.getId())) return
    if (getHeight(block, pos, level) >= 3) return
    
    composterSpawn(level, pos)
    level.setBlockAndUpdate(getTopAir(block, pos, level), block.getBlock().defaultBlockState())
    player.swing()
})

BlockEvents.rightClicked(event => {

    const { block, item, player, hand, level } = event
    const pos = block.getPos()

    if (hand.name() !== 'MAIN_HAND') return
    if (item.id !== 'minecraft:bone_meal') return
    if (!smallPlants.includes(block.getId())) return

    composterSpawn(level, pos)
    block.popItem(block.getItem())
    player.swing()
})

BlockEvents.rightClicked('minecraft:sea_pickle', event => {

    const { block, item, player, hand, level } = event
    const pos = block.getPos()

    if (hand.name() !== 'MAIN_HAND') return
    if (item.id !== 'minecraft:bone_meal') return

    const pickles = block.getBlockState().getValue(BlockProperties.PICKLES)

    if (pickles >= 4) return

    const newState = block.getBlockState().setValue(BlockProperties.PICKLES, $Integer.valueOf(pickles + 1))

    composterSpawn(level, pos)
    level.setBlockAndUpdate(pos, newState)
    player.swing()
})
