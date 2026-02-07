ServerEvents.recipes(event => {

    const { create } = event.recipes

    create.filling(
        Item.of('minecraft:budding_amethyst'),
        [
            Fluid.of('purefactory:underground_water', 250),
            Item.of('minecraft:amethyst_block')
        ]
    ).id('purefactory:filling/amethyst_budding_with_underground_water')
})