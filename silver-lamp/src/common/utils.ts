import { homedir } from "os"
import { join, resolve } from "path"
import Register from "./Register.js"

export function wait(ms:number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function parseArgv(argv: string[], stringArgvs: Set<string>): { [key: string]: string|boolean } {
    const args: { [key: string]: string|boolean } = {}

    let previousKey = ""
    for(let i = 0; i < argv.length; i++){
        const arg = argv[i]
        if(arg.startsWith("--")){
            if(previousKey){
                console.error(`Expected value for ${previousKey}, found ${arg}`)
                process.exit(1)
            }
            if(stringArgvs.has(arg)){
                previousKey = arg.slice(2)
            }else{
                args[arg.slice(2)] = true
            }
        }else if(previousKey){
            args[previousKey] = arg
            previousKey = ""
        }else if(!args.file){
            args.file = arg
        }else{
            console.error(`Expected file, found ${arg}`)
            process.exit(1)
        }
    }

    return args
}

export function resolvePath(path: string): string {
    if(path[0] === "~"){
        return join(homedir(), path.slice(1))
    }
    return resolve(path)
}

export function formatHex(value: number, length = 2): string {
    return `0x${value.toString(16).padStart(length, "0")}`
}

export function makeRegisters(debug:boolean){
    return [
        new Register(0, "A", debug),
        new Register(1, "B", debug),
        new Register(2, "C", debug),
        new Register(3, "D", debug),
        new Register(4, "E", debug),
        new Register(5, "F", debug),
        new Register(6, "H", debug),
        new Register(7, "L", debug)
    ]
}
export function resolveRegisterId(name:string|undefined){
    name = name?.toUpperCase()
    switch(name){
        case "A": return 0
        case "B": return 1
        case "C": return 2
        case "D": return 3
        case "E": return 4
        case "F": return 5
        case "H": return 6
        case "L": return 7
    }
    return undefined
}

export function encodeRegistersIds(a:number, b:number){
    if(a > 7 || b > 7){
        throw new Error("Invalid register id")
    }
    return (a << 3) | b
}