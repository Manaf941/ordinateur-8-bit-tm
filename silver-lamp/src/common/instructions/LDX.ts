import Runtime from "../../emulator/Runtime.js";
import Instruction from "../Instruction.js";

export default new class LDX extends Instruction {
    id = 0b11011_000
    name = "LDX"

    execute(runtime: Runtime, opcode: number){
        const output = this.getOutputRegister(runtime, opcode)
        runtime.incrementPC()

        output.data = runtime.getByte()
    }
}