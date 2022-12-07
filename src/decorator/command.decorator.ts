import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Instance from "..";

export function DiscordCommand({slashCommand}: {slashCommand: SlashCommandBuilder}): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const execute = (interaction: ChatInputCommandInteraction) => {
            descriptor.value(interaction)
        }
        Instance.RegisterCommand(slashCommand, execute)
    }
}