ServerEvents.recipes(event => {

    const { create } = event.recipes

    create.haunting(
        [
            CreateItem.of('create:asurine', 0.5),
            CreateItem.of('create:crimsite', 0.5),
            CreateItem.of('create:ochrum', 0.5),
            CreateItem.of('create:veridium', 0.5)
        ],
        Item.of('minecraft:andesite')
    ).id('purefactory:haunting/andesite_to_asurine_crimsite_ochrum_veridium')

    create.haunting(
        CreateItem.of('minecraft:netherrack', 0.75),
        Item.of('minecraft:cobblestone')
    ).id('purefactory:haunting/cobblestone_to_netherrack')

    create.haunting(
        [
            CreateItem.of('minecraft:crimson_stem', 0.5),
            CreateItem.of('minecraft:warped_stem', 0.5)
        ],
        Ingredient.of('#minecraft:logs_that_burn')
    ).id('purefactory:haunting/logs_that_burn_to_crimson_warped_stems')

    create.haunting(
        [
            CreateItem.of('minecraft:crimson_nylium', 0.5),
            CreateItem.of('minecraft:warped_nylium', 0.5)
        ],
        Ingredient.of('#c:stones')
    ).id('purefactory:haunting/stones_to_crimson_warped_nylium')
})