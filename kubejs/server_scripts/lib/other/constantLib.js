const neighbors = [[1,0], [-1,0], [0,1], [0,-1], [1,1], [-1,-1], [1,-1], [-1,1]]
const expandMap = {
    'north': [63, 7, -63],
    'south': [-63, 7, 63],
    'west': [63, 7, 63],
    'east': [-63, 7, -63]
}

const bannedEntities = [
    'minecraft:wandering_trader',
    'minecraft:phantom'
]

const blockStates = {
    stone: Blocks.STONE.defaultBlockState(),
    snowBlock: Blocks.SNOW_BLOCK.defaultBlockState(),
    lightGrayConcrete: Blocks.LIGHT_GRAY_CONCRETE.defaultBlockState(),
    yellowConcrete: Blocks.YELLOW_CONCRETE.defaultBlockState(),
    blackConcrete: Blocks.BLACK_CONCRETE.defaultBlockState()
}