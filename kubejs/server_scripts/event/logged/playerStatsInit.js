PlayerEvents.loggedIn(event => {

    const { player } = event
    const { persistentData } = player

    if (!persistentData.contains('hasInit')) {
        persistentData.putBoolean('hasInit', true)

        persistentData.putInt('blockStateModifyCount', 0)
    }
})