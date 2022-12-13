import { ActionRowBuilder, APIButtonComponentWithCustomId, APIEmbedField, ButtonBuilder, ButtonInteraction, ChatInputCommandInteraction, CollectorFilter, EmbedBuilder } from "discord.js";

export async function Pagination(
    interaction: ChatInputCommandInteraction,
    embed: EmbedBuilder,
    items: APIEmbedField[],
    buttons: ButtonBuilder[],
    splitPerPage: number = 5,
    timeout: number = 120000,
) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)

    let totalPages = Math.floor(items.length / splitPerPage) - 1
    let page = 0

    if(!interaction.deferred)
        await interaction.deferReply()
    const refreshFields = () => {
        return items.filter((_, index) => index >= (page * splitPerPage) && index < ((page * splitPerPage) + splitPerPage))
    }

    let Fields = refreshFields()

    const currentPage = await interaction.editReply({
        embeds: [embed.addFields(Fields).setFooter({text: `Page ${page + 1}/${totalPages + 1} • Requested by ${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL()} )],
        components: [row],
    })

    //@ts-ignore
    const filter = (i) =>
        i.customId === (<APIButtonComponentWithCustomId>buttons[0].toJSON()).custom_id 
        || i.customId === (<APIButtonComponentWithCustomId>buttons[1].toJSON()).custom_id;

    const collector = await currentPage.createMessageComponentCollector({
        filter,
        time: timeout
    })

    collector.on("collect", async(i) => {
        let disableButtons: boolean[] = []
        let currentState = page
        switch(i.customId){
            case (<APIButtonComponentWithCustomId>buttons[0].toJSON()).custom_id: {
                page = page - 1 < 0 ? 0 : page - 1
                if(page <= 0){
                    disableButtons[0] = true
                }        
                break;
            }
            case (<APIButtonComponentWithCustomId>buttons[1].toJSON()).custom_id: {
                page = page + 1 > totalPages ? totalPages : page + 1
                if(page >= totalPages){
                    disableButtons[1] = true
                }
                break;
            }
            default:
                return
        }

        if(currentState !== page){
            if(disableButtons){
                row.setComponents(
                    buttons[0].setDisabled(disableButtons[0] ?? false),
                    buttons[1].setDisabled(disableButtons[1] ?? false)
                )
            }
            await i.deferUpdate()
            await i.editReply({
                embeds: [embed.setFields(
                    refreshFields()
                ).setFooter({"text": `Page ${page+1}/${totalPages+1} • Requested by ${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL()})],
                components: [row]
            })
            return
        }
        await i.deferUpdate()
    })

    collector.on("end", (_, reason: string) => {
        if(!currentPage.guild || !currentPage.channel)
            return;
        if(reason !== "messageDelete"){
            const disabled = new ActionRowBuilder<ButtonBuilder>().addComponents(
                buttons[0].setDisabled(true),
                buttons[1].setDisabled(true)
            )
            currentPage.edit({
                components: [disabled],
            });
        }
    })   
}