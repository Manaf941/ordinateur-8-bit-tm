import { MAX_CODE_SIZE } from "../common/constants.js"
import ADD from "../common/instructions/ADD.js";
import AND from "../common/instructions/AND.js";
import CARRY from "../common/instructions/CARRY.js";
import COPY from "../common/instructions/COPY.js";
import EQ from "../common/instructions/EQ.js";
import GT from "../common/instructions/GT.js";
import GTEQ from "../common/instructions/GTEQ.js";
import JUMP from "../common/instructions/JUMP.js";
import JUMPC from "../common/instructions/JUMPC.js";
import JUMPI from "../common/instructions/JUMPI.js";
import JUMPZ from "../common/instructions/JUMPZ.js";
import LDX from "../common/instructions/LDX.js";
import LT from "../common/instructions/LT.js";
import LTEQ from "../common/instructions/LTEQ.js";
import MREAD from "../common/instructions/MREAD.js";
import MWRITE from "../common/instructions/MWRITE.js";
import NOP from "../common/instructions/NOP.js";
import NOT from "../common/instructions/NOT.js";
import OR from "../common/instructions/OR.js";
import SUB from "../common/instructions/SUB.js";
import XOR from "../common/instructions/XOR.js";
import { encodeRegistersIds, resolveRegisterId } from "../common/utils.js"

export interface Line {
    ops: number[],
    line_number: number
}
export interface Tag extends Line {
    name: string,
    type: "tag"
}
export interface PC extends Line {
    type: "pc"
}
export interface Jump extends Line {
    name: string,
    type: "jump"
}
export interface Instruction extends Line {
    type: "instruction"
}
export type ParsedLine = Tag | Jump | Instruction | PC

export function parse(code:string):[ParsedLine[], Set<string>, string[]]{
    const lines = code.split("\n")
    .map(line => line.trim())
    
    const errors:string[] = []
    const tagset = new Set<string>()
    const parsed = lines.map((line, i) => {
        line = line.replace(/#.+$/, "").trim() // remove comments
        if(!line)return // remove empty lines

        // eslint-disable-next-line prefer-const
        let [instruction, ...args] = line.split(/\s+/)
        instruction = instruction.toUpperCase()

        switch(instruction.toLowerCase()){
            case "tag": {
                // code tag; lets you jump to this line
                if(args.length !== 1){
                    errors.push(`:${i+1} (args.length !== 1) for ${instruction}`)
                    return
                }
                const tag = args[0]
                if(!tag){
                    errors.push(`:${i+1} Invalid tag name`)
                    return
                }
                if(tag === "START"){
                    errors.push(`:${i+1} Tag name "START" is reserved`)
                    return
                }
                if(tagset.has(tag)){
                    errors.push(`:${i+1} Duplicate tag name`)
                    return
                }
                tagset.add(tag)
                return {
                    type: "tag",
                    name: tag,
                    line_number: i+1,
                    ops: []
                } as ParsedLine
            }
            case "jump":
            case "jumpc": {
                if(args.length !== 1){
                    errors.push(`:${i+1} (args.length !== 1) for ${instruction}`)
                    return
                }
                const tag = args[0]
                if(!tag){
                    errors.push(`:${i+1} Invalid tag name`)
                    return
                }

                return {
                    type: "jump",
                    name: tag,
                    line_number: i+1,
                    ops: [
                        ({
                            jump: JUMP.id,
                            jumpc: JUMPC.id
                        })[instruction.toLowerCase()]
                    ]
                } as ParsedLine
            }
            case "jumpi":
            case "jumpz": {
                if(args.length !== 2){
                    errors.push(`:${i+1} (args.length !== 2) for ${instruction}`)
                    return
                }
                const reg = resolveRegisterId(args[0])
                if(reg === undefined){
                    errors.push(`:${i+1} Invalid register name: ${args[0]}`)
                    return
                }
                const tag = args[1]
                if(!tag){
                    errors.push(`:${i+1} Invalid tag name`)
                    return
                }

                return {
                    type: "jump",
                    name: tag,
                    line_number: i+1,
                    ops: [
                        ({
                            jumpi: JUMPI.id,
                            jumpz: JUMPZ.id
                        })[instruction.toLowerCase()]! | reg
                    ]
                } as ParsedLine
            }
            case "pc": {
                if(args.length !== 0){
                    errors.push(`:${i+1} (args.length !== 0) for ${instruction}`)
                    return
                }
                return {
                    type: "pc",
                    line_number: i+1,
                    ops: []
                } as ParsedLine
            }
            case "mread": 
            case "mwrite": {
                if(args.length !== 1){
                    errors.push(`:${i+1} (args.length !== 1) for ${instruction}`)
                    return
                }
                const reg = resolveRegisterId(args[0])
                if(reg === undefined){
                    errors.push(`:${i+1} Invalid register name: ${args[0]}`)
                    return
                }
                return {
                    type: "instruction",
                    line_number: i+1,
                    ops: [
                        ({
                            mread: MREAD.id,
                            mwrite: MWRITE.id
                        })[instruction.toLowerCase()]! | reg
                    ]
                } as ParsedLine
            }
            case "nop": {
                if(args.length !== 0){
                    errors.push(`:${i+1} (args.length !== 0) for ${instruction}`)
                    return
                }
                return {
                    type: "instruction",
                    line_number: i+1,
                    ops: [NOP.id]
                } as ParsedLine
            }
        }

        // this is an instruction, such as `a = b + c`
        const match = line.match(/^\s*(\w)\s*=\s*(.+)$/)
        if(!match){
            errors.push(`:${i+1} Invalid instruction`)
            return
        }
        const dest = match[1].trim()
        const src = match[2].trim()

        const destId = resolveRegisterId(dest)
        if(destId === undefined){
            errors.push(`:${i+1} Invalid destination register`)
            return
        }

        const parseTwoRegisters = (match:string[]) => {
            const a = resolveRegisterId(match[0])
            const b = resolveRegisterId(match[1])
            if(a === undefined){
                errors.push(`:${i+1} Invalid source register: ${match[1]}`)
            }
            if(b === undefined){
                errors.push(`:${i+1} Invalid source register: ${match[2]}`)
            }
            if(a === undefined || b === undefined){
                return
            }

            return encodeRegistersIds(a, b)
        }

        for(const [regex, parse] of [
            [/^(\w)\s*(\+|-|<=|>=|<|>|==|&|\||\^)\s*(\w)$/, (match:string[]) => {
                const sources = parseTwoRegisters([
                    match[1], match[3]
                ])
                if(sources === undefined)return
 
                return [
                    ({
                        "+": ADD.id,
                        "-": SUB.id,
                        "<": LT.id,
                        "<=": LTEQ.id,
                        ">": GT.id,
                        ">=": GTEQ.id,
                        "==": EQ.id,
                        "&": AND.id,
                        "|": OR.id,
                        "^": XOR.id
                    })[match[2]]! | destId,
                    sources
                ]
            }],
            [/^(\d{1,3}|0x[a-f\d]{1,2}|0b[01]{1,8})$/i, () => {
                const num = Number(src)
                if(isNaN(num) || num < 0 || num > 255){
                    errors.push(`:${i+1} Invalid number; must be between 0 and 255 inclusive`)
                    return
                }
                return [
                    LDX.id | destId,
                    num
                ]
            }],
            [/^(true|false)$/, () => {
                return [
                    LDX.id | destId,
                    src == "true" ? 0xff : 0x00
                ]
            }],
            [/^(\w)$/, (match:string[]) => {
                const sources = parseTwoRegisters([
                    match[1],
                    // in this case, this register isn't being used
                    // by this instruction. a is 000 so it's hardcoded
                    "a"
                ])
                if(sources === undefined)return
 
                return [
                    COPY.id | destId,
                    sources
                ]
            }],
            [/^CARRY$/i, () => {
                return [
                    CARRY.id | destId,
                    // because of an optimization
                    // on the circuit, it needs to have this extra empty byte
                    0
                ]
            }],
            [/^~(\w)$/, (match:string[]) => {
                const sources = parseTwoRegisters([
                    match[1],
                    // in this case, this register isn't being used
                    // by this instruction. a is 000 so it's hardcoded
                    "a"
                ])
                if(sources === undefined)return
 
                return [
                    NOT.id | destId,
                    sources
                ]
            }],
            [/^-(\d{1,3}|0x[a-f\d]{1,2}|0b[01]{1,8})$/i, () => {
                errors.push(`:${i+1} Negative numbers are not supported`)
                return
            }],
        ] as [RegExp, (match:string[]) => number[]][]){
            const match = src.match(regex)
            if(match){
                return {
                    type: "instruction",
                    line_number: i+1,
                    ops: parse(match)
                } as ParsedLine
            }
        }

        errors.push(`:${i+1} Invalid syntax/instruction: ${line}`)

        return undefined
    }).filter(line => line !== undefined) as ParsedLine[]

    return [
        parsed,
        tagset,
        errors
    ]
}

export function verifyJumps(parsed: ParsedLine[], tagset: Set<string>, errors: string[]){
    for(const line of parsed){
        if(line.type === "jump"){
            if(!tagset.has(line.name!)){
                errors.push(`:${line.line_number} Tag "${line.name}" does not exist`)
            }
        }
    }
}

export function build(parsed: ParsedLine[]){
    const intermediate = []
    const tagreqsmap = new Map<string, number[]>()
    const tagmap = new Map<string, number>([])

    for(const line of parsed){
        switch(line.type){
            case "jump": {
                const i0 = intermediate.length
                intermediate.push(
                    LDX.id + resolveRegisterId("H")!,
                    // this is a placeholder for the tag offset
                    1,
                    LDX.id + resolveRegisterId("L")!,
                    // this is a placeholder for the tag offset
                    0,
                    ...line.ops
                )
                // ensure tagmap has the tag
                tagreqsmap.set(line.name, tagreqsmap.get(line.name) || [])

                tagreqsmap.get(line.name)!.push(i0 + 1)
                tagreqsmap.get(line.name)!.push(i0 + 3)
                break
            }
            case "pc": {
                const i:number = intermediate.length + 2 + line.ops.length
                intermediate.push(
                    LDX.id + resolveRegisterId("H")!,
                    i >> 8,
                    LDX.id + resolveRegisterId("L")!,
                    i & 0xff,
                    ...line.ops
                )
                break
            }
            case "tag": {
                const i0 = intermediate.length
                intermediate.push(...line.ops)
                tagmap.set(line.name, i0)
                break
            }
            case "instruction":
                intermediate.push(...line.ops)
                break
            default:
                throw new Error("Invalid line type: " + (line as ParsedLine).type + ". This is likely a bug in the assembler.")
        }
    }

    for(const [tag, reqs] of tagreqsmap){
        // substract 1, because the computer will increment at the end of the instruction
        const i = (tagmap.get(tag)! - 1) & 0xffff
        for(const req of reqs){
            const offset:number = intermediate[req]
            intermediate[req] = (i! << offset * 8) & 0xff
        }
    }

    return intermediate
}

export function toBuffer(intermediate: number[]){
    const buffer = Buffer.alloc(MAX_CODE_SIZE)

    Buffer.from(intermediate).copy(buffer)

    return buffer
}