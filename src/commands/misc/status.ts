import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../decorator/command.decorator.js";
import * as superagent from 'superagent';

type ServerStatus = {
    players: {
        online: number,
        max: number,
        list: string[]
    }
}

let agent = superagent.agent()

class Minecast {
    @DiscordCommand({
        slashCommand:
        new SlashCommandBuilder()
        .setName("status")
        .setDescription("Gets status of MC server")
    })
    async GetStatus(interaction: ChatInputCommandInteraction){
        agent.get("https://api.mcsrvstat.us/2/mc.ehbw.uk").then((res) => {
            let data = JSON.parse(res.text) as ServerStatus
            const embed = new EmbedBuilder().setTitle("Minecraft Server")
            .setTimestamp()
            .setFields({
                name: "Server",
                value: `> ${data.players.online}/${data.players.max} online\n> Players: ${data.players.list.concat(" ")}`
            })

            interaction.reply({embeds: [embed]})
        })
    }
}

const mc: Minecast = new Minecast()
export default Minecast