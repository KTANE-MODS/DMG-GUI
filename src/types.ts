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

export interface ModuleEntry {
    percentage: number; //Positive integer. 
    moduleName: string; //needs to be a valid module name.
}

export type PoolType = 'Preset' | 'Pool' | 'Module Name';
export type PresetType = 'All Solvable' | 'All Needy' | 'All Vanilla' | 'All Mods' | 'All Vanilla Needy' | 'All Mods Needy' | 'Profile' | 'Needy Profile'
export interface Pool {
    occurrence: Number; //positive integer
    poolType: PoolType;
    distinct: boolean;
    presetType?: PresetType;
    profileName?: string;
    entries?: ModuleEntry[]; //Must sum up to 100.
}

export interface ModuleInfo {
    Name: string;
    ModuleID: string;
    Type: string;
}

export const modulesByName = new Map<string, ModuleInfo>();