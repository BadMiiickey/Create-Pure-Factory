NativeEvents.onEvent($MouseButton$Pre, event => {
    
    const { button, action } = event
    const { level, player, screen } = Client

    if (button !== $GLFW.GLFW_MOUSE_BUTTON_MIDDLE) return
    if (action !== $GLFW.GLFW_PRESS) return
    if (screen === null) return
    if (!level || !player) return
    if (!(screen instanceof $AbstractContainerScreen)) return
    
    /** @type { import("net.minecraft.client.gui.screens.inventory.AbstractContainerScreen").$AbstractContainerScreen } */
    const containerScreen = screen
    const { slotUnderMouse } = containerScreen

    if (!slotUnderMouse) return
    
    const dataTag = new $CompoundTag()

    dataTag.putInt('slotIndex', slotUnderMouse.index)
    player.sendData('purefactory:easy_sort', dataTag)
    event.setCanceled(true)
})