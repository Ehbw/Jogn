import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Instance from "../index.js";

export function DiscordCommand({slashCommand}: {slashCommand: SlashCommandBuilder}): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const execute = (interaction: ChatInputCommandInteraction) => {
            try{
                descriptor.value(interaction)
            }catch(err: any){
                console.log(err)
            }
        }
        Instance.RegisterCommand(slashCommand, execute)
    }
}