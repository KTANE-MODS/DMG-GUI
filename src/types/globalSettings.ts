export type FactoryMode = 'Static' | 'Infinite' | 'Sequence'


export interface Mission {
    missionName: string;
    missionDescription: string;
    room?: string;
    noPacing: boolean;   
    factoryMode: FactoryMode;
    globalTime: boolean;
    globalStrikes: boolean;
    bombs: Bomb[];
}

export interface Bomb {
    bombTime: Number; // in seconds
    strikes: Number; //positive integer
    frontOnly: boolean;
    widgets: Number; //unsigned int
    pools: Pool[];
}

export type PoolType = 'Preset' | 'Pool' | 'Module Name';
export type PresetType = 'All Solvable' | 'All Needy' | 'All Vanilla' | 'All Mods' | 'All Vanilla Needy' | 'All Mods Needy' | 'Profile' | 'Needy Profile'
export interface Pool {
    occurrence: Number; //positive integer
    poolType: PoolType;
    distinct: boolean;
    presetType?: PresetType;
    profileName?: string;
    percentages?: Number[]; //Positive integer. Must sum up to 100. Needs to have the same number as moduleNames
    moduleNames?: string[]; //needs to be a valid module name. Needs to have the same number as percentages
}

