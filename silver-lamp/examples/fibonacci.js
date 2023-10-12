const terms = 12
function fibonacci(n){
    if(n <= 1) return n
    return fibonacci(n - 1) + fibonacci(n - 2)
}

import "modernlog/patch.js"
import { readFile } from "fs/promises"
import Runtime from "../dist/emulator/Runtime.js"

const code = await readFile(new URL("./fibonacci.slb", import.meta.url))
const runtime = new Runtime(code, {
    debug: true
})

const timeout = setTimeout(() => {
    console.error("Code timed out")
    runtime.stop()
    process.exit(1)
}, 1000)

await runtime.run()
clearTimeout(timeout)

const a = runtime.getRegister("A")
const b = runtime.getRegister("B")
const _a = fibonacci(terms)
const _b = fibonacci(terms + 1)
if(a.data !== _a){
    console.error(`Expected a == ${_a} but got a == ${a.data}`)
    process.exit(1)
}
if(b.data !== _b){
    console.error(`Expected b == ${_b} but got b == ${b.data}`)
    process.exit(1)
}
    
console.log(`a == ${a.data}`)
console.log(`b == ${b.data}`)
