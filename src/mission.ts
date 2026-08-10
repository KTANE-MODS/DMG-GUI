import { Mission, PresetType } from "./types";
import { getModulesByName } from "./modules";

export function generateDMGText(mission: Mission) {
    let modulesByName = getModulesByName();
    let missionStr = ""

    // todo mission name
    missionStr += `//${mission.name}\n`

    // todo mission description
    missionStr += `//${mission.description}\n`

    // todo room
    if(mission.room != undefined) {
        missionStr += `${mission.room}\n`
    }
    
    //todo factory mode
    let factoryMode = mission.factoryMode
    let factoryStr = `factory:${factoryMode.toLocaleLowerCase()}`

    /* //todo change the gui so if mode is set to "Static", 
     then hide the globalTime / globalStrikes checkboxes */
    if(factoryMode != "Static") {
        factoryStr += `${mission.globalTime ? "gtime" : ""}${mission.globalStrikes ? "gstrikes" : ""}`
    }

    missionStr += `${factoryStr}\n`;

    //todo bombs
    for(let bomb of mission.bombs) {
        let bombStr = `(\n`

        //todo time
        let time = bomb.time
        bombStr += `[${time.days}]:[${time.hours}]:[${time.minutes}]:[${time.seconds}]\n`

        //todo strikes
        bombStr += `${bomb.strikes}X\n`

        //todo widgets
        bombStr += `widgets:${bomb.widgets}\n`

        //todo needy activation time
        bombStr += `needyactivationtime:${bomb.needyActivationTime}`

        //todo front only
        if(bomb.frontOnly) {
            bombStr += `frontonly\n`
        }

        //todo pools
        for(let pool of bomb.pools) {

            let poolStr = `${pool.distinct ? "!" : ""}${pool.occurrence}*`

            switch(pool.poolType) {
                case "Preset":
                    let preset = pool.presetType! 
                    if(preset == "Profile") {
                        poolStr += `profile:${pool.profileName}`
                    }

                    else if(preset == "Needy Profile") {
                        poolStr += `needyprofile:${pool.profileName}`
                    }

                    else {
                        poolStr += `${preset.toUpperCase().replaceAll(" ", "_")}\n`
                    }
                break;
                case "Pool":
                    let arr:string[] = [];
                    pool.entries!.forEach(entry => {
                        arr.push(...Array(entry.weight).fill(modulesByName.get(entry.moduleName)!.ModuleID))
                    })

                    poolStr += `${arr.join(",")}\n`
                break;
                case "Module Name":
                    poolStr += `${modulesByName.get(pool.moduleName!)!.ModuleID}\n`
                break;
            }
            bombStr += `${poolStr}\n`
        }   
        missionStr += `${bombStr})`     
    }

    console.log(missionStr)
}