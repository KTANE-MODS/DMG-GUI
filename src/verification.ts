// Todo for deletion of module entry, bomb, or pool, have confirmation prompt
// todo add import for dmg

import { getModulesByName } from "./modules.js";
import { Bomb, FactoryMode, Mission, ModuleEntry, Pool, PoolType } from "./types";

const FIELD_INVALID_CLASS = "field-invalid";
const FIELD_ERROR_CLASS = "field-error";

// Clears every validation marker (invalid labels/fieldsets and error messages)
// left over from a previous validation pass.
function clearAllFieldErrors(): void {
    document
        .querySelectorAll(`.${FIELD_INVALID_CLASS}`)
        .forEach(el => el.classList.remove(FIELD_INVALID_CLASS));

    document
        .querySelectorAll(`.${FIELD_ERROR_CLASS}`)
        .forEach(el => el.remove());
}

// Marks the <label> wrapping an input/select as invalid (turns the element
// name red) and puts the error message right after it, red as well. If the
// element isn't wrapped in a label, falls back to marking the element itself.
function markFieldInvalid(element: Element | null, message: string): void {
    if (!element) {
        return;
    }

    const label = element.closest("label");
    const target = label ?? element;

    target.classList.add(FIELD_INVALID_CLASS);

    let errorSpan = target.nextElementSibling as HTMLElement | null;

    if (!errorSpan || !errorSpan.classList.contains(FIELD_ERROR_CLASS)) {
        errorSpan = document.createElement("span");
        errorSpan.className = FIELD_ERROR_CLASS;
        target.after(errorSpan);
    }

    // Multiple errors can apply to the same field (e.g. weight must be an
    // integer AND within range) - append rather than overwrite.
    errorSpan.textContent = errorSpan.textContent
        ? `${errorSpan.textContent} ${message}`
        : message;
}

// Same idea as markFieldInvalid, but for a whole fieldset (e.g. the bomb
// time group of four inputs) where a single error applies to the group.
// The message is placed right after the legend.
function markFieldsetInvalid(fieldset: HTMLFieldSetElement, message: string): void {
    fieldset.classList.add(FIELD_INVALID_CLASS);

    let errorSpan = fieldset.querySelector<HTMLElement>(`:scope > .${FIELD_ERROR_CLASS}`);

    if (!errorSpan) {
        errorSpan = document.createElement("span");
        errorSpan.className = FIELD_ERROR_CLASS;
        const legend = fieldset.querySelector("legend");
        if (legend) {
            legend.after(errorSpan);
        } else {
            fieldset.prepend(errorSpan);
        }
    }

    errorSpan.textContent = errorSpan.textContent
        ? `${errorSpan.textContent} ${message}`
        : message;
}

// Verification - shows every error at once, at the element it belongs to.
// Returns a mission if the form is valid. Null otherwise
export function verifyFormInformation(): Mission | null {
    clearAllFieldErrors();

    let mission: Mission = {} as Mission;

    const modulesByName = getModulesByName();
    let errors: string[] = [];
    const inputs = document.querySelectorAll<HTMLInputElement>("#global-settings input");


    //verify mission name trimmed is not blank
    const missionName = inputs[0].value.trim();


   if (missionName.length == 0) {
        errors.push("Mission name is empty");
        markFieldInvalid(inputs[0], "Mission name is empty");
    }
    else {
        mission.missionName = missionName;
    }

    //verify mission description trimmed is not blank
    const missionDescription = inputs[1].value.trim();

    if (missionDescription.length == 0) {
        errors.push("Mission Description is empty");
        markFieldInvalid(inputs[1], "Mission Description is empty");
    }
    else {
        mission.missionDescription = missionName;
    }

    const room = inputs[2].value.trim();

    if(room.length !== 0) {
        mission.room = room;
    }

    mission.factoryMode = document.querySelector<HTMLSelectElement>("#global-settings .pool-type")!.value as FactoryMode;

    mission.globalTime = inputs[3].checked
    mission.globalStrikes = inputs[4].checked

    //for each bomb,
    mission.bombs = [];
    let bombFieldSets = document.querySelectorAll<HTMLFieldSetElement>("#bomb-list fieldset.bomb")

    for (let bombFieldSet of bombFieldSets) {
        let bomb: Bomb = {} as Bomb
        const bombInputs = bombFieldSet.querySelectorAll<HTMLInputElement>("input")

        // Bomb Time is max 6 days
        const DAYS_TO_SECONDS = 86400;
        const days = parseInt(bombInputs[0].value);
        const hours = parseInt(bombInputs[1].value);
        const minutes = parseInt(bombInputs[2].value);
        const seconds = parseInt(bombInputs[3].value);

        const totalBombTime = days * DAYS_TO_SECONDS +
            hours * 3600 +
            minutes * 60 +
            seconds;

        if (totalBombTime / DAYS_TO_SECONDS > 6) {
            errors.push("Bomb time cannot go above 6 days")
            const bombTimeFieldset = bombFieldSet.querySelector<HTMLFieldSetElement>(".bomb-time")!;
            markFieldsetInvalid(bombTimeFieldset, "Bomb time cannot go above 6 days");
        }
        else {
            bomb.time = totalBombTime
        }

        //strikes is at least 1
        const strikes = parseInt(bombInputs[4].value);

        if (strikes < 1) {
            errors.push("Strikes cannot be below 1")
            markFieldInvalid(bombInputs[4], "Strikes cannot be below 1");
        }
        else {
            bomb.strikes = strikes;
        }

        //Widgets is at least 0
        const widgets = parseInt(bombInputs[5].value);

        if (widgets < 0) {
            errors.push("Widgets cannot be below 0")
            markFieldInvalid(bombInputs[5], "Widgets cannot be below 0");
        }
        else {
            bomb.widgets = widgets;
        }

        //needy activation time is at least 0 
        const needy = parseInt(bombInputs[6].value);

        if (needy < 0) {
            errors.push("Needy Activation Time cannot be below 0 seconds")
            markFieldInvalid(bombInputs[6], "Needy Activation Time cannot be below 0 seconds");
        }
        else {
            bomb.needyActivationTime = needy;
        }

        const poolFieldSets = bombFieldSet.querySelectorAll<HTMLFieldSetElement>(".pool-list fieldset.pool")
        
        bomb.pools = []
        
        //for each Pool
        for (let poolFieldSet of poolFieldSets) {
            let pool: Pool = {} as Pool
            const poolInputs = poolFieldSet.querySelectorAll<HTMLInputElement>("input")

            //verify occurrence is at least 1
            const occurrences = parseInt(poolInputs[0].value);

            if (occurrences < 1) {
                errors.push("Occurrences cannot be below 1")
                markFieldInvalid(poolInputs[0], "Occurrences cannot be below 1");
            }
            
            pool.occurrence = occurrences;
            
            const poolType = poolFieldSet.querySelector<HTMLSelectElement>(".pool-type")!.value

            pool.poolType = poolType as PoolType;

            switch (poolType) {
                //if type is "preset"
                case 'Preset':
                    //preset is "profile" or "needy profile", verify json input is not empty
                    const presetType = poolFieldSet.querySelector<HTMLSelectElement>(".preset-type")!.value

                    if (["Profile", "Needy Profile"].includes(presetType)) {
                        const fileInput = poolFieldSet.querySelector<HTMLInputElement>('input[type="file"]')!;
                        const fileList = (fileInput.files as FileList)

                        if (fileList.length < 1) {
                            errors.push("There must be profile attached")
                            markFieldInvalid(fileInput, "There must be profile attached");
                        }

                        else {
                            pool.profileName = fileList[0].name;
                        }

                    }
                    break;

                //if type is "pool"
                case 'Pool':
                    //for each module entry
                    const modEntries = poolFieldSet.querySelectorAll<HTMLDivElement>('.module-entry')
                    let entries: ModuleEntry[] = []
                    for (let modEntry of modEntries) {
                        let entry: ModuleEntry = {} as ModuleEntry
                        const modEntryInputs = modEntry.querySelectorAll<HTMLInputElement>("input")
                        //verify module name is one of the ones loaded from the json
                        const moduleName = modEntryInputs[1].value

                        if (!modulesByName.has(moduleName)) {
                            errors.push(`"${moduleName}" is not a valid module name.`)
                            markFieldInvalid(modEntryInputs[1], `"${moduleName}" is not a valid module name.`);
                        }
                        else {
                            entry.moduleName = moduleName;
                        }

                        //verify weight is an integer
                        const moduleWeight = parseInt(modEntryInputs[0].value)

                        if (moduleWeight != Number(modEntryInputs[0].value)) {
                            errors.push(`Weight must be an integer.`)
                            markFieldInvalid(modEntryInputs[0], "Weight must be an integer.");
                        }

                        //verify the weight is between 1 - 50. 
                        if (moduleWeight < 1 || moduleWeight > 50) {
                            errors.push("Module weight should be between 1 and 50 inclusively")
                            markFieldInvalid(modEntryInputs[0], "Module weight should be between 1 and 50 inclusively");
                        }
                        else {
                            entry.weight = moduleWeight;
                            entries.push(entry)
                        }
                    }

                    pool.entries = entries;
                    break;

                //if type is "Module Name"
                case 'Module Name':
                    //verify module name is not empty
                    const moduleName = poolInputs[2].value
                    if (!modulesByName.has(moduleName)) {
                        errors.push(`"${moduleName}" is not a valid module name.`)
                        markFieldInvalid(poolInputs[2], `"${moduleName}" is not a valid module name.`);
                    }
                    else {
                        pool.moduleName = moduleName
                    }
                    break;
            }

            bomb.pools.push(pool)
        }

        mission.bombs.push(bomb)
    }

    if(errors.length !== 0) {
        return null
    }

    return mission
}
