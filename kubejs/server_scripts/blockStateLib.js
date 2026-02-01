const horizontalFacing = [
    Direction.EAST,
    Direction.SOUTH,
    Direction.WEST,
    Direction.NORTH
]

const slabType = [
    $SlabType.BOTTOM,
    $SlabType.TOP
]

const axis = [
    $Axis.X,
    $Axis.Y,
    $Axis.Z
]

const half = [
    $Half.TOP,
    $Half.BOTTOM
]

/**
 * 
 * @param { import("net.minecraft.world.entity.player.Player").$Player$$Type } player 
 * @param { [] } type 
 * @param {*} currentValue 
 */
const equalIndex = (player, type, currentValue) => {
    const index = type.indexOf(currentValue)
    const modifyCount = player.persistentData.getInt('blockStateModifyCount')
    
    return index === -1 ? false : index === modifyCount
}

/**
 * 
 * @param { [] } type 
 * @param {*} currentValue 
 * @returns 
 */
const nextIndex = (type, currentValue) => {
    const index = type.indexOf(currentValue)

    return index === -1 ? 0 : (index + 1) % type.length
}

/**
 * 
 * @param { import("net.minecraft.world.entity.player.Player").$Player$$Type } player 
 * @param { [] } type 
 * @param {*} currentValue 
 */
const nextCount = (player, type, currentValue) => {
    if (!equalIndex(player, type, currentValue)) {
        return nextIndex(type, currentValue)
    } else {
        return (player.persistentData.getInt('blockStateModifyCount') + 1) % type.length
    }
}

/**
 * 
 * @param { import("net.minecraft.world.entity.player.Player").$Player$$Type } player 
 * @param { number } modifyCount 
 * @param { [] } type
 */
const updateCounter = (player, modifyCount, type) => {
    player.persistentData.putInt('blockStateModifyCount', modifyCount % type.length)
}