export function createPoolElement(): HTMLFieldSetElement {

    const pool = document.createElement("fieldset");

    pool.className = "pool";

    pool.innerHTML = `
        <legend>Pool</legend>

        <label>
            Occurrence
            <input type="number" value="1">
        </label>

        <label>
            Pool Type
            <select class="pool-type">
                <option>Preset</option>
                <option>Pool</option>
                <option>Module Name</option>
            </select>
        </label>

        <label>
            <input type="checkbox">
            Distinct
        </label>

        <hr>

        <div class="pool-options"></div>

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
    .addEventListener("click", () => { pool.remove(); });

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
            <select class="preset-type">
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

        <div class="profile-upload" hidden>
            <label>
                Profile JSON
                <input
                    type="file"
                    accept=".json,application/json">
            </label>
        </div>
    `;

    const presetSelect =
        container.querySelector<HTMLSelectElement>(".preset-type")!;

    const profileUpload =
        container.querySelector<HTMLDivElement>(".profile-upload")!;

    function updateProfileUpload(): void {
        profileUpload.hidden =
            presetSelect.value !== "Profile" &&
            presetSelect.value !== "Needy Profile";
    }

    presetSelect.addEventListener("change", updateProfileUpload);

    // Set the initial visibility.
    updateProfileUpload();
}

function renderModuleNameOptions(
    container: HTMLDivElement
): void {

    container.innerHTML = `
        <label>
            Module Name
            <input type="text" list="module-list">
        </label>
    `;
}

function renderPoolEntries(
    container: HTMLDivElement
): void {

    container.innerHTML = `
        <div class="entry-list"></div>

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
            Weight
            <input
                type="number"
                min="1"
                max="50"
                value="1">
        </label>

        <label>
            Module Name
            <input type="text" list="module-list">
        </label>

        <button
            class="remove-entry"
            type="button">
            Remove
        </button>
    `;

    entry
        .querySelector<HTMLButtonElement>(".remove-entry")!
        .addEventListener("click", () => {

            entry.remove();

        });

    return entry;
}