import Runtime from "../../emulator/Runtime.js";
import Instruction from "../Instruction.js";

export default new class JUMP extends Instruction {
    id = 0b00100_000
    name = "JUMP"

    execute(runtime: Runtime){
        const h = runtime.getRegister("H")
        const l = runtime.getRegister("L")

        runtime.pc = h.data * 2**8 + l.data
    }
}