ItemEvents.modification(event => {
    unbreakableItems.forEach(id => {
        event.modify(id, item => {
            item.setUnbreakableWithTooltip()
        })
    })
})