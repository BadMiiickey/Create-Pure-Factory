ItemEvents.modification(event => {
    unbreakableItems.forEach(id => {
        event.modify(id, item => {
            item.setUnbreakableWithTooltip()
        })
    })

    event.modify('create:wrench', item => {
        item.setAttackDamage(12)
        item.setAttackSpeed(-2.4)
        item.setFireResistant()
    })
})