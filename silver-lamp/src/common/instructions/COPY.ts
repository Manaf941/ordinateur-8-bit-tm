import Runtime from "../../emulator/Runtime.js";
import Instruction from "../Instruction.js";

export default new class COPY extends Instruction {
    id = 0b11111_000
    name = "COPY"

    execute(runtime: Runtime, opcode: number){
        const output = this.getOutputRegister(runtime, opcode)
        const [
            input1
        ] = this.getInputs(runtime)

        output.data = input1.data
    }
}