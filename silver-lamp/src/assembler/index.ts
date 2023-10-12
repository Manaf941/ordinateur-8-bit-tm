#!/usr/bin/env node
import * as modernlog from "modernlog"
modernlog.patch()
import { readFile, writeFile } from "fs/promises"
import { parseArgv, resolvePath } from "../common/utils.js"
import { build, parse, toBuffer, verifyJumps } from "./assembler.js"

process.on("beforeExit", () => {
    modernlog.unpatch()
})

const args:{
    file?: string,
    output?: string,
    hex?: boolean
} = parseArgv(process.argv.slice(2), new Set([
    "--output"
]))

if(!args.file){
    console.error("No input specified")
    process.exit(1)
}

const filename = resolvePath(args.file)
const code = await readFile(filename, "utf8")

const [parsed, tagset, errors] = parse(code)

verifyJumps(parsed, tagset, errors)

if(errors.length){
    for(const error of errors){
        console.error(filename + error)
    }
    process.exit(1)
}

const intermediate = build(parsed)
const output = toBuffer(intermediate)

if(!args.output){
    args.output = filename.replace(/\.sl$/g, ".slb")
    if(args.output === filename || !args.output.endsWith(".slb")){
        args.output += ".slb"
    }
}

const output_filename = resolvePath(args.output)
await writeFile(output_filename, output)

if(args.hex){
    await writeFile(output_filename + ".hex", output.toString("hex"))
}