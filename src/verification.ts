// Todo for deletion of module entry, bomb, or pool, have confirmation prompt
// todo add import for dmg

import { getModulesByName } from "./modules.js";
import { Bomb, FactoryMode, Mission, ModuleEntry, Pool, PoolType, PresetType } from "./types";

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

const elementSelectors = {
    MISSION_NAME: ".mission-name",
    MISSION_DESCRIPTION: ".mission-description",
    ROOM: ".room",
    FACTORY_MODE: "global-settings .pool-type",
    GLOBAL_TIME: ".global-time",
    GLOBAL_STRIKES: ".global-strikes",
    DAYS: ".bomb-days",
    HOURS: ".bomb-hours",
    MINUTES: ".bomb-minutes",
    SECONDS: ".bomb-seconds",
    STRIKES: ".bomb-strikes",
    WIDGETS: ".bomb-widgets",
    NEEDY_TIME: ".bomb-needy-time",
    POOL_OCCURRENCE: ".pool-occurrence",
    POOL_TYPE: ".pool-type",
    PRESET_TYPE: ".preset-type",
    FILE_INPUT: `input[type="file"]'`,
    POOL_MODULE_NAME: ".pool-module-name",
    POOL_MODULE_WEIGHT: ".pool-module-weight"
}

// Verification - shows every error at once, at the element it belongs to.
// Returns a mission if the form is valid. Null otherwise
export function verifyFormInformation(): Mission | null {
    clearAllFieldErrors();

    let mission: Mission = {} as Mission;

    const modulesByName = getModulesByName();
    let errors: string[] = [];

    const globalSettings = document.querySelector("#global-settings")!;

    //verify mission name trimmed is not blank
    const missionName = getTextInputValue(globalSettings, elementSelectors.MISSION_NAME)

   if (missionName.length == 0) {
        addError(errors , getTextInputElement(globalSettings, elementSelectors.MISSION_NAME), "Mission name is empty")
    }
    else {
        mission.name = missionName;
    }

    //verify mission description trimmed is not blank
    const missionDescription = getTextInputValue(globalSettings, elementSelectors.MISSION_DESCRIPTION);
    
    if (missionDescription.length == 0) {
        addError(errors , getTextInputElement(globalSettings, elementSelectors.MISSION_DESCRIPTION), "Mission Description is empty")
    }
    else {
        mission.description = missionDescription;
    }

    const room = getTextInputValue(globalSettings, elementSelectors.ROOM);

    if(room.length !== 0) {
        mission.room = room;
    }

    mission.factoryMode = getTextInputValue(document, elementSelectors.FACTORY_MODE) as FactoryMode;

    mission.globalTime = getTextInputElement(document, elementSelectors.GLOBAL_TIME)!.checked
    mission.globalStrikes = getTextInputElement(document, elementSelectors.GLOBAL_STRIKES)!.checked

    //for each bomb,
    mission.bombs = [];
    let bombFieldSets = document.querySelectorAll<HTMLFieldSetElement>("#bomb-list fieldset.bomb")

    for (let bombFieldSet of bombFieldSets) {
        let bomb: Bomb = {} as Bomb

        // Bomb Time is max 6 days
        const DAYS_TO_SECONDS = 86400;
        const days = getIntInputValue(bombFieldSet, elementSelectors.DAYS);
        const hours = getIntInputValue(bombFieldSet, elementSelectors.HOURS);
        const minutes = getIntInputValue(bombFieldSet, elementSelectors.MINUTES);
        const seconds = getIntInputValue(bombFieldSet, elementSelectors.SECONDS);

        const totalBombTime = days * DAYS_TO_SECONDS +
            hours * 3600 +
            minutes * 60 +
            seconds;

            
        if (totalBombTime / DAYS_TO_SECONDS > 6) {
            const bombTimeFieldset = bombFieldSet.querySelector<HTMLFieldSetElement>(".bomb-time")!;
            addError(errors , bombTimeFieldset, "Bomb time cannot go above 6 days")

        }
        else {
            bomb.time = {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
        }

        //strikes is at least 1
        const strikes = getIntInputValue(bombFieldSet, elementSelectors.STRIKES);

        

        if (strikes < 1) {
            addError(errors, getTextInputElement(bombFieldSet, elementSelectors.STRIKES), "Strikes cannot be below 1")

        }
        else {
            bomb.strikes = strikes;
        }

        //Widgets is at least 0
        const widgets = getIntInputValue(bombFieldSet, elementSelectors.WIDGETS);

        if (widgets < 0) {
            addError(errors, getTextInputElement(bombFieldSet, elementSelectors.WIDGETS), "Widgets cannot be below 0")
        }
        else {
            bomb.widgets = widgets;
        }

        //needy activation time is at least 0 
        const needy = getIntInputValue(bombFieldSet, elementSelectors.NEEDY_TIME);

        if (needy < 0) {
            addError(errors, getTextInputElement(bombFieldSet, elementSelectors.NEEDY_TIME), "Needy Activation Time cannot be below 0 seconds")
        }
        else {
            bomb.needyActivationTime = needy;
        }

        const poolFieldSets = bombFieldSet.querySelectorAll<HTMLFieldSetElement>(".pool-list fieldset.pool")
        
        bomb.pools = []
        
        //for each Pool
        for (let poolFieldSet of poolFieldSets) {
            let pool: Pool = {} as Pool

            //verify occurrence is at least 1
            const occurrences = getIntInputValue(poolFieldSet, elementSelectors.POOL_OCCURRENCE)

            if (occurrences < 1) {
                addError(errors, getTextInputElement(bombFieldSet, elementSelectors.POOL_OCCURRENCE), "Occurrences cannot be below 1")
            }
            
            pool.occurrence = occurrences;
            
            const poolType = getTextInputValue(poolFieldSet, elementSelectors.POOL_TYPE)

            pool.poolType = poolType as PoolType;

            switch (poolType) {
                //if type is "preset"
                case 'Preset':
                    //preset is "profile" or "needy profile", verify json input is not empty
                    const presetType = poolFieldSet.querySelector<HTMLSelectElement>(elementSelectors.PRESET_TYPE)!.value
                    
                    if (["Profile", "Needy Profile"].includes(presetType)) {
                        const fileInput = poolFieldSet.querySelector<HTMLInputElement>(elementSelectors.FILE_INPUT)!;
                        const fileList = (fileInput.files as FileList)

                        if (fileList.length < 1) {
                            addError(errors, fileInput, "There must be profile attached")
                        }

                        else {
                            pool.profileName = fileList[0].name;
                        }
                    }

                    pool.presetType = presetType as PresetType
                    break;

                //if type is "pool"
                case 'Pool':
                    //for each module entry
                    const modEntries = poolFieldSet.querySelectorAll<HTMLDivElement>('.module-entry')
                    let entries: ModuleEntry[] = []
                    for (let modEntry of modEntries) {
                        let entry: ModuleEntry = {} as ModuleEntry
                        //verify module name is one of the ones loaded from the json
                        const moduleName = getTextInputValue(modEntry, elementSelectors.POOL_MODULE_NAME)

                        if (!modulesByName.has(moduleName)) {
                            addError(errors, getTextInputElement(modEntry, elementSelectors.POOL_MODULE_NAME), `"${moduleName}" is not a valid module name.`)
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

function addError(errorArr: string[], element: Element | null, error: string) {
    errorArr.push(error);
    markFieldInvalid(element, error);
}

function getTextInputElement(baseElement: Element | Document, selector: string) {
    return baseElement.querySelector<HTMLInputElement>(selector);
}

function getTextInputValue(baseElement: Element | Document, selector: string) {
    return getTextInputElement(baseElement, selector)!.value.trim();
}

function getIntInputValue(baseElement: Element | Document, selector: string): number {
    return parseInt(getTextInputValue(baseElement, selector))
}