import { loadModules } from "./modules.js";
import { createBombElement } from "./bomb.js";

const errorElement = document.querySelector<HTMLDivElement>("#error-message");

function showLoadingError(error: unknown): void {
    if (!errorElement) {
        console.error(error);
        return;
    }

    const message = error instanceof Error
            ? error.message
            : "Unknown error";

    errorElement.textContent = `Failed to fetch module list: ${message}`;
}

async function initialize() {
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
    }
    catch (e) {
        showLoadingError(e)
    }
}


initialize();