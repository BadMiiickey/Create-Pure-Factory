BlockEvents.rightClicked('create:belt', event => {

    const { item, block, level, hand } = event
    /** @type { import("com.simibubi.create.content.kinetics.belt.BeltBlockEntity").$BeltBlockEntity$$Type } */
    const entity = block.getEntity()

    if (hand.name() !== 'MAIN_HAND') return
    if (item.id !== 'create:andesite_casing' && item.id !== 'create:brass_casing') return

    $BeltBlock.getBeltChain(level, entity.getController()).forEach(/** @param { import("net.minecraft.core.BlockPos").$BlockPos$$Type } beltPos */ beltPos => {
        /** @type { import("com.simibubi.create.content.kinetics.belt.BeltBlockEntity").$BeltBlockEntity$$Type } */
        let beltEntity = level.getBlockEntity(beltPos)

        beltEntity.setCasingType(item.id === 'create:andesite_casing' ? 'andesite' : 'brass')
    })
})