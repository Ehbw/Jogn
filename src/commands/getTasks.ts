import { APIEmbedField, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../decorator/command.decorator";
import { FireflyEndpoints, Task } from "../firefly/firefly.req";
import { Pagination } from "../utils/pagination";
import FireFly from "../firefly/firefly.main";
import config from "../../config.json";

class GetTasks{
    @DiscordCommand({
        slashCommand: new SlashCommandBuilder()
        .setName("tasks")
        .setDescription("Retrives the latest history tasks set on FireFly")
    })
    async GetTasks(interaction: ChatInputCommandInteraction){
        if(FireFly.Tasks){
            const embed = new EmbedBuilder().setTitle("Recent Tasks")
            .setTimestamp()
            let data: APIEmbedField[] = []
            FireFly.Tasks.items.forEach((task: Task) => {
                let dueDate = new Date(task.dueDate)
                dueDate.setHours(12, 0, 0, 0)
                data.push(
                    {name: task.title, value: `> Set By: ${task.setter.name} \n> Due: <t:${dueDate.getTime() / 1000}:R>\n> [Details](${config.firefly.url}${FireflyEndpoints.SETTASKS}/${task.id})`}
                )
            })

            Pagination(interaction, embed, data, [
                new ButtonBuilder().setCustomId("back").setLabel("Back").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("next").setLabel("Next").setStyle(ButtonStyle.Secondary)
            ])
        }
    }
}

const getTasks: GetTasks = new GetTasks()
export default getTasks