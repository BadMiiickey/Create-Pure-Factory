PlayerEvents.loggedIn(event => {

    const { player } = event
    const { persistentData } = player

    if (!persistentData.contains('hasInit')) {
        persistentData.putBoolean('hasInit', true)
        
        persistentData.putInt('easyBreakCount', 0)
        persistentData.putString('easyBreakFirstPos', '')
        persistentData.putString('easyBreakSecondPos', '')
    }
})