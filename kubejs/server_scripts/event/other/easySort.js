NetworkEvents.dataReceived('purefactory:easy_sort', event => {

    const { player, data } = event
    const { containerMenu } = player
    const slotIndex = data.getInt('slotIndex')
    const slot = containerMenu.getSlot(slotIndex)
    
    if (!slot) return

    const container = slot.container

    sortContainer(container, player)
})