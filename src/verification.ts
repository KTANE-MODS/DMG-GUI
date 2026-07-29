// Todo for deletion of module entry, bomb, or pool, have confirmation prompt
// todo change the html so all of the form inputs (including global settings) won't appear until the loading is done. So only the name of the website and the loading elements will be visible
// todo show all verification errors at once
// todo add import for dmg

import { Bomb } from "./types";

// Verification (will hold a list of errors and show them at the end)
function verifyFormInformation() {
    let errors: string[] = []; 
    const inputs = document.querySelectorAll<HTMLInputElement>("#login input");
    
    // todo verify mission name trimmed is not blank
    const missionName = inputs[0].innerHTML.trim();

    if(missionName.length == 0) {
        errors.push("Mission name is empty");
    }

    // todo verify mission description trimmed is not blank
    const missionDescription = inputs[1].innerHTML.trim();

    if(missionDescription.length == 0) {
        errors.push("Mission Description is empty");
    }

    const room = inputs[2].innerHTML.trim();
    const frontOnly = inputs[3].checked;

    // todo for each bomb,
    let bombs: Bomb[] = [] 
    let bombFieldSets = document.querySelectorAll<HTMLFieldSetElement>("#bomb-list fieldset")

    for(let bombFieldSet of bombFieldSets)
    {
        const bombInputs = bombFieldSet.querySelectorAll<HTMLInputElement>("input")
        // todo Bomb Time is max 6 days
        const days = bombInputs[0].innerHTML;
        const hours = bombInputs[1].innerHTML;
        const minutes = bombInputs[2].innerHTML;
        const seconds = bombInputs[3].innerHTML;

        // todo strikes is at least 1
        const strikes = bombInputs[4].innerHTML;

        // todo Widgets is at least 0
        const widgets = bombInputs[5].innerHTML;

        // todo needy activation time is at least 0 
        const needy = bombInputs[6].innerHTML;

        const poolFieldSets = bombFieldSet.querySelectorAll<HTMLFieldSetElement>("#pool-list fieldset")

        // todo for each Pool
        for(let poolFieldSet of poolFieldSets) 
        {
            const poolInputs = poolFieldSet.querySelectorAll<HTMLInputElement>("input")

            //todo verify occurrence is at least 1
            const occurrences = poolInputs[0].innerHTML;

            const poolType = poolFieldSet.querySelector<HTMLSelectElement>(".pool-type")!.innerHTML

            switch(poolType)
            {
                // todo if type is "preset"
                case 'Preset':
                    // todo preset is "profile" or "needy profile", verify json input is not empty
                    const presetType = poolFieldSet.querySelector<HTMLSelectElement>(".preset-type")!.innerHTML

                    if(["Profile", "Needy Profile"].includes(presetType)) {
                        const file = (poolFieldSet.querySelector<HTMLInputElement>('input[type="file"]')!.files as FileList)[0]
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
                        const moduleName = modEntryInputs[1].innerHTML
                        // todo verify percentage is between 0 - 100. Only taking integers for now
                        const modulePercentage = modEntryInputs[0].innerHTML
                        percentages.push(modulePercentage)
                    }
                    // todo verify percentage sums to 100
                break;

                // todo if type is "Module Name"
                case 'Module Name':
                // todo verify module name is not empty
                const moduleName = poolFieldSet.querySelector<HTMLInputElement>('input')!.innerHTML
                break;
            }
            
            

            
        }


    }
}