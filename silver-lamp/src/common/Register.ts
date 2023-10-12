import { formatHex } from "./utils.js"

export default class Register {
    constructor(id: number, name: string, debug = false){
        this.id = id
        this.name = name
        this.debug = debug
    }
    
    id: number
    name: string
    debug: boolean
    private _data = 0
    get data(){
        if(this.debug)console.debug(`Register ${this.name} read as ${formatHex(this._data)}`)
        return this._data
    }
    set data(data: number){
        if(this.debug)console.debug(`Register ${this.name} write to ${formatHex(data)}`)
        this._data = data & 0xff
    }
}

export class FlagsRegister extends Register {
    get flags(){
        return {
            carry: this.carry
        }
    }

    get carry(){
        return !!(this.data & 0b0000_0001 >> 0)
    }

    set carry(carry: boolean){
        this.data = (this.data & 0b1111_1110) | (carry ? 1 : 0)
    }
}