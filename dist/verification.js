// Todo for deletion of module entry, bomb, or pool, have confirmation prompt
// todo add import for dmg
import { getModulesByName } from "./modules.js";
const FIELD_INVALID_CLASS = "field-invalid";
const FIELD_ERROR_CLASS = "field-error";
// Clears every validation marker (invalid labels/fieldsets and error messages)
// left over from a previous validation pass.
function clearAllFieldErrors() {
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
function markFieldInvalid(element, message) {
    if (!element) {
        return;
    }
    const label = element.closest("label");
    const target = label ?? element;
    target.classList.add(FIELD_INVALID_CLASS);
    let errorSpan = target.nextElementSibling;
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
function markFieldsetInvalid(fieldset, message) {
    fieldset.classList.add(FIELD_INVALID_CLASS);
    let errorSpan = fieldset.querySelector(`:scope > .${FIELD_ERROR_CLASS}`);
    if (!errorSpan) {
        errorSpan = document.createElement("span");
        errorSpan.className = FIELD_ERROR_CLASS;
        const legend = fieldset.querySelector("legend");
        if (legend) {
            legend.after(errorSpan);
        }
        else {
            fieldset.prepend(errorSpan);
        }
    }
    errorSpan.textContent = errorSpan.textContent
        ? `${errorSpan.textContent} ${message}`
        : message;
}
const elementSelectors = {
    global: {
        missionName: ".mission-name",
        missionDescription: ".mission-description",
        room: ".room",
        globalTime: ".global-time",
        globalStrikes: ".global-strikes",
        factoryMode: ".factory-mode",
    },
    bomb: {
        days: ".bomb-days",
        hours: ".bomb-hours",
        minutes: ".bomb-minutes",
        seconds: ".bomb-seconds",
        strikes: ".bomb-strikes",
        widgets: ".bomb-widgets",
        needyTime: ".bomb-needy-time",
    },
    pool: {
        occurrence: ".pool-occurrence",
        distinct: ".distinct",
        type: ".pool-type",
        presetType: ".preset-type",
        fileInput: '.profile-upload',
        moduleWeight: ".pool-module-weight",
        moduleName: ".module-name"
    },
};
// Verification - shows every error at once, at the element it belongs to.
// Returns a mission if the form is valid. Null otherwise
export function verifyFormInformation() {
    clearAllFieldErrors();
    let mission = {};
    const modulesByName = getModulesByName();
    let errors = [];
    const globalSettings = document.querySelector("#global-settings");
    //verify mission name trimmed is not blank
    const missionName = getTextInputValue(globalSettings, elementSelectors.global.missionName);
    if (missionName.length == 0) {
        addError(errors, findTextInputElement(globalSettings, elementSelectors.global.missionName), "Mission name is empty");
    }
    else {
        mission.name = missionName;
    }
    //verify mission description trimmed is not blank
    const missionDescription = getTextAreaValue(globalSettings, elementSelectors.global.missionDescription);
    if (missionDescription.length == 0) {
        addError(errors, findTextAreaElement(globalSettings, elementSelectors.global.missionDescription), "Mission Description is empty");
    }
    else {
        mission.description = missionDescription;
    }
    const room = getTextInputValue(globalSettings, elementSelectors.global.room);
    if (room.length !== 0) {
        mission.room = room;
    }
    mission.factoryMode = getTextInputValue(document, elementSelectors.global.factoryMode);
    mission.globalTime = findTextInputElement(document, elementSelectors.global.globalTime).checked;
    mission.globalStrikes = findTextInputElement(document, elementSelectors.global.globalStrikes).checked;
    //for each bomb,
    mission.bombs = [];
    let bombFieldSets = document.querySelectorAll("#bomb-list fieldset.bomb");
    for (let bombFieldSet of bombFieldSets) {
        let bomb = {};
        // Bomb Time is max 6 days
        const DAYS_TO_SECONDS = 86400;
        const days = getIntegerInputValue(bombFieldSet, elementSelectors.bomb.days);
        const hours = getIntegerInputValue(bombFieldSet, elementSelectors.bomb.hours);
        const minutes = getIntegerInputValue(bombFieldSet, elementSelectors.bomb.minutes);
        const seconds = getIntegerInputValue(bombFieldSet, elementSelectors.bomb.seconds);
        const totalBombTime = days * DAYS_TO_SECONDS +
            hours * 3600 +
            minutes * 60 +
            seconds;
        if (totalBombTime / DAYS_TO_SECONDS > 6) {
            const bombTimeFieldset = bombFieldSet.querySelector(".bomb-time");
            addError(errors, bombTimeFieldset, "Bomb time cannot go above 6 days");
        }
        else {
            bomb.time = {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        }
        //strikes is at least 1
        const strikes = getIntegerInputValue(bombFieldSet, elementSelectors.bomb.strikes);
        if (strikes < 1) {
            addError(errors, findTextInputElement(bombFieldSet, elementSelectors.bomb.strikes), "Strikes cannot be below 1");
        }
        else {
            bomb.strikes = strikes;
        }
        //Widgets is at least 0
        const widgets = getIntegerInputValue(bombFieldSet, elementSelectors.bomb.widgets);
        if (widgets < 0) {
            addError(errors, findTextInputElement(bombFieldSet, elementSelectors.bomb.widgets), "Widgets cannot be below 0");
        }
        else {
            bomb.widgets = widgets;
        }
        //needy activation time is at least 0 
        const needy = getIntegerInputValue(bombFieldSet, elementSelectors.bomb.needyTime);
        if (needy < 0) {
            addError(errors, findTextInputElement(bombFieldSet, elementSelectors.bomb.needyTime), "Needy Activation Time cannot be below 0 seconds");
        }
        else {
            bomb.needyActivationTime = needy;
        }
        const poolFieldSets = bombFieldSet.querySelectorAll(".pool-list fieldset.pool");
        bomb.pools = [];
        //for each Pool
        for (let poolFieldSet of poolFieldSets) {
            let pool = {};
            //verify occurrence is at least 1
            const occurrences = getIntegerInputValue(poolFieldSet, elementSelectors.pool.occurrence);
            if (occurrences < 1) {
                addError(errors, findTextInputElement(poolFieldSet, elementSelectors.pool.occurrence), "Occurrences cannot be below 1");
            }
            pool.occurrence = occurrences;
            const poolType = getTextInputValue(poolFieldSet, elementSelectors.pool.type);
            pool.poolType = poolType;
            switch (poolType) {
                //if type is "preset"
                case 'Preset':
                    //preset is "profile" or "needy profile", verify json input is not empty
                    const presetType = getSelectValue(poolFieldSet, elementSelectors.pool.presetType);
                    if (["Profile", "Needy Profile"].includes(presetType)) {
                        const fileInput = findTextInputElement(poolFieldSet, elementSelectors.pool.fileInput);
                        const fileList = fileInput.files;
                        if (fileList.length < 1) {
                            addError(errors, fileInput, "There must be profile attached");
                        }
                        else {
                            pool.profileName = fileList[0].name;
                        }
                    }
                    pool.presetType = presetType;
                    break;
                //if type is "pool"
                case 'Pool':
                    //for each module entry
                    const modEntries = poolFieldSet.querySelectorAll('.module-entry');
                    let entries = [];
                    for (let modEntry of modEntries) {
                        let entry = {};
                        //verify module name is one of the ones loaded from the json
                        const moduleName = getTextInputValue(modEntry, elementSelectors.pool.moduleName);
                        if (!modulesByName.has(moduleName)) {
                            addError(errors, findTextInputElement(modEntry, elementSelectors.pool.moduleName), `"${moduleName}" is not a valid module name.`);
                        }
                        else {
                            entry.moduleName = moduleName;
                        }
                        //verify weight is an integer
                        let weightValid = true;
                        const moduleWeight = getIntegerInputValue(modEntry, elementSelectors.pool.moduleName);
                        if (moduleWeight != Number(findTextInputElement(modEntry, elementSelectors.pool.moduleWeight))) {
                            addError(errors, findTextInputElement(modEntry, elementSelectors.pool.moduleWeight), "Weight must be an integer.");
                            weightValid = false;
                        }
                        //verify the weight is between 1 - 50. 
                        if (moduleWeight < 1 || moduleWeight > 50) {
                            errors.push("Module weight should be between 1 and 50 inclusively");
                            markFieldInvalid(findTextInputElement(modEntry, elementSelectors.pool.moduleWeight), "Module weight should be between 1 and 50 inclusively");
                            weightValid = false;
                        }
                        if (weightValid) {
                            entry.weight = moduleWeight;
                            entries.push(entry);
                        }
                    }
                    pool.entries = entries;
                    break;
                //if type is "Module Name"
                case 'Module Name':
                    //verify module name is not empty
                    const moduleName = getSelectValue(poolFieldSet, elementSelectors.pool.moduleName);
                    if (!modulesByName.has(moduleName)) {
                        addError(errors, findTextInputElement(poolFieldSet, elementSelectors.pool.moduleName), `"${moduleName}" is not a valid module name.`);
                    }
                    else {
                        pool.moduleName = moduleName;
                    }
                    break;
            }
            pool.distinct = findTextInputElement(poolFieldSet, elementSelectors.pool.distinct).checked;
            bomb.pools.push(pool);
        }
        mission.bombs.push(bomb);
    }
    if (errors.length !== 0) {
        return null;
    }
    return mission;
}
function addError(errorArr, element, error) {
    errorArr.push(error);
    markFieldInvalid(element, error);
}
function getFindElementError(container, selector) {
    return new Error(`Could not find input matching selector: ${selector} on the container ${container}`);
}
/**
 * Finds a text area within the specified container.
 *
 * @param container - The element or document to search within.
 * @param selector - CSS selector used to locate the input.
 * @returns The matching input element, or null if no matching element is found.
 */
function findTextAreaElement(container, selector) {
    return container.querySelector(selector);
}
/**
 * Gets the trimmed value of a text area within the specified container.
 *
 * @param container - The element or document to search within.
 * @param selector - CSS selector used to locate the input.
 * @returns The trimmed value of the matching input.
 * @throws Error if no matching input element is found.
 */
function getTextAreaValue(container, selector) {
    const input = findTextAreaElement(container, selector);
    if (!input) {
        throw getFindElementError(container, selector);
    }
    return input.value.trim();
}
/**
 * Finds a text input within the specified container.
 *
 * @param container - The element or document to search within.
 * @param selector - CSS selector used to locate the input.
 * @returns The matching input element, or null if no matching element is found.
 */
function findTextInputElement(container, selector) {
    return container.querySelector(selector);
}
/**
 * Gets the trimmed value of a text input within the specified container.
 *
 * @param container - The element or document to search within.
 * @param selector - CSS selector used to locate the input.
 * @returns The trimmed value of the matching input.
 * @throws Error if no matching input element is found.
 */
function getTextInputValue(container, selector) {
    const input = findTextInputElement(container, selector);
    if (!input) {
        throw getFindElementError(container, selector);
    }
    return input.value.trim();
}
/**
 * Gets the value of a text input as an integer.
 *
 * @param container - The element or document to search within.
 * @param selector - CSS selector used to locate the input.
 * @returns The parsed integer value of the matching input.
 * @throws Error if no matching input element is found.
 */
function getIntegerInputValue(container, selector) {
    return parseInt(getTextInputValue(container, selector));
}
/**
 * Finds a selector within the specified container.
 * @param container - The element or document to search within.
 * @param selector - CSS selector used to locate the input.
 * @returns The matching input element, or null if no matching element is found.
 */
function getSelectorElement(container, selector) {
    return container.querySelector(selector);
}
function getSelectValue(container, selector) {
    let element = getSelectorElement(container, selector);
    if (!element) {
        throw getFindElementError(container, selector);
    }
    return element.value;
}
//# sourceMappingURL=verification.js.map