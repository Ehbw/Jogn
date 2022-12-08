import {Client, Collection, Events, GatewayIntentBits, REST, MessageMentionOptions, SlashCommandBuilder, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody, ChatInputCommandInteraction} from 'discord.js'
import FireflyRequests from './firefly/firefly.req' 
import leveldown from 'rocksdb';

import config from '../config.json'
import FireFly from './firefly/firefly.main';
import { RockDB } from './utils/RockDB';
import path from 'path';
import logger from './utils/logger';

export class Bot {
    private readonly _client: Client;
    private _commands: Collection<string, (interaction: ChatInputCommandInteraction) => void>;
    private _commandRegistrations: SlashCommandBuilder[] = [];
    private _rest: REST;
    private _rockDB: RockDB

    get db(): leveldown{
        return this._rockDB.db
    }

    get client(): Client{
        return this._client
    }

    public RegisterCommand(command: SlashCommandBuilder, value: (interaction: ChatInputCommandInteraction) => void){
        this._commands.set(command.name, value)
        this._commandRegistrations.push(command)
    }

    constructor(token: string, intents: GatewayIntentBits[], allowedMentions: MessageMentionOptions | undefined){
        this._commands = new Collection()
        this._rockDB = new RockDB(path.join(__dirname, "../db"))
        this._client = new Client({
            intents: intents,
            allowedMentions: allowedMentions
        })
        this._rest = new REST({version: '10'}).setToken(token)
        FireflyRequests.Login(config.firefly.username, config.firefly.password)
        .then((result) => {
            if(result){
                FireFly.refreshTasks()
            }
        })
        
        import("./commands")

        this._client.once(Events.ClientReady, bot => {
            (async() => {
                try{
                    let jsonCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
                    this._commandRegistrations.forEach((val: SlashCommandBuilder) => {
                        jsonCommands.push(val.toJSON())
                    })

                    const data = await this._rest.put(
                        Routes.applicationCommands(bot.user.id),
                        {body: jsonCommands})
                }catch(err){
                    console.error(err)
                }
            })();
            logger.info("Started discord bot instance")
        })

        this._client.on(Events.InteractionCreate, async interaction => {
            if(interaction.isChatInputCommand()){
                interaction = <ChatInputCommandInteraction>interaction
                let command = this._commands.get(interaction.commandName)
                if(command){
                    return command(interaction)
                }
            }
        })

        this._client.login(token)
    }
}


export const Instance: Bot = new Bot(config.bot.token, [GatewayIntentBits.GuildMembers], undefined)
export default Instance

