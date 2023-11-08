import { MAX_CODE_SIZE } from "../common/constants.js";
import { EventEmitter } from "../common/events.js";
import instructions from "../common/instructions.js";
import { formatHex, makeRegisters, wait } from "../common/utils.js";
import Register, { FlagsRegister } from "../common/Register.js";
import NOP from "../common/instructions/NOP.js";
import RAM from "../common/RAM.js";

export interface RuntimeOptions {
    wait: number,
    debug: boolean
}
export default class Runtime extends EventEmitter<{
    beforePc: [],
    afterPc: [],
}> {
    constructor(code:Buffer, options: Partial<RuntimeOptions> = {}){
        super()
        if(code.length > MAX_CODE_SIZE)throw new Error(`Code too large; ${code.length} > ${MAX_CODE_SIZE}`)
        this.code = code
        this.options = Runtime.ensureOptions(options)
        this.registers = [
            ...makeRegisters(this.options.debug),
            new FlagsRegister(8, "FLAGS", this.options.debug)
        ]
        this.ram = new RAM(this.options.debug)
    }

    static ensureOptions(options: Partial<RuntimeOptions>):RuntimeOptions{
        if(options.wait !== undefined && typeof options.wait !== "number"){
            throw new Error("Invalid wait option")
        }
        if(options.wait === undefined)options.wait = 0

        if(options.debug !== undefined && typeof options.debug !== "boolean"){
            throw new Error("Invalid debug option")
        }
        if(options.debug === undefined)options.debug = false

        return options as RuntimeOptions
    }

    options: RuntimeOptions
    registers: Register[]
    ram: RAM
    getRegister(id: number):Register
    getRegister(name: "FLAGS"|8):FlagsRegister
    getRegister(name: string):Register
    getRegister(idOrName: number | string):Register|undefined{
        if(typeof idOrName === "number"){
            return this.registers[idOrName]
        }else{
            return this.registers.find(r => r.name === idOrName)
        }
    }

    pc = 0
    code: Buffer

    incrementPC(){
        this.pc = ++this.pc & 0xffff
    }
    decreasePc(){
        this.pc = --this.pc & 0xffff
    }
    getByte(){
        return this.code[this.pc]
    }

    reset() {
        this.pc = 0
        this.ram.reset()
        for(const register of this.registers){
            register.data = 0
        }
    }
    
    async step(){
        this.emit("beforePc")

        const opcode = this.getByte()

        let instruction = instructions.get(opcode & 0b11111_000)
        if(instruction){
            if(this.options.debug)console.info(`Executing ${instruction.name} at ${formatHex(this.pc, 4)}`)
    
            instruction.execute?.(this, opcode)
        }else{
            if(this.options.debug)console.warn(`Invalid opcode ${opcode}; Acting as NOP, at ${formatHex(this.pc, 4)}`)
            instruction = NOP
        }

        this.incrementPC()
        this.emit("afterPc")
        return instruction
    }

    async run(){
        // eslint-disable-next-line no-constant-condition
        while(true){
            const instruction = await this.step()
            if(instruction.name === "NOP")break

            if(this.options.wait)await wait(this.options.wait)
        }
    }
}