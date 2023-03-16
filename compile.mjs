import * as fs from "fs"
import { join } from "path"

const instructions = {
    NOP: 0x00,

    ADD: 0x01,
    SUB: 0x02,

    LTEQ: 0x10,
    GTEQ: 0x11,
    LT: 0x12,
    GT: 0x13,
    EQ: 0x14,

    AND: 0x20,
    OR: 0x21,
    XOR: 0x22,
    NOT: 0x23,

    PC: 0x30,
    CARRY: 0x31,

    JUMP: 0x40,
    JUMPI: 0x41,
    JUMPZ: 0X42,



    LDA: 0x60,
    LDB: 0x61,
    LDC: 0x62
}

const OUTPUT_LEN = 2**16 // 64kb

const labelset = new Set()
const filename = join(new URL(import.meta.url).pathname, "../code.txt")
const code = fs.readFileSync(filename, "utf8")
    .split(/[\n]/g)
    .map((line, i) => {
        if(!line)return
        line = line.replace(/#+$/g, "").trim() // remove comments

        let [instruction, ...args] = line.split(/ +/)
        instruction = instruction.toUpperCase()

        switch(instruction){
            case "LABEL": {
                if(args.length !== 1){
                    throw new Error(`${filename}:${i+1} (args.length !== 1) for ${instruction}`)
                }
                const label = args[0]
                if(!label){
                    throw new Error(`${filename}:${i+1} Invalid label name`)
                }
                if(labelset.has(label)){
                    throw new Error(`${filename}:${i+1} Duplicate label name`)
                }
                labelset.add(label)
                return {
                    type: "label",
                    name: label,
                    line_number: i+1
                }
            }
            case "JUMP":
            case "JUMPI":
            case "JUMPZ": {
                if(args.length !== 1){
                    throw new Error(`${filename}:${i+1} (args.length !== 1) for ${instruction}`)
                }
                const label = args[0]
                if(!label){
                    throw new Error(`${filename}:${i+1} Invalid label name`)
                }

                return {
                    type: "jump",
                    name: label,
                    line_number: i+1,
                    ops: [
                        instructions[instruction]
                    ]
                }
            }
            case "LDA":
            case "LDB":
            case "LDC": {
                if(args.length !== 1){
                    throw new Error(`${filename}:${i+1} (args.length !== 1) for ${instruction}`)
                }
                const data = args[0].toLowerCase()
                if(!/^[abcdef\d]{2}$/.test(data)){
                    throw new Error(`${filename}:${i+1} Invalid hexadecimal: ${JSON.stringify(data)} for ${instruction}`)
                }

                return {
                    type: "instruction",
                    ops: [
                        instructions[instruction],
                        parseInt(data, 16)
                    ],
                    line_number: i+1
                }
            }
            default: {
                if(!(instruction in instructions)){
                    throw new Error(`${filename}:${i+1} Instruction "${instruction}" does not exist`)
                }

                if(args.length !== 0){
                    throw new Error(`${filename}:${i+1} (args.length !== 0) for ${instruction}`)
                }

                return {
                    type: "instruction",
                    ops: [
                        instructions[instruction]
                    ],
                    line_number: i+1
                }
            }
        }
    }).filter(line => !!line)

if(!labelset.has("start")){
    throw new Error(`${filename} This file does not have any start label.`)
}
    
const labels = new Map()
let current_label = null
for(const instruction of code){
    switch(instruction.type){
        case "label": {
            current_label = instruction
            labels.set(instruction.name, [])
            break
        }
        default: {
            if(!current_label){
                throw new Error(`${filename}:${instruction.line} Illegal instruction: ${instruction.name}: Not in a label`)
            }
            labels.get(current_label.name).push(instruction)
        }
    }
}

// we're going to strip out unused code
const required_labels = new Set()
const walk = (labelname) => {
    if(required_labels.has(labelname))return
    required_labels.add(labelname)

    for(const instruction of labels.get(labelname)){
        switch(instruction.type){
            case "jump": {
                if(!labelset.has(instruction.name)){
                    throw new Error(`${filename}:${instruction.line_number} Unknown label: ${JSON.stringify(instruction.name)}`)
                }
                walk(instruction.name)
            }
        }
    }
}
walk("start")
for(const label of labels.keys()){
    if(!required_labels.has(label)){
        labels.delete(label)
        console.warn(`Warning: ${filename} has dead code (label "${label}")`)
    }
}

const labels_output = new Map()
for(const label of required_labels){
    console.log(`Log: Assembling ${label}`)
    const output = {
        name: label,
        output: [],
        start: null
    }
    labels_output.set(label, output)

    for(const instruction of labels.get(label)){
        switch(instruction.type){
            case "instruction": {
                output.output.push(...instruction.ops)
                break
            }
            case "jump": {
                output.output.push(
                    instructions.LDB,
                    [instruction.name, 1],
                    instructions.LDC,
                    [instruction.name, 0],
                    ...instruction.ops
                )
            }
        }
    }
}

const output = []
for(const label of required_labels){
    let start = output.length
    output.push(...labels_output.get(label).output)
    labels_output.get(label).start = start
}
for(let i = 0; i < output.length; i++){
    if(Array.isArray(output[i])){
        // jump dest
        const [name, offset] = output[i]
        const dest = labels_output.get(name)
        output[i] = (dest.start << offset * 8) & 0xff
    }
}

if(output.length > OUTPUT_LEN){
    throw new Error(`${filename} Compiled code too large (${output.length} > ${OUTPUT_LEN})`)
}
const output_final = Buffer.alloc(OUTPUT_LEN)
Buffer.from(output).copy(output_final)

fs.writeFileSync(
    "./compiled.txt",
    output_final
)