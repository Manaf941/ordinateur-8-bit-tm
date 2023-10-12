// typed EventEmitter class

import { EventEmitter as EE } from "events"

type Listener = (...args: any[]) => void

export class EventEmitter <events extends {
    [key: string]: any[]
}> extends EE {
    on<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.on(event, listener as Listener)
    }
    once<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.once(event, listener as Listener)
    }
    off<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.off(event, listener as Listener)
    }
    removeListener<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.removeListener(event, listener as Listener)
    }
    removeAllListeners<key extends keyof events>(event:Exclude<key, number>){
        return super.removeAllListeners(event)
    }
    rawListeners<key extends keyof events>(event:Exclude<key, number>):((...args:events[key]) => void)[]{
        return super.rawListeners(event) as any
    }
    addListener<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.addListener(event, listener as Listener)
    }
    listenerCount<key extends keyof events>(event:Exclude<key, number>){
        return super.listenerCount(event)
    }
    emit<key extends keyof events>(event:Exclude<key, number>, ...args:events[key]){
        return super.emit(event, ...args)
    }
    eventNames():Exclude<keyof events, number>[]{
        return super.eventNames() as any
    }
    listeners<key extends keyof events>(event:Exclude<key, number>):((...args:events[key]) => void)[]{
        return super.listeners(event) as any
    }
    prependListener<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.prependListener(event, listener as Listener)
    }
    prependOnceListener<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.prependOnceListener(event, listener as Listener)
    }
}