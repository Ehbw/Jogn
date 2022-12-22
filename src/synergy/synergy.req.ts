import * as superagent from 'superagent';
import config from "../../config.json" assert {type: "json"};
import {load} from 'cheerio';
import logger from '../utils/logger.js';

export enum SynergyEndpoints {
    LOGIN = "/default.aspx?typ=timeout",
    GETTIMETABLE = "/portal/students_v2/desktop/_common/DataHandler.ashx?type=students_v2_desktop_common_timetable_get",
    PORTAL = "/portal/students_v2/desktop/home/home.aspx"
}

export type SynergyTimetable = {
    data: SynergyTimetabledLesson[];
    datestart: string;
    weekName: "Week 1" | "Week 2"
}

//lesson_3646_99
//

export type SynergyTimetabledLesson = {
    Id: string;
    StartTime: string;
    EndTime: string;
    Subject: string;
    Description: string;
    IsReadOnly: boolean;
    CategoryColor: string;
}

type SynergyAdditionalLoginData = {viewState?: string, viewStateGenerator?: string, eventValidation?: string, hfLogin?: string}
type CheerioExtended = cheerio.Cheerio & {attribs?: any}

export class _SynergyRequests {
    private _agent;

    constructor(){
        this._agent = superagent.agent()
    }

    public async RetriveTimeTable(date: string): Promise<SynergyTimetable> {
        let URL = `${config.synergy.url}${SynergyEndpoints.GETTIMETABLE}`
        return await new Promise((resolve, reject) => {
            this._agent.post(URL)
            .set("content-type", "application/x-www-form-urlencoded; charset=UTF-8")
            .set("Origin", config.synergy.url)
            .set("Referer", `${config.synergy.url}${SynergyEndpoints.PORTAL}`)
            .field("date", date)
            .field("dateDir", 1)
            .field("showATL", 0)
            .then((res) => {
                let data = res.body
                resolve({
                    data: JSON.parse(data.data),
                    datestart: data.datestart,
                    weekName: data.weekName
                })
            })
            .catch((err) => {
                logger.error(err)
                reject("Unable or incapable")
            })
        })
    }

    public async Login(email: string, password: string): Promise<boolean> {
        let URL = `${config.synergy.url}${SynergyEndpoints.LOGIN}`
        return await new Promise((resolve, reject) => {
            let LoginData: SynergyAdditionalLoginData = {};
            this._agent.get(URL)
            .then((data) => {
                let parsed = load(data.text)
                let body = parsed("body")
                let hidden = parsed(body).find("input[type='hidden']")
                for(let i = 0; i < hidden.length; i++){
                    //@ts-ignore
                    let input = hidden[i] as CheerioExtended
                    switch(input.attribs?.id){
                        case "__VIEWSTATE": {
                            LoginData.viewState = input.attribs?.value
                            break; 
                        }
                        case "__VIEWSTATEGENERATOR": {
                            LoginData.viewStateGenerator = input.attribs?.value
                            break;
                        }
                        case "__EVENTVALIDATION": {
                            LoginData.eventValidation = input.attribs?.value
                            break;
                        }
                    }
                }
                this._agent.post(URL)
                .field("__EVENTTARGET", "")
                .field("__EVENTARGUMENT", "")
                .field("__VIEWSTATE", LoginData.viewState || "")
                .field("__VIEWSTATEGENERATOR", LoginData.viewStateGenerator || "")
                .field("__EVENTVALIDATION", LoginData.eventValidation || "")
                .field("txtemail", email)
                .field("txtpassword", password)
                .field("hf_login", "{&quot;data&quot;:&quot;12|#|IsMobile|8|1|0#&quot;}")
                .field("pcpopupstate", "{&quot;windowsState&quot;:&quot;0:0:-1:0:0:0:-10000:-10000:1:0:0:0&quot;}")
                .field("pctermsstate", "{&quot;windowsState&quot;:&quot;0:0:-1:0:0:0:-10000:-10000:1:0:0:0&quot;}")
                .field("btnlogin1", "LOGIN1")
                .field("txtemailreset$State", "{&quot;validationState&quot;:&quot;&quot;}")
                .field("txtemailreset", "")
                .field("txtresetpassword$State", "{&quot;validationState&quot;:&quot;&quot;}")
                .field("txtresetpassword", "")
                .field("txtresetpasswordconfirm$State", "{&quot;validationState&quot;:&quot;&quot;}")
                .field("txtresetpasswordconfirm", "")
                .field("txtCode", "")
                .field("DXScript", "1_11,1_12,1_255,1_23,1_64,1_13,1_14,1_15,1_32,1_17,1_41,1_183,1_184,1_189")
                .field("DXCss", "0_2309,1_68,1_69,0_2314,1_210,0_2202,1_209,0_2207")
                .set("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,* /*;q=0.8")
                .set("accept-encoding", "gzip, deflate, br")
                .set("content-type", "application/x-www-form-urlencoded")
                .set("origin", config.synergy.url)
                .set("referer", `${config.synergy.url}${SynergyEndpoints.LOGIN}`)
                .then(() => {
                    logger.notice("Successfully logged into schoolsynergy")
                    this.RetriveTimeTable("2023-01-03")
                    resolve(true)
                }).catch((err) => {
                    logger.error("error: " , err)
                    reject("Error occurred when attempting login")
                })
            })
            .catch((err) => {
                logger.error("error: ", err)
                reject("Error occured when attempting to reach login page")
            })
        })
    }
}

