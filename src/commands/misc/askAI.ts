import { ChatGPTAPI } from "chatgpt";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../decorator/command.decorator.js";
import Instance from "../../index.js";

class AskAI{
    @DiscordCommand({
        slashCommand: new SlashCommandBuilder()
        .setName("askai")
        .addStringOption(option => 
            option.setName("question")
            .setRequired(true)
            .setDescription("The question to ask")
            
        ).setDescription("Ask ChatGPT a question")
    })
    async GetTasks(interaction: ChatInputCommandInteraction){
        await interaction.reply("Sending API request, this may take some time")
        let totalRequests = 0
        let data = interaction.options.get("question", true)
        if(data.value?.toString()){
            try{
                const response = await Instance.gpt.sendMessage(data.value.toString(), {
                    //TODO: this isn't really that great
                    onProgress(partialResponse) {
                        totalRequests++
                        if(totalRequests % 5 === 0){
                            interaction.editReply(partialResponse)
                        }
                    },
                    timeoutMs: 2 * 60 * 1000
                })
                await interaction.editReply(response)                    
            }catch(err: any | ChatGPTAPI){
                if(typeof(err) === typeof(ChatGPTAPI)){
                    console.log("Error with ChatGPT")
                    await interaction.editReply("Unable to answer, API failed to respond")
                }
            }
        }
    }
}

const askAI: AskAI = new AskAI()
export default askAI