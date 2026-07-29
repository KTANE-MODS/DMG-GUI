// Todo for deletion of module entry, bomb, or pool, have confirmation prompt
// todo change the html so all of the form inputs (including global settings) won't appear until the loading is done. So only the name of the website and the loading elements will be visible
// todo show all verification errors at once
// todo add import for dmg

import { getModulesByName } from "./modules.js";
import { Bomb } from "./types";


// Verification (will hold a list of errors and show them at the end)
export function verifyFormInformation() {
    const modulesByName = getModulesByName();
    let errors: string[] = []; 
    const inputs = document.querySelectorAll<HTMLInputElement>("#global-settings input");

    
    // todo verify mission name trimmed is not blank
    const missionName = inputs[0].value.trim();

    if(missionName.length == 0) {
        errors.push("Mission name is empty");
    }

    // todo verify mission description trimmed is not blank
    const missionDescription = inputs[1].value.trim();

    if(missionDescription.length == 0) {
        errors.push("Mission Description is empty");
    }

    const room = inputs[2].value.trim();
    const frontOnly = inputs[3].checked;

    // todo for each bomb,
    let bombs: Bomb[] = [] 
    let bombFieldSets = document.querySelectorAll<HTMLFieldSetElement>("#bomb-list fieldset.bomb")

    for(let bombFieldSet of bombFieldSets)
    {
        const bombInputs = bombFieldSet.querySelectorAll<HTMLInputElement>("input")

        // Bomb Time is max 6 days
        const DAYS_TO_SECONDS = 86400;
        const days =    parseInt(bombInputs[0].value);
        const hours =   parseInt(bombInputs[1].value);
        const minutes = parseInt(bombInputs[2].value);
        const seconds = parseInt(bombInputs[3].value);

        const totalBombTime = days * DAYS_TO_SECONDS + 
                              hours * 3600 +
                              minutes * 60 + 
                              seconds;

        if(totalBombTime / DAYS_TO_SECONDS > 6) {
            errors.push("Bomb time cannot go above 6 days")
        }

        // todo strikes is at least 1
        const strikes = parseInt(bombInputs[4].value);

        if(strikes < 1) {
            errors.push("Strikes cannot be below 1")
        }

        // todo Widgets is at least 0
        const widgets = parseInt(bombInputs[5].value);

        if(widgets < 1) {
            errors.push("Widgets cannot be below 1")
        }

        // todo needy activation time is at least 0 
        const needy = parseInt(bombInputs[6].value);

        if(needy < 0) {
            errors.push("needy cannot be below 0")
        }

        const poolFieldSets = bombFieldSet.querySelectorAll<HTMLFieldSetElement>("#pool-list fieldset.pool")

        // todo for each Pool
        for(let poolFieldSet of poolFieldSets) 
        {
            const poolInputs = poolFieldSet.querySelectorAll<HTMLInputElement>("input")

            //todo verify occurrence is at least 1
            const occurrences = parseInt(poolInputs[0].value);

            if(occurrences < 1) {
                errors.push("Occurrences cannot be below 1")
            }

            const poolType = poolFieldSet.querySelector<HTMLSelectElement>(".pool-type")!.value

            switch(poolType)
            {
                // todo if type is "preset"
                case 'Preset':
                    // todo preset is "profile" or "needy profile", verify json input is not empty
                    const presetType = poolFieldSet.querySelector<HTMLSelectElement>(".preset-type")!.value

                    if(["Profile", "Needy Profile"].includes(presetType)) {
                        const fileList = (poolFieldSet.querySelector<HTMLInputElement>('input[type="file"]')!.files as FileList)

                        if(fileList.length < 1) {
                            errors.push("There must be profile attached")
                        }
                    }
                break;

                // todo if type is "pool"
                case 'Pool':
                    // todo for each module entry
                    const modEntries = poolFieldSet.querySelectorAll<HTMLDivElement>('.module-entry')
                    let percentages = [];
                    for(let modEntry of modEntries) {
                        const modEntryInputs = modEntry.querySelectorAll<HTMLInputElement>("input")
                        // todo verify module name is one of the ones loaded from the json
                        const moduleName = modEntryInputs[1].value

                        if(!modulesByName.has(moduleName)) {
                            errors.push(`${modulesByName} is not a valid module name.`)
                        }
                        
                        // todo verify percentage is between 0 - 100. Only taking integers for now
                        const modulePercentage = parseInt(modEntryInputs[0].value)

                        if(modulePercentage < 0 || modulePercentage > 100) {
                            errors.push("Module percentage should be between 0 and 100 inclusively")
                        }
                        percentages.push(modulePercentage)
                    }
                    // todo verify percentage sums to 100
                    const modulePercentageSum = percentages.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue;
                    })

                    if(modulePercentageSum != 100) {
                        errors.push(`Module percentage needs to total to 100. Got ${modulePercentageSum}`);
                    }
                break;

                // todo if type is "Module Name"
                case 'Module Name':
                // todo verify module name is not empty
                const moduleName = poolFieldSet.querySelector<HTMLInputElement>('input')!.value
                if(!modulesByName.has(moduleName)) {
                            errors.push(`${modulesByName} is not a valid module name.`)
                }
                break;
            }
        }
    }

    console.log(errors)
}