// Knows how to create a pool element
export function createPoolElement(): HTMLFieldSetElement {

    const pool = document.createElement("fieldset");

    pool.className = "pool";

    pool.innerHTML = `
        <legend>Pool</legend>

        <label>
            Occurrence
            <input type="number" value="1">
        </label>

        <br><br>

        <label>
            Pool Type
            <select class="pool-type">
                <option>Preset</option>
                <option>Pool</option>
                <option>Module Name</option>
            </select>
        </label>

        <br><br>

        <label>
            <input type="checkbox">
            Distinct
        </label>

        <hr>

        <div class="pool-options"></div>

        <br>

        <button
            class="remove-pool"
            type="button">
            Remove Pool
        </button>
    `;

    const poolType =
        pool.querySelector<HTMLSelectElement>(".pool-type")!;

    const options =
        pool.querySelector<HTMLDivElement>(".pool-options")!;

    poolType.addEventListener("change", () => {

        renderPoolOptions(
            poolType.value,
            options
        );

    });

    pool
        .querySelector<HTMLButtonElement>(".remove-pool")!
        .addEventListener("click", () => {

            pool.remove();

        });

    // Render the initial controls
    renderPoolOptions(poolType.value, options);

    return pool;
}

function renderPoolOptions(
    poolType: string,
    container: HTMLDivElement
): void {

    container.innerHTML = "";

    switch (poolType) {

        case "Preset":
            renderPresetOptions(container);
            break;

        case "Module Name":
            renderModuleNameOptions(container);
            break;

        case "Pool":
            renderPoolEntries(container);
            break;
    }
}

function renderPresetOptions(
    container: HTMLDivElement
): void {

    container.innerHTML = `
        <label>
            Preset
            <select>
                <option>All Solvable</option>
                <option>All Needy</option>
                <option>All Vanilla</option>
                <option>All Mods</option>
                <option>All Vanilla Needy</option>
                <option>All Mods Needy</option>
                <option>Profile</option>
                <option>Needy Profile</option>
            </select>
        </label>
    `;
}

function renderModuleNameOptions(
    container: HTMLDivElement
): void {

    container.innerHTML = `
        <label>
            Module Name
            <input type="text">
        </label>
    `;
}

function renderPoolEntries(
    container: HTMLDivElement
): void {

    container.innerHTML = `
        <div class="entry-list"></div>

        <br>

        <button
            class="add-entry"
            type="button">
            Add Module Entry
        </button>
    `;

    const entryList =
        container.querySelector<HTMLDivElement>(".entry-list")!;

    const addButton =
        container.querySelector<HTMLButtonElement>(".add-entry")!;

    addButton.addEventListener("click", () => {

        entryList.appendChild(
            createModuleEntryElement()
        );

    });

    // Every Pool starts with one entry
    entryList.appendChild(
        createModuleEntryElement()
    );
}

function createModuleEntryElement(): HTMLDivElement {

    const entry = document.createElement("div");

    entry.className = "module-entry";

    entry.innerHTML = `
        <label>
            Percentage
            <input
                type="number"
                min="1"
                max="100"
                value="100">
        </label>

        <label>
            Module Name
            <input type="text">
        </label>

        <button
            class="remove-entry"
            type="button">
            Remove
        </button>

        <br><br>
    `;

    entry
        .querySelector<HTMLButtonElement>(".remove-entry")!
        .addEventListener("click", () => {

            entry.remove();

        });

    return entry;
}