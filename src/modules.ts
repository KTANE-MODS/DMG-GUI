import { ModuleInfo } from "./types";


let modules: ModuleInfo[] = [];
const modulesByName = new Map<string, ModuleInfo>()

export async function loadModules(): Promise<void> {
    const response = await fetch("https://ktane.timwi.de/json/raw");

    if (!response.ok) {
        throw new Error("Failed to load modules.");
    }

    let json = await response.json();
    modules = json["KtaneModules"]

    for(let module of modules) {
        modulesByName.set(module.Name, module)
    }

    createModuleDatalist();
}

function createModuleDatalist(): void {
    // todo add a safe guard in case something wrong happens with the json 

    const datalist = document.createElement("datalist");
    datalist.id = "module-list";
    for (const module of modules) {

        const option = document.createElement("option");

        option.value = module.Name;

        datalist.appendChild(option);
    }

    document.body.appendChild(datalist);
}


export function getModules(): readonly ModuleInfo[] {
    return modules;
}