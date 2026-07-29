// Knows how to create a bomb element
import { createPoolElement } from "./pool.js";

export function createBombElement(): HTMLFieldSetElement {

    const fieldset = document.createElement("fieldset");

    fieldset.className = "bomb";

    fieldset.innerHTML = `
        <legend>Bomb</legend>

        <fieldset class="bomb-time">
            <legend>Bomb Time</legend>

            <label>
                Days
                <input
                    type="number"
                    class="bomb-days"
                    min="0"
                    value="0">
            </label>

            <label>
                Hours
                <input
                    type="number"
                    class="bomb-hours"
                    min="0"
                    max="23"
                    value="0">
            </label>

            <label>
                Minutes
                <input
                    type="number"
                    class="bomb-minutes"
                    min="0"
                    max="59"
                    value="2">
            </label>

            <label>
                Seconds
                <input
                    type="number"
                    class="bomb-seconds"
                    min="0"
                    max="59"
                    value="0">
            </label>
        </fieldset>
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