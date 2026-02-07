StartupEvents.registry('block', event => {
    event.create('purefactory:industrial_platform')
        .parentModel('purefactory:block/industrial_platform')
        .texture(['0', 'particle'], 'purefactory:block/industrial_platform')
        .stoneSoundType()
        .defaultCutout()
        .box(0, 0, 0, 16, 12, 16)
        .property(BlockProperties.HORIZONTAL_FACING)
        .blockEntity(/** @param { import("dev.latvian.mods.kubejs.block.entity.BlockEntityInfo").$BlockEntityInfo$$Type } info */ info => {
            info.enableSync()
            info.ticking()
        })
})