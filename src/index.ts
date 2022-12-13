import {Client, Collection, Events, GatewayIntentBits, REST, MessageMentionOptions, SlashCommandBuilder, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody, ChatInputCommandInteraction} from 'discord.js'
import leveldown from 'rocksdb';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url))

import config from '../config.json' assert { type: "json"};
import { _Firefly } from './firefly/firefly.main.js';
import { RockDB } from './utils/RockDB.js';
import logger from './utils/logger.js';
import { ChatGPTAPI } from 'chatgpt';


export class Bot {
    private readonly _client: Client;
    private _commands: Collection<string, (interaction: ChatInputCommandInteraction) => void>;
    private _commandRegistrations: SlashCommandBuilder[] = [];
    private _firefly: _Firefly
    private _rest: REST;
    private _gpt: ChatGPTAPI;
    private _rockDB: RockDB

    get db(): leveldown{
        return this._rockDB.db
    }

    get firefly(): _Firefly{
        return this._firefly
    }

    get client(): Client{
        return this._client
    }

    get gpt(): ChatGPTAPI{
        return this._gpt
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
        this._firefly = new _Firefly(config.firefly.username, config.firefly.password)
        this._rest = new REST({version: '10'}).setToken(token)
        import("./commands/index.js")

        this._client.once(Events.ClientReady, bot => {
            (async() => {
                let jsonCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
                this._commandRegistrations.forEach((val: SlashCommandBuilder) => {
                    jsonCommands.push(val.toJSON())
                })

                await this._rest.put(
                    Routes.applicationCommands(bot.user.id),
                    {body: jsonCommands})

                try{
                    this._gpt = new ChatGPTAPI({
                        sessionToken: config.bot.gptSession
                    })
                    if(this._gpt){
                        await this._gpt.ensureAuth()
                    }
                }catch(err){
                    logger.error("Unable to authenticate with ChatGPT")
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