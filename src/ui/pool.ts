// Knows how to create a pool element
export function createPoolElement(): HTMLFieldSetElement {
    const fieldset = document.createElement("fieldset");

    fieldset.className = "pool";

    fieldset.innerHTML = `
        <legend>Pool</legend>

        <label>
            Occurrence
            <input type="number" value="1">
        </label>

        <label>
            Pool Type
            <select>
                <option>Preset</option>
                <option>Pool</option>
                <option>Module Name</option>
            </select>
        </label>

        <label>
            <input type="checkbox">
            Distinct
        </label>

        <button type="button" class="remove-pool">
            Remove Pool
        </button>
    `;

    fieldset
        .querySelector(".remove-pool")!
        .addEventListener("click", () => {
            fieldset.remove();
        });

    return fieldset;
}