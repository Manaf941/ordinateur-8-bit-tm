import Instruction from "./Instruction.js";
import ADD from "./instructions/ADD.js";
import AND from "./instructions/AND.js";
import CARRY from "./instructions/CARRY.js";
import COPY from "./instructions/COPY.js";
import EQ from "./instructions/EQ.js";
import GT from "./instructions/GT.js";
import GTEQ from "./instructions/GTEQ.js";
import JUMP from "./instructions/JUMP.js";
import JUMPC from "./instructions/JUMPC.js";
import JUMPI from "./instructions/JUMPI.js";
import JUMPZ from "./instructions/JUMPZ.js";
import LDX from "./instructions/LDX.js";
import LT from "./instructions/LT.js";
import LTEQ from "./instructions/LTEQ.js";
import MREAD from "./instructions/MREAD.js";
import MWRITE from "./instructions/MWRITE.js";
import NOP from "./instructions/NOP.js";
import NOT from "./instructions/NOT.js";
import OR from "./instructions/OR.js";
import SUB from "./instructions/SUB.js";
import XOR from "./instructions/XOR.js";

const instructions = new Map<number|string, Instruction>([
    [NOP.id, NOP],
    [ADD.id, ADD],
    [SUB.id, SUB],
    [LTEQ.id, LTEQ],
    [GTEQ.id, GTEQ],
    [LT.id, LT],
    [GT.id, GT],
    [EQ.id, EQ],
    [AND.id, AND],
    [OR.id, OR],
    [XOR.id, XOR],
    [NOT.id, NOT],
    [LDX.id, LDX],
    [CARRY.id, CARRY],
    [COPY.id, COPY],
    [JUMP.id, JUMP],
    [JUMPI.id, JUMPI],
    [JUMPZ.id, JUMPZ],
    [JUMPC.id, JUMPC],
    [MWRITE.id, MWRITE],
    [MREAD.id, MREAD],
])
export default instructions

for(const [, instruction] of instructions.entries()){
    instructions.set(instruction.name, instruction)
}