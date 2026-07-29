import { loadModules } from "./modules.js";
import { createBombElement } from "./bomb.js";

async function initialize() {

    const loadingText = document.querySelector<HTMLDivElement>("#loading")!;

    await loadModules();

    const bombList =
        document.querySelector<HTMLDivElement>("#bomb-list")!;

    bombList.appendChild(createBombElement());

    document
        .querySelector("#add-bomb")!
        .addEventListener("click", () => {

            bombList.appendChild(createBombElement());

        });
}

initialize();