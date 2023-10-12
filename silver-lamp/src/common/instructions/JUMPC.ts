import Runtime from "../../emulator/Runtime.js";
import Instruction from "../Instruction.js";

export default new class JUMPC extends Instruction {
    id = 0b00111_000
    name = "JUMPC"

    execute(runtime: Runtime){
        const flags = runtime.getRegister("FLAGS")
        if(!flags.carry)return // condition not fulfilled
        const h = runtime.getRegister("H")
        const l = runtime.getRegister("L")

        runtime.pc = h.data * 2**8 + l.data
    }
}