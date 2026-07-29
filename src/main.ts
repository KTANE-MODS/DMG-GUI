import { loadModules } from "./modules.js";
import { createBombElement } from "./bomb.js";
import { verifyFormInformation } from "./verification.js"

const generateButton = document.querySelector<HTMLButtonElement>("#generate")!;

const errorElement = document.querySelector<HTMLDivElement>("#error-message");

const missionForm = document.querySelector<HTMLFormElement>("#mission-form")!;

function showLoadingError(error: unknown): void {
    if (!errorElement) {
        console.error(error);
        return;
    }

    const message = error instanceof Error
            ? error.message
            : "Unknown error";

    errorElement.textContent = `Failed to fetch module list: ${message}`;

    // Keep the form (global settings, bombs, generate button, etc.) hidden
    // since the module list failed to load and the form depends on it.
    missionForm.hidden = true;
}

async function initialize() {
    // Hide the whole form (global settings, bombs section, generate button)
    // until the module list has finished loading successfully.
    missionForm.hidden = true;

    try {
        await loadModules();
        const bombList = document.querySelector<HTMLDivElement>("#bomb-list")!;

        bombList.appendChild(createBombElement());

        document
            .querySelector("#add-bomb")!
            .addEventListener("click", () => {
                bombList.appendChild(createBombElement());
            });

        errorElement!.hidden = true

        // Loading succeeded - reveal the form.
        missionForm.hidden = false;
    }
    catch (e) {
        showLoadingError(e)
    }
}

generateButton.onclick = function() {
  verifyFormInformation();
};

initialize();