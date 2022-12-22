import { FireflyEndpoints, Task, TaskRetrival, _FireFlyRequests } from "./firefly.req.js";
import config from "../../config.json" assert {type: "json"};
import Instance from "../index.js";
import { Channel, EmbedBuilder, Guild, TextChannel } from "discord.js";
import logger from "../utils/logger.js";

export class _Firefly {
    private tasks: TaskRetrival | null = null;
    private email: string;
    private password: string;
    private request: _FireFlyRequests

    get Tasks(): TaskRetrival | null {
        return this.tasks
    };

    get Request(): _FireFlyRequests {
        return this.request
    }

    constructor(email: string, password: string){
        this.email = email
        this.password = password
        this.request = new _FireFlyRequests()
        
        this.request.Login(email, password).then((success) => {
            if(success){
                logger.info("Successfully logged into Firefly")
                setTimeout(() => {
                    this.refreshTasks()
                    setInterval(() => {
                        this.refreshTasks()
                    }, 300000)
                }, 1000)
            }
        }).catch((err) => {
            logger.error(`Unable to login ${err}`)
        })
    }

    private publishTaskNotifications(channe: TextChannel, tasks: Task[]){
        for (let i = 0; i < tasks.length; i++){
            let task = tasks[i]
            if(task){
                let dueDate = new Date(task.dueDate)
                dueDate.setHours(12)
                let embed = new EmbedBuilder()
                .setAuthor({
                    name: "Firefly",
                    url: `${config.firefly.url}/${FireflyEndpoints.SETTASKS}/${task.id}`,
                    iconURL: `${config.firefly.url}/favicon.ico`
                })
                .setTitle("New Firefly task")
                .setFields({
                    name: task.title,
                    value: `> Due: <t:${dueDate.getTime() / 1000}:R>\n> Set By: ${task.setter.name}\n> [Details](${config.firefly.url}/${FireflyEndpoints.SETTASKS}/${task.id})`
                })
                channe.send({embeds: [embed]})
            }
        }
    }

    public refreshTasks(){
        this.request.RetriveTasks({
            addressees: [config.firefly.addressees.History],
            archiveStatus: "All",
            completionStatus: "All",
            markingStatus: "All",
            ownerType: "OnlySetters",
            page: 0,
            pageSize: 10,
            readStatus: "All",
            sortingCriteria: [{
                column: "DueDate",
                order: "Descending"
            }]
        }).then((result) => {
            //Remove Personal Tasks
            result.items = result.items.filter((val:Task) => !val.isPersonalTask)
            if(this.tasks){
                logger.info(`${Math.abs(result.totalCount - this.tasks.totalCount)} new tasks found`)
                let newTasks = result.items.filter((val: Task) => {
                  return this.tasks?.items.findIndex((resultVal: Task) => resultVal.id === val.id) === -1  
                })
                if(newTasks.length !== 0){
                    Instance.client.guilds.cache.forEach((val: Guild) => {
                        if(val.id){
                            Instance.db.get(`${val.id}-notification`, (err: any, result: string | undefined) => { 
                                if(err)
                                    return
                                if(result){
                                    result = result as string
                                    let channel: Channel | undefined = Instance.client.channels.cache.get(result)
                                    if(!channel){
                                        Instance.client.channels.fetch(result).then((res: Channel | null) => {
                                            if(res){
                                                res = (<TextChannel>res)
                                                this.publishTaskNotifications(res, newTasks)
                                                return
                                            }
                                        }).catch((error) => {
                                        })
                                        return
                                    }
                                    channel = channel as TextChannel
                                    this.publishTaskNotifications(channel, newTasks)
                                }
                            }) 
                        }
                    })
                }
            }
            this.tasks = result
        }).catch((error) => {
            logger.error("Unable to retrive tasks, attempting relogin")
            this.request.Login(this.email, this.password).catch(() => logger.error("Unable to login in order to retrive tasks"))
        })
    }
}