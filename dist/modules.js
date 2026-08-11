let modules = [];
const modulesByName = new Map();
export async function loadModules() {
    const response = await fetch("https://ktane.timwi.de/json/raw");
    if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }
    let json = await response.json();
    modules = json["KtaneModules"];
    modules = modules.filter(mod => ["Needy", "Regular"].includes(mod.Type)).sort((a, b) => a.Name.localeCompare(b.Name));
    for (let module of modules) {
        modulesByName.set(module.Name, module);
    }
    createModuleDatalist();
}
function createModuleDatalist() {
    const datalist = document.createElement("datalist");
    datalist.id = "module-list";
    for (const module of modules) {
        const option = document.createElement("option");
        option.value = module.Name;
        datalist.appendChild(option);
    }
    document.body.appendChild(datalist);
}
export function getModules() {
    return modules;
}
export function getModulesByName() {
    return modulesByName;
}
//# sourceMappingURL=modules.js.map