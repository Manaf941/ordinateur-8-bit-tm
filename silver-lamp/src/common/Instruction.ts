import Runtime from "../emulator/Runtime.js"
import { formatHex } from "./utils.js"

export default class Instruction {
    id = 0
    name = "NOP"

    getOutputRegister(runtime: Runtime, opcode: number){
        return runtime.getRegister(opcode & 0b111)
    }
    getInputs(runtime: Runtime){
        runtime.incrementPC()
        const inputs = runtime.code[runtime.pc]
        const input1 = runtime.getRegister((inputs & 0b00_111_000) >> 3)
        const input2 = runtime.getRegister((inputs & 0b00_000_111) >> 0)
        return [input1, input2]
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(runtime: Runtime, opcode: number){
        console.warn(`NOP at ${formatHex(runtime.pc, 4)}`)
    }
}