import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../decorator/command.decorator";

class SetRole{
    @DiscordCommand({
        slashCommand: new SlashCommandBuilder().setName("test").setDescription("test")
    })
    async setRole(interaction: ChatInputCommandInteraction){
        await interaction.reply("test")
    }
}

const setRole: SetRole = new SetRole()
export default setRole