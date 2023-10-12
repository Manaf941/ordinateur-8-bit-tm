
import Runtime from "../../emulator/Runtime.js";
import Instruction from "../Instruction.js";

export default new class MREAD extends Instruction {
    id = 0b01001_000
    name = "MREAD"

    execute(runtime: Runtime, opcode: number){
        const output = this.getOutputRegister(runtime, opcode)
        const h = runtime.getRegister("H")
        const l = runtime.getRegister("L")

        // write input to memory address HL
        output.data = runtime.ram.read(h.data * 2**8 + l.data)
    }
}