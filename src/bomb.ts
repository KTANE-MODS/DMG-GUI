// Knows how to create a bomb element
import { createPoolElement } from "./pool.js";

export function createBombElement(): HTMLFieldSetElement {

    const fieldset = document.createElement("fieldset");

    fieldset.className = "bomb";

    fieldset.innerHTML = `
        <legend>Bomb</legend>

        <label>
            Bomb Time
            <input type="number" value="300">
        </label>

        <label>
            Strikes
            <input type="number" value="3">
        </label>

        <label>
            Widgets
            <input type="number" value="5">
        </label>

        <label>
            <input type="checkbox">
            Front Only
        </label>

        <hr>

        <button
            type="button"
            class="add-pool">
            Add Pool
        </button>

        <button
            type="button"
            class="remove-bomb">
            Remove Bomb
        </button>

        <div class="pool-list"></div>
    `;

    const poolList = fieldset.querySelector(".pool-list")!;

    fieldset
        .querySelector(".add-pool")!
        .addEventListener("click", () => {
            poolList.appendChild(createPoolElement());
        });

    fieldset
        .querySelector(".remove-bomb")!
        .addEventListener("click", () => {
            fieldset.remove();

        });

    // Every bomb starts with one pool
    poolList.appendChild(createPoolElement());

    return fieldset;
}