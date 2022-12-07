import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Instance from "..";
import { DiscordCommand } from "../decorator/command.decorator";

class SetNotifications{
    @DiscordCommand({
        slashCommand: new SlashCommandBuilder()
        .setName("setnotification")
        .addChannelOption(option => 
            option.setName("channel")
            .setRequired(true)
            .setDescription("Channel to recieve notification")
            .addChannelTypes(ChannelType.GuildText)
        ).setDescription("Sets a channel to recieve FireFly notifications")
    })
    async setChannel(interaction: ChatInputCommandInteraction){
        let data = interaction.options.get("channel", true)
        if(data && data.value){
            Instance.db.put(`${interaction.guildId}-notification`, data.value.toString(), function(err){
                if(!err){
                    interaction.reply("Updated configuration")
                }
            })
        }
        console.log(interaction.options.get("channel", true))
    }
}

const setNotification: SetNotifications = new SetNotifications()
export default setNotification