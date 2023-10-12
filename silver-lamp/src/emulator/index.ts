#!/usr/bin/env node
import "modernlog/patch.js"
import { readFile } from "fs/promises"
import { MAX_CODE_SIZE } from "../common/constants.js"
import RuntimeError from "../common/errors/RuntimeError.js"
import { formatHex, parseArgv } from "../common/utils.js"
import Runtime from "./Runtime.js"

(async () => {
    const args:{
        file?: string,
        debug?: boolean
    } = parseArgv(process.argv.slice(2), new Set([

    ]))
    
    if(!args.file){
        console.error("No file specified")
        process.exit(1)
    }

    const code = Buffer.alloc(MAX_CODE_SIZE)
    const buffer = await readFile(args.file)
    if(buffer.length > MAX_CODE_SIZE){
        console.error(`File length ${buffer.length} exceeds maximum of ${MAX_CODE_SIZE} bytes`)
        process.exit(1)
    }
    buffer.copy(code)
    
    const runtime = new Runtime(code, {
        debug: args.debug
    })
    try{
        await runtime.run()
    }catch(err){
        if(err instanceof RuntimeError){
            console.error(err.message)
            process.exit(1)
        }else{
            throw err
        }
    }

    console.log(`Runtime finished at ${formatHex((runtime.pc-1)&0xffff, 4)}`)
    console.log(runtime.registers.map(r => `${r.name}: ${formatHex(r.data)}`).join(" "))
})()