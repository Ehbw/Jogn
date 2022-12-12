import { FireflyEndpoints, Task, TaskRetrival, _FireFlyRequests } from "./firefly.req.js";
import config from "../../config.json" assert {type: "json"};
import Instance from "../index.js";
import { Channel, EmbedBuilder, Guild, TextChannel } from "discord.js";
import logger from "../utils/logger.js";

export class _Firefly {
    //private tasks: TaskRetrival | null = JSON.parse(`{"aggregateOffsets":{"toFfIndex":10,"toGcIndex":0,"toMsIndex":0},"hasValues":true,"totalCount":30,"fromIndex":0,"toIndex":9,"items":[{"id":"63046","title":"Theme 1, KQ3: Charles II","setter":{"sortKey":"Renyard Mrs R Renyard DB:Cloud:DB:SIMSemp:20778","guid":"DB:Cloud:DB:SIMSemp:20778","name":"Mrs R Renyard","deleted":false},"addressees":[{"guid":"DB:Cloud:DB:SIMS:123921","name":"Class 12C/Hi1","isGroup":true,"source":"FF"}],"setDate":"2022-12-05","dueDate":"2022-12-09","student":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"mark":{"isMarked":false,"grade":null,"mark":null,"markMax":null,"hasFeedback":false},"isPersonalTask":false,"isExcused":false,"isDone":true,"isResubmissionRequired":false,"lastMarkedAsDoneBy":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"archived":false,"isUnread":false,"fileSubmissionRequired":false,"hasFileSubmission":false,"descriptionContainsQuestions":false,"isMissingDueDate":false,"taskSource":"FF","altLink":null,"classes":null},{"id":"62843","title":"B Williams 1905 Revolution","setter":{"sortKey":"Hanley Mrs K Hanley DB:Cloud:DB:SIMSemp:16337","guid":"DB:Cloud:DB:SIMSemp:16337","name":"Mrs K Hanley","deleted":false},"addressees":[{"guid":"DB:Cloud:DB:SIMS:123921","name":"Class 12C/Hi1","isGroup":true,"source":"FF"}],"setDate":"2022-12-01","dueDate":"2022-12-06","student":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"mark":{"isMarked":false,"grade":null,"mark":null,"markMax":null,"hasFeedback":false},"isPersonalTask":false,"isExcused":false,"isDone":true,"isResubmissionRequired":false,"lastMarkedAsDoneBy":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"archived":false,"isUnread":false,"fileSubmissionRequired":false,"hasFileSubmission":false,"descriptionContainsQuestions":false,"isMissingDueDate":false,"taskSource":"FF","altLink":null,"classes":null},{"id":"63070","title":"Cover for today","setter":{"sortKey":"Hanley Mrs K Hanley DB:Cloud:DB:SIMSemp:16337","guid":"DB:Cloud:DB:SIMSemp:16337","name":"Mrs K Hanley","deleted":false},"addressees":[{"guid":"DB:Cloud:DB:SIMS:123906","name":"Class 12B/Hi1","isGroup":true,"source":"FF"},{"guid":"DB:Cloud:DB:SIMS:123921","name":"Class 12C/Hi1","isGroup":true,"source":"FF"}],"setDate":"2022-12-06","dueDate":"2022-12-06","student":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"mark":{"isMarked":false,"grade":null,"mark":null,"markMax":null,"hasFeedback":false},"isPersonalTask":false,"isExcused":false,"isDone":true,"isResubmissionRequired":false,"lastMarkedAsDoneBy":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"archived":false,"isUnread":false,"fileSubmissionRequired":false,"hasFileSubmission":false,"descriptionContainsQuestions":false,"isMissingDueDate":false,"taskSource":"FF","altLink":null,"classes":null},{"id":"62688","title":"Theme 1, KQ2: Essay","setter":{"sortKey":"Renyard Mrs R Renyard DB:Cloud:DB:SIMSemp:20778","guid":"DB:Cloud:DB:SIMSemp:20778","name":"Mrs R Renyard","deleted":false},"addressees":[{"guid":"DB:Cloud:DB:SIMS:123921","name":"Class 12C/Hi1","isGroup":true,"source":"FF"}],"setDate":"2022-11-28","dueDate":"2022-12-02","student":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"mark":{"isMarked":true,"grade":null,"mark":16,"markMax":20,"hasFeedback":true},"isPersonalTask":false,"isExcused":false,"isDone":true,"isResubmissionRequired":false,"lastMarkedAsDoneBy":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"archived":false,"isUnread":false,"fileSubmissionRequired":false,"hasFileSubmission":false,"descriptionContainsQuestions":false,"isMissingDueDate":false,"taskSource":"FF","altLink":null,"classes":null},{"id":"62570","title":"Was Russia ready for democracy in 1905?","setter":{"sortKey":"Hanley Mrs K Hanley DB:Cloud:DB:SIMSemp:16337","guid":"DB:Cloud:DB:SIMSemp:16337","name":"Mrs K Hanley","deleted":false},"addressees":[{"guid":"DB:Cloud:DB:SIMS:123921","name":"Class 12C/Hi1","isGroup":true,"source":"FF"}],"setDate":"2022-11-25","dueDate":"2022-11-30","student":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"mark":{"isMarked":false,"grade":null,"mark":null,"markMax":null,"hasFeedback":false},"isPersonalTask":false,"isExcused":false,"isDone":true,"isResubmissionRequired":false,"lastMarkedAsDoneBy":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"archived":false,"isUnread":false,"fileSubmissionRequired":false,"hasFileSubmission":false,"descriptionContainsQuestions":false,"isMissingDueDate":false,"taskSource":"FF","altLink":null,"classes":null},{"id":"62205","title":"Theme 1, KQ3: The Restoration Settlement ","setter":{"sortKey":"Renyard Mrs R Renyard DB:Cloud:DB:SIMSemp:20778","guid":"DB:Cloud:DB:SIMSemp:20778","name":"Mrs R Renyard","deleted":false},"addressees":[{"guid":"DB:Cloud:DB:SIMS:123921","name":"Class 12C/Hi1","isGroup":true,"source":"FF"}],"setDate":"2022-11-21","dueDate":"2022-11-28","student":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"mark":{"isMarked":false,"grade":null,"mark":null,"markMax":null,"hasFeedback":false},"isPersonalTask":false,"isExcused":false,"isDone":true,"isResubmissionRequired":false,"lastMarkedAsDoneBy":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"archived":false,"isUnread":false,"fileSubmissionRequired":true,"hasFileSubmission":true,"descriptionContainsQuestions":false,"isMissingDueDate":false,"taskSource":"FF","altLink":null,"classes":null},{"id":"62118","title":"Britain: Theme 1, KQ2: Review","setter":{"sortKey":"Renyard Mrs R Renyard DB:Cloud:DB:SIMSemp:20778","guid":"DB:Cloud:DB:SIMSemp:20778","name":"Mrs R Renyard","deleted":false},"addressees":[{"guid":"DB:Cloud:DB:SIMS:123921","name":"Class 12C/Hi1","isGroup":true,"source":"FF"}],"setDate":"2022-11-18","dueDate":"2022-11-25","student":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"mark":{"isMarked":false,"grade":null,"mark":null,"markMax":null,"hasFeedback":false},"isPersonalTask":false,"isExcused":false,"isDone":true,"isResubmissionRequired":false,"lastMarkedAsDoneBy":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"archived":false,"isUnread":false,"fileSubmissionRequired":true,"hasFileSubmission":true,"descriptionContainsQuestions":false,"isMissingDueDate":false,"taskSource":"FF","altLink":null,"classes":null},{"id":"62308","title":"C Read Timeline Tasks","setter":{"sortKey":"Hanley Mrs K Hanley DB:Cloud:DB:SIMSemp:16337","guid":"DB:Cloud:DB:SIMSemp:16337","name":"Mrs K Hanley","deleted":false},"addressees":[{"guid":"DB:Cloud:DB:SIMS:123921","name":"Class 12C/Hi1","isGroup":true,"source":"FF"}],"setDate":"2022-11-22","dueDate":"2022-11-24","student":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"mark":{"isMarked":false,"grade":null,"mark":null,"markMax":null,"hasFeedback":false},"isPersonalTask":false,"isExcused":false,"isDone":true,"isResubmissionRequired":false,"lastMarkedAsDoneBy":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"archived":false,"isUnread":false,"fileSubmissionRequired":false,"hasFileSubmission":false,"descriptionContainsQuestions":false,"isMissingDueDate":false,"taskSource":"FF","altLink":null,"classes":null},{"id":"60942","title":"Textbook tasks","setter":{"sortKey":"Hanley Mrs K Hanley DB:Cloud:DB:SIMSemp:16337","guid":"DB:Cloud:DB:SIMSemp:16337","name":"Mrs K Hanley","deleted":false},"addressees":[{"guid":"DB:Cloud:DB:SIMS:123921","name":"Class 12C/Hi1","isGroup":true,"source":"FF"}],"setDate":"2022-11-16","dueDate":"2022-11-22","student":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"mark":{"isMarked":false,"grade":null,"mark":null,"markMax":null,"hasFeedback":false},"isPersonalTask":false,"isExcused":false,"isDone":true,"isResubmissionRequired":false,"lastMarkedAsDoneBy":{"sortKey":"Wood Ethan Wood DB:Cloud:DB:SIMSstu:22159","guid":"DB:Cloud:DB:SIMSstu:22159","name":"Ethan Wood","deleted":false},"archived":false,"isUnread":false,"fileSubmissionRequired":false,"hasFileSubmission":false,"descriptionContainsQuestions":false,"isMissingDueDate":false,"taskSource":"FF","altLink":null,"classes":null}]}`)
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
                    iconURL: "https://ripley.fireflycloud.net/favicon.ico"
                })
                .setTitle("New Firefly task")
                .setFields({
                    name: task.title,
                    value: `> Due: <t:${dueDate.getTime() / 1000}:R>\n> Set By: ${task.setter.guid}\n> [Details](${config.firefly.url}/${FireflyEndpoints.SETTASKS}/${task.id})`
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
            this.request.Login(this.email, this.password)
        })
    }
}