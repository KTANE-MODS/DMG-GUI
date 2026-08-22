import { getModulesByName } from "./modules.js";
import { saveTextFile } from "./io.js";
/* //todo: if any of the following are the same as the default, don't include it for a individual bomb:
    time
    strikes
    widget
    needy time
*/
export async function generateDMGText(mission) {
    let modulesByName = getModulesByName();
    let missionStr = "";
    //mission name
    missionStr += `///${mission.name}\n`;
    // mission description
    missionStr += `${mission.description.split("\n").map(line => `///${line.trim()}`).join("\n")}\n`;
    //room
    if (mission.room != undefined) {
        missionStr += `${mission.room}\n`;
    }
    //factory mode
    let factoryMode = mission.factoryMode;
    let factoryStr = `factory:${factoryMode.toLocaleLowerCase()}`;
    /* //todo change the gui so if mode is set to "Static",
         todo then hide the globalTime / globalStrikes checkboxes */
    if (factoryMode != "Static") {
        factoryStr += `${mission.globalTime ? "gtime" : ""}${mission.globalStrikes ? "gstrikes" : ""}`;
    }
    missionStr += `${factoryStr}\n`;
    //default time
    missionStr += getBombTime(mission.defaultBomb.time);
    //default strike
    missionStr += getStrikes(mission.defaultBomb.strikes);
    //default widgets
    missionStr += getWidgets(mission.defaultBomb.widgets);
    //default needy time
    missionStr += getNeedyActivationTime(mission.defaultBomb.needyActivationTime);
    //todo bombs
    for (let bomb of mission.bombs) {
        let bombStr = `(\n`;
        //time
        if (!bomb.useDefaultTime) {
            bombStr += getBombTime(bomb.time);
        }
        //strikes
        if (!bomb.useDefaultStrikes) {
            bombStr += getStrikes(bomb.strikes);
        }
        //widgets
        if (!bomb.useDefaultWidgets) {
            bombStr += getWidgets(bomb.widgets);
        }
        //needy activation time
        if (!bomb.useDefaultNeedyActivationTime) {
            bombStr += getNeedyActivationTime(bomb.needyActivationTime);
        }
        //front only
        if ((bomb.useDefaultFrontOnly && mission.defaultBomb.frontOnly) || (!bomb.useDefaultFrontOnly && bomb.frontOnly)) {
            bombStr += `frontonly\n`;
        }
        //pools
        for (let pool of bomb.pools) {
            let poolStr = `${pool.distinct ? "!" : ""}${pool.occurrence}*`;
            switch (pool.poolType) {
                case "Preset":
                    let preset = pool.presetType;
                    if (preset == "Profile") {
                        poolStr += `profile:${pool.profileName}`;
                    }
                    else if (preset == "Needy Profile") {
                        poolStr += `needyprofile:${pool.profileName}`;
                    }
                    else {
                        poolStr += `${preset.toUpperCase().replaceAll(" ", "_")}`;
                    }
                    break;
                case "Pool":
                    let arr = [];
                    pool.entries.forEach(entry => {
                        arr.push(...Array(entry.weight).fill(modulesByName.get(entry.moduleName).ModuleID));
                    });
                    poolStr += `${arr.join(",")}`;
                    break;
                case "Module Name":
                    poolStr += `${modulesByName.get(pool.moduleName).ModuleID}`;
                    break;
            }
            bombStr += `${poolStr}\n`;
        }
        missionStr += `${bombStr})\n`;
    }
    console.log(missionStr);
    await (saveTextFile(mission.name, missionStr));
}
function getBombTime(time) {
    let hours = time.hours + (time.days * 24);
    return `${hours}:${time.minutes}:${time.seconds}\n`;
}
function getStrikes(strikes) {
    return `${strikes}X\n`;
}
function getWidgets(widgets) {
    return `widgets:${widgets}\n`;
}
function getNeedyActivationTime(time) {
    return `needyactivationtime:${time}\n`;
}
//# sourceMappingURL=mission.js.map