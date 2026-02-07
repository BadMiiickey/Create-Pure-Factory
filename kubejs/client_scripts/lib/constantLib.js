const expandMap = {
    'north': [63, 7, -63],
    'south': [-63, 7, 63],
    'west': [63, 7, 63],
    'east': [-63, 7, -63]
}

const blockStates = {
    stone: Blocks.STONE.defaultBlockState(),
    snowBlock: Blocks.SNOW_BLOCK.defaultBlockState(),
    lightGrayConcrete: Blocks.LIGHT_GRAY_CONCRETE.defaultBlockState(),
    yellowConcrete: Blocks.YELLOW_CONCRETE.defaultBlockState(),
    blackConcrete: Blocks.BLACK_CONCRETE.defaultBlockState()
}