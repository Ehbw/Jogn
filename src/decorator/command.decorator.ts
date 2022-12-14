import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Instance from "../index.js";
import logger from "../utils/logger.js";

export function DiscordCommand({slashCommand}: {slashCommand: SlashCommandBuilder}): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const execute = (interaction: ChatInputCommandInteraction) => {
            try{
                descriptor.value(interaction)
            }catch(err: any){
                logger.error(err)
            }
        }
        Instance.RegisterCommand(slashCommand, execute)
    }
}