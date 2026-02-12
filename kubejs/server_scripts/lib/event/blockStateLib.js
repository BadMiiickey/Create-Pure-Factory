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
 * @param { [] } type 
 * @param {*} currentValue 
 * @returns 
 */
const nextCount = (type, currentValue) => {
    const index = type.indexOf(currentValue)

    return index === -1 ? 0 : (index + 1) % type.length
}