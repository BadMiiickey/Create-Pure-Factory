StartupEvents.modifyCreativeTab("kubejs:tab", event => {

    const displayComponent = Component.translatable('itemgroup.purefactory.creative_tab')

    event.setDisplayName(displayComponent)
    event.setIcon('purefactory:industrial_platform')
})