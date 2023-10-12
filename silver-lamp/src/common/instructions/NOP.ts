import Instruction from "../Instruction.js";

export default new class NOP extends Instruction {
    id = 0b00000_000
    name = "NOP"
}