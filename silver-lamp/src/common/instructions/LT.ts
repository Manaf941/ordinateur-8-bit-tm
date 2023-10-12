import Runtime from "../../emulator/Runtime.js";
import Instruction from "../Instruction.js";

export default new class LT extends Instruction {
    id = 0b10100_000
    name = "LT"

    execute(runtime: Runtime, opcode: number){
        const output = this.getOutputRegister(runtime, opcode)
        const [
            input1,
            input2
        ] = this.getInputs(runtime)

        output.data = input1.data < input2.data ? 0xff : 0x00
    }
}