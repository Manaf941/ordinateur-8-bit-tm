import Runtime from "../../emulator/Runtime.js";
import Instruction from "../Instruction.js";

export default new class JUMPZ extends Instruction {
    id = 0b00110_000
    name = "JUMPZ"

    execute(runtime: Runtime, opcode: number){
        const condition = this.getOutputRegister(runtime, opcode)
        if(condition.data !== 0x00)return // condition not fulfilled
        const h = runtime.getRegister("H")
        const l = runtime.getRegister("L")

        runtime.pc = h.data * 2**8 + l.data
    }
}