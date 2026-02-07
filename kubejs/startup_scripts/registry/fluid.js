StartupEvents.registry('fluid', event => {
    event.create('purefactory:underground_water')
        .flowingTexture('purefactory:block/flowing')
        .stillTexture('purefactory:block/still')
        .tint(0x4F94CD)
        .translucent()
})