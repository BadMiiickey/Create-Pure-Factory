StartupEvents.registry('block', event => {
    event.create('purefactory:industrial_platform')
        .property(BlockProperties.HORIZONTAL_FACING)
        .blockEntity(/** @param { import("dev.latvian.mods.kubejs.block.entity.BlockEntityInfo").$BlockEntityInfo$$Type } info */ info => {
            info.enableSync()
            info.ticking()
        })
})