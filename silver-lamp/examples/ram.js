import "modernlog/patch.js"
import { readFile } from "fs/promises"
import Runtime from "../dist/emulator/Runtime.js"
import assert from "assert"

const code = await readFile(new URL("./ram.slb", import.meta.url))
const runtime = new Runtime(code, {
    debug: true
})

const a = runtime.getRegister("A")
const b = runtime.getRegister("B")
const ram = runtime.ram
const h = runtime.getRegister("H")
const l = runtime.getRegister("L")

await runtime.run()
assert(a.data === b.data, `Expected a == b, but got a == ${a.data} and b == ${b.data}`)


await runtime.run()
const address = h.data*256 + l.data
assert(ram.read(address) === a.data, `Expected ram[0x${address.toString(16).padStart(4, "0")}] == a, but got ram[0x${address.toString(16).padStart(4, "0")}] == ${ram.read(address)} and a == ${a.data}`)

