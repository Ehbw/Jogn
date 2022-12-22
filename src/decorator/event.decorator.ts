import { Events } from "discord.js";
import Instance from "../index.js";
import logger from "../utils/logger.js";

export function DiscordEvent({event}: {event: Events}): MethodDecorator {
    return function(_: Object, __: string | symbol, descriptor: PropertyDescriptor){
        const execute = (...args:any[]) => {
            try {
                descriptor.value(...args)
            }catch(err: any){
                logger.error(err)
            }
        }
        Instance.RegisterEvent(event, execute)
    }
}