EntityEvents.spawned(event => {

    const { entity } = event

    if (bannedEntities.includes(entity.type)) event.cancel()
})