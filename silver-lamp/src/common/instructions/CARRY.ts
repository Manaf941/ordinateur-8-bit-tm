import Runtime from "../../emulator/Runtime.js";
import Instruction from "../Instruction.js";

export default new class CARRY extends Instruction {
    id = 0b11101_000
    name = "CARRY"

    execute(runtime: Runtime, opcode: number){
        const output = this.getOutputRegister(runtime, opcode)
        runtime.incrementPC() // CARRY doesn't use the next byte

        output.data = runtime.getRegister("FLAGS").carry ? 0xff : 0x00
    }
}