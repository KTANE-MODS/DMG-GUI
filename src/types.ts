export interface BombTime {
    days: Number,
    hours: Number,
    minutes: Number,
    seconds: Number
}

export interface Bomb {
    useDefaultTime: boolean;
    time?: BombTime;
    useDefaultStrikes: boolean;
    strikes?: Number;
    useDefaultFrontOnly: boolean;
    frontOnly: boolean;
    useDefaultNeedyActivationTime: boolean;
    needyActivationTime?: Number;
    useDefaultWidgets: boolean;
    widgets?: Number;
    pools: Pool[];
}

export interface DefaultBinding {
    // The checkbox that says to use the default data
    defaultCheckBox: HTMLInputElement,
    // the input(s) that needs to be disabled if the default checkbox is checked
    originalInputs: HTMLInputElement[]
}

export interface DefaultBomb {
    time: BombTime;
    strikes: Number;
    frontOnly: boolean;
    needyActivationTime: Number;
    widgets: Number;
}

export type FactoryMode = 'Static' | 'Infinite' | 'Finite'

export interface Mission {
    name: string;
    description: string;
    room?: string;
    noPacing: boolean;   
    factoryMode: FactoryMode;
    globalTime: boolean;
    globalStrikes: boolean;
    defaultBomb: DefaultBomb;
    bombs: Bomb[];
}

export interface ModuleEntry {
    weight: number; //Positive integer. 
    moduleName: string; //needs to be a valid module name.
}

export interface ModuleInfo {
    Name: string;
    ModuleID: string;
    Type: string;
}

export type PoolType = 'Preset' | 'Pool' | 'Module Name';

export type PresetType = 'All Solvable' | 'All Needy' | 'All Vanilla' | 'All Mods' | 'All Vanilla Needy' | 'All Mods Needy' | 'Profile' | 'Needy Profile'

export interface Pool {
    occurrence: Number; //positive integer
    poolType: PoolType;
    distinct: boolean;
    presetType?: PresetType;
    profileName?: string;
    entries?: ModuleEntry[];
    moduleName?: string;
}

export const modulesByName = new Map<string, ModuleInfo>();