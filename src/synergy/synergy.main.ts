import { SynergyTimetable, _SynergyRequests } from "./synergy.req.js";

export class _Synergy {
    private email: string;
    private password: string; 

    private _timetable: SynergyTimetable[];

    get timetable(): SynergyTimetable[] {
        return this._timetable
    }
    
    private request: _SynergyRequests;
    constructor(email: string, password: string){
        this.email = email;
        this.password = password;
        this.request = new _SynergyRequests();
        this._timetable = []
        

        this.request.Login(email, password).then((success) => {
            if(success){
                this.LoadTimetable()
            }
        })
        
    }

    private async LoadTimetable(): Promise<void> {
        let date = new Date()
        let startofWeek = (date.getDate() - date.getDay()) + (date.getDay() == 0 ? -6 : 1)
        date.setDate(startofWeek)
        
        for(let i = 0; i < 3; i++){
            if(i != 0){
                date.setDate(date.getDate() + 7)
            }
            this._timetable.push(await this.request.RetriveTimeTable(`${date.getUTCFullYear()}-${date.getMonth()+1}-${date.getDate()}`))
        }
    }


}