/**
 * 
 * @param { import("net.minecraft.world.Container").$Container$$Type } container 
 * @param { import("net.minecraft.world.entity.player.Player").$Player$$Type } player 
 */
const sortContainer = (container, player) => {
    const rawItems = []
    const isPlayerInventory = container === player.inventory
    let start = 0
    let end = container.getContainerSize()

    if (isPlayerInventory) {
        start = 9
        end = 36
    }

    for (let i = start; i < end; i++) {
        let item = container.getItem(i)

        if (item.isEmpty()) continue

        container.setItem(i, Items.AIR)
        rawItems.push(item.copy())
    }

    const mergedItems = mergeItems(rawItems)

    mergedItems.sort((a, b) => {
        return a.id.compareTo(b.id) || b.count - a.count
    })

    for (let i = start; i < end; i++) {
        container.setItem(i, mergedItems[i - start] || Items.AIR)
    }

    container.setChanged()
}

/**
 * 
 * @param { import("net.minecraft.world.item.ItemStack").$ItemStack[] } rawItems 
 */
const mergeItems = (rawItems) => {
    /** @type { import("net.minecraft.world.item.ItemStack").$ItemStack[] } */
    const mergedItems = []

    rawItems.forEach(item => {
        while (!item.isEmpty()) {
            let existStack = mergedItems.find(i => 
                i.id === item.id
                && i.count < i.maxStackSize
                && i.areComponentsEqual(item)
            )

            if (existStack) {
                let space = existStack.maxStackSize - existStack.count
                let transferCount = Math.min(space, item.count)

                existStack.grow(transferCount)
                item.shrink(transferCount)
            } else {
                mergedItems.push(item.copy())
                item.setCount(0)
            }
        }
    })

    return mergedItems
}