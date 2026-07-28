//  Starts the application
import { createBombElement } from "./ui/bomb.js";

const bombList =
    document.querySelector<HTMLDivElement>("#bomb-list")!;

const addBombButton =
    document.querySelector<HTMLButtonElement>("#add-bomb")!;

addBombButton.addEventListener("click", () => {

    bombList.appendChild(createBombElement());

});

// Every mission starts with one bomb
bombList.appendChild(createBombElement());