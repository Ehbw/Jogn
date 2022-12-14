import config from "../../config.json" assert {type: "json"};
import * as superagent from 'superagent';
import logger from "../utils/logger.js";

export enum FireflyEndpoints {
    LOGIN = "/login/login.aspx?prelogin=URL&kr=Cloud:Cloud",
    LOGOUT = "/logout",
    SETTASKS = "/set-tasks",
    FILTERBY = "/api/v2/taskListing/view/student/tasks/all/filterBy"
}

export type FireflyUser = {
    sortKey: string,
    guid: string,
    name: string,
    deleted: boolean
}

export type TaskData = {
    addressees?: string[], // Cloud DB identifier ("DB:Cloud:...")
    archiveStatus: "All", // Hardcoded to "All"?
    completionStatus: "All" | "Todo" | "DoneOrArchived",
    markingStatus: "All" | "OnlyMarked" | "OnlyUnmarked",
    ownerType: "OnlySetters",
    page: number, // Pageation
    pageSize: number, // 10 is default?
    readStatus: "All" | "OnlyRead" | "OnlyUnread",
    sortingCriteria: {
        column: "DueDate" | "SetDate" | "Name",
        order: "Ascending" | "Descending"
    }[]
}

export type TaskRetrival = {
    aggregateOffsets: {
        toTfIndex: number,
        toGcIndex: number,
        toMsIndex: number,
    },
    hasValues: boolean,
    totalCount: number,
    fromIndex: number,
    toIndex: number,
    items: Task[]
}

export type Task = {
    id: string,
    title: string,
    setter: FireflyUser,
    student: FireflyUser,
    addresses: {
        guid: string,
        name: string, // Class name e.g. 12C/Hi1
        isGroup: boolean,
        source: "FF" | string // most requests use FF as source, however it is likely that there is multiple 
    }[],
    setDate: string,
    dueDate: string,
    mark: {
        isMarked: boolean,
        grade: null | string, // Likely a string
        mark: null | number,
        markMax: null | number,
        hasFeedback: boolean
    },
    isPersonalTask: boolean,
    isExcused: boolean,
    isDone: boolean,
    isResubmissionRequired: boolean,
    lastMarkedAsDoneBy: FireflyUser | null,
    archieved: boolean,
    isUnread: boolean,
    fileSubmissionRequired: boolean,
    hasFileSubmission: boolean,
    descriptionContainsQuestions: boolean,
    isMissingDueDate: boolean,
    taskSource: 'FF' | string,
    altLink?: string | null, // Most likely string
    classes?: unknown | null
}

export class _FireFlyRequests {
    private _agent;

    constructor(){
        this._agent = superagent.agent()
    }

    public async RetriveTasks(requestType: TaskData): Promise<TaskRetrival> {
        let URL = `${config.firefly.url}${FireflyEndpoints.FILTERBY}`

        return await new Promise((resolve, reject) => {
            this._agent.post(URL)
            .set("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8")
            .set("accept-language", "en-GB,en;q=0.8")
            .set("content-type", "application/json")
            .set("Referer", `${config.firefly.url}/set-tasks`)
            .set("Referrer-Policy", "strict-origin-when-cross-origin")
            .set("origin", config.firefly.url)
            .send(JSON.stringify(requestType))
            .then((res) =>{
                resolve((JSON.parse(res.text) as TaskRetrival))
            })
            .catch((err) => {
                logger.error(err)
                reject("Unable to retrive tasks")
            })
        })
    }

    public async Login(email: string, password: string): Promise<boolean> {
        let URL = `${config.firefly.url}${FireflyEndpoints.LOGIN.replace("URL", encodeURIComponent(config.firefly.url))}`
        return await new Promise((resolve, reject) => {
            this._agent.post(URL)
            .field("username", email)
            .field("password", password)
            .set("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8")
            .set("accept-language", "en-GB,en;q=0.8")
            .set("content-type", "multipart/form-data")
            .set("Referer", `${config.firefly.url}/login/login.aspx?prelogin=${encodeURIComponent(config.firefly.url+"/")}`)
            .set("Referrer-Policy", "strict-origin-when-cross-origin")
            .set("origin", `${config.firefly.url}`)
            .then((res) => {
                if(res.text.toString().includes("The details you entered were incorrect. Please try again")){
                    logger.error("Invalid credentials provided")
                    return resolve(false)
                }
                resolve(true)
            })
            .catch((err) => {
                logger.error((<any>err.message))
                this._agent = superagent.agent()
                reject("Unable to login")
            })
        })
    }

    public Logout(): void {
        let URL = `${config.firefly.url}${FireflyEndpoints.LOGIN.replace("URL", encodeURIComponent(config.firefly.url))}`
        this._agent.post(URL)
        .then((res) => {
            if(res.status === 200){
                logger.info("Successfully logged out of firefly")
            }
        }).catch((err) => {
            logger.error(`Failed to log out of firefly: ${(<any>err.message || err)}`)
        })
    }
}