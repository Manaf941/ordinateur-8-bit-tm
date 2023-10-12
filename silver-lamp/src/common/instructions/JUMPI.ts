import Runtime from "../../emulator/Runtime.js";
import Instruction from "../Instruction.js";

export default new class JUMPI extends Instruction {
    id = 0b00101_000
    name = "JUMPI"

    execute(runtime: Runtime, opcode: number){
        const condition = this.getOutputRegister(runtime, opcode)
        if(condition.data !== 0xff)return // condition not fulfilled
        const h = runtime.getRegister("H")
        const l = runtime.getRegister("L")

        runtime.pc = h.data * 2**8 + l.data
    }
}