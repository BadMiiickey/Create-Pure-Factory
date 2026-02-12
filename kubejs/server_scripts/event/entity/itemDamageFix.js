EntityEvents.spawned(event => {

    const { entity } = event

    if (!entity.isLiving()) return
    
    /** @type { import("net.minecraft.world.entity.LivingEntity").$LivingEntity$$Type } */
    const livingEntity = entity
    const iter = livingEntity.allSlots.iterator()

    while (iter.hasNext()) {
        let item = iter.next()

        if (!item.isDamaged()) continue

        item.setDamage(0)
    }
})