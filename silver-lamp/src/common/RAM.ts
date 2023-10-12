import { formatHex } from "./utils.js"

export default class RAM {
    constructor(debug = false){
        this.debug = debug
    }
    
    debug
    private data = Buffer.alloc(2**(64/8))
    read(address:number){
        address &= 0xffff
        if(this.debug)console.debug(`RAM read at ${formatHex(address, 4)} as ${formatHex(this.data[address])}`)
        return this.data[address]
    }
    write(address:number, data: number){
        address &= 0xffff
        if(this.debug)console.debug(`RAM write to ${formatHex(address, 4)} with ${formatHex(data)}`)
        this.data[address] = data & 0xff
    }
}