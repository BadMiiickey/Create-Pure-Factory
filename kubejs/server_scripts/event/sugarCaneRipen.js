BlockEvents.rightClicked('minecraft:sugar_cane', event => {

    const { block, item, player, hand, level } = event
    const state = block.getBlockState()
    const pos = block.getPos()

    if (hand.name() !== 'MAIN_HAND') return
    if (item.id !== 'minecraft:bone_meal') return
    
    composterSpawn(level, pos)
    block.popItem(Item.of('minecraft:sugar_cane', 2))
    player.swing()
})