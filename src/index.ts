import {Client, Collection, Events, GatewayIntentBits, REST, MessageMentionOptions, SlashCommandBuilder, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody, ChatInputCommandInteraction} from 'discord.js'
import leveldown from 'rocksdb';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url))

import config from '../config.json' assert { type: "json"};
import { _Firefly } from './firefly/firefly.main.js';
import { RockDB } from './utils/RockDB.js';
import logger from './utils/logger.js';
import {_Synergy} from './synergy/synergy.main.js'

export class Bot {
    private readonly _client: Client;
    private _commands: Collection<string, (interaction: ChatInputCommandInteraction) => void>;
    private _events: Collection<string, (...args: any[]) => void>;
    private _commandRegistrations: SlashCommandBuilder[] = [];
    private _firefly: _Firefly;
    //private _synergy; _Syner;
    private _rest: REST;
    private _rockDB: RockDB;

    get db(): leveldown{
        return this._rockDB.db
    }

    get firefly(): _Firefly{
        return this._firefly
    }

    get client(): Client{
        return this._client
    }

    public RegisterCommand(command: SlashCommandBuilder, value: (interaction: ChatInputCommandInteraction) => void){
        this._commands.set(command.name, value)
        this._commandRegistrations.push(command)
    }

    public RegisterEvent(event: Events, value: (...args: any[]) => void){
        this._client.on(event.toString(), (...args: any[]) => value(...args))
    }

    constructor(token: string, intents: GatewayIntentBits[], allowedMentions: MessageMentionOptions | undefined){
        this._commands = new Collection()
        this._events = new Collection()
        this._rockDB = new RockDB(path.join(__dirname, "../db"))
        this._client = new Client({
            intents: intents,
            allowedMentions: allowedMentions
        })
        this._firefly = new _Firefly(config.firefly.username, config.firefly.password)
        this._rest = new REST({version: '10'}).setToken(token)
        import("./commands/index.js")

       // SynergyRequests.Login(config.synergy.username, config.synergy.password, config.synergy.extra)

        this._client.once(Events.ClientReady, bot => {
            (async() => {
                let jsonCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
                this._commandRegistrations.forEach((val: SlashCommandBuilder) => {
                    jsonCommands.push(val.toJSON())
                })

                await this._rest.put(
                    Routes.applicationCommands(bot.user.id),
                    {body: jsonCommands})
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

        try{
            import("./debug.js")
        }catch(ex){}

        this._client.login(token)
    }
}

export const Instance: Bot = new Bot(config.bot.token, [GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences], undefined)
export default Instance