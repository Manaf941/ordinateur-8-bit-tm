
import Runtime from "../../emulator/Runtime.js";
import Instruction from "../Instruction.js";

export default new class MWRITE extends Instruction {
    id = 0b01000_000
    name = "MWRITE"

    execute(runtime: Runtime, opcode: number){
        const input = this.getOutputRegister(runtime, opcode)
        const h = runtime.getRegister("H")
        const l = runtime.getRegister("L")

        // write input to memory address HL
        runtime.ram.write(h.data * 2**8 + l.data, input.data)
    }
}