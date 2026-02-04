BlockEvents.rightClicked(event => {
    
    const { player, item, block, hand } = event

    if (hand.name() !== 'MAIN_HAND') return
    if (item.empty) {
        player.tell('block: ' + block.getId())
        player.tell('block state: ' + block.getBlockState())
        player.tell('entity data: ' + block.getEntityData())
    }
})