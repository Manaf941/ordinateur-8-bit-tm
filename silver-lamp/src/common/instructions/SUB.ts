import Runtime from "../../emulator/Runtime.js";
import Instruction from "../Instruction.js";

export default new class SUB extends Instruction {
    id = 0b10001_000
    name = "SUB"

    execute(runtime: Runtime, opcode: number){
        const output = this.getOutputRegister(runtime, opcode)
        const [
            input1,
            input2
        ] = this.getInputs(runtime)

        runtime.getRegister("FLAGS").carry = input1.data - input2.data < 0
        output.data = input1.data - input2.data
    }
}