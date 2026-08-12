// Knows how to create a bomb element
import { createPoolElement } from "./pool.js";
export function createBombElement() {
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

        <label class="use-default-toggle">
            <input type="checkbox" class="use-default-time">
            Use default
        </label>
        </fieldset>


        <div class="field-with-default">
            <label>
                Strikes
                <input type="number" min="1" value="3" class="bomb-strikes">
            </label>
            <label class="use-default-toggle">
                <input type="checkbox" class="use-default-strikes">
                Use default
            </label>
        </div>

        <div class="field-with-default">
            <label>
                Widgets
                <input type="number" value="5" class="bomb-widgets">
            </label>
            <label class="use-default-toggle">
                <input type="checkbox" class="use-default-widgets">
                Use default
            </label>
        </div>

        <div class="field-with-default">
            <label>
                Needy Activation Time (in seconds)
                <input
                    type="number"
                    min="0"
                    value="90"
                    class="bomb-needy-time"
                >
            </label>
            <label class="use-default-toggle">
                <input type="checkbox" class="use-default-needy-time">
                Use default
            </label>
        </div>

        <div class="field-with-default">
            <label>
                Front Only
                <input type="checkbox" class="bomb-front-only">
            </label>
            <label class="use-default-toggle">
                <input type="checkbox" class="use-default-front-only">
                Use default
            </label>
        </div>

        <hr>

        <div class="pool-list"></div>

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
    `;
    const bombTime = fieldset.querySelector(".bomb-time");
    toggleDefaultElements({
        defaultCheckBox: fieldset.querySelector(".use-default-time"),
        originalInputs: ["days", "hours", "minutes", "seconds"]
            .map(s => bombTime.querySelector(`.bomb-${s}`))
    });
    toggleDefaultElements({
        defaultCheckBox: fieldset.querySelector(".use-default-strikes"),
        originalInputs: [fieldset.querySelector(".bomb-strikes")]
    });
    toggleDefaultElements({
        defaultCheckBox: fieldset.querySelector(".use-default-widgets"),
        originalInputs: [fieldset.querySelector(".bomb-widgets")]
    });
    toggleDefaultElements({
        defaultCheckBox: fieldset.querySelector(".use-default-needy-time"),
        originalInputs: [fieldset.querySelector(".bomb-needy-time")]
    });
    toggleDefaultElements({
        defaultCheckBox: fieldset.querySelector(".use-default-front-only"),
        originalInputs: [fieldset.querySelector(".bomb-front-only")]
    });
    const poolList = fieldset.querySelector(".pool-list");
    fieldset
        .querySelector(".add-pool")
        .addEventListener("click", () => {
        poolList.appendChild(createPoolElement());
    });
    fieldset
        .querySelector(".remove-bomb")
        .addEventListener("click", () => {
        fieldset.remove();
    });
    // Every bomb starts with one pool
    poolList.appendChild(createPoolElement());
    return fieldset;
}
// Disable inputs if use default is checked
function toggleDefaultElements(binding) {
    const applyState = () => {
        binding.originalInputs.forEach(input => {
            input.disabled = binding.defaultCheckBox.checked;
        });
    };
    applyState();
    binding.defaultCheckBox.addEventListener("change", applyState);
}
//# sourceMappingURL=bomb.js.map