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