PlayerEvents.loggedIn(event => {

    const { player } = event
    const { persistentData } = player

    if (!persistentData.contains('hasInit')) {
    }
    persistentData.putBoolean('hasInit', true)

    persistentData.putString('lastCounterPos', '')

    persistentData.putInt('smartBlockCounter', 0)
    persistentData.putString('smartBlockCounterFirstPos', '')
    persistentData.putString('smartBlockCounterSecondPos', '')
})