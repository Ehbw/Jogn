import path from 'path';
import leveldown from 'rocksdb';

export class RockDB {
    private _db: leveldown;

    get db(): leveldown{
        return this._db;
    }

    constructor(location: string){
        this._db = leveldown(location)
        this._db.open((err) => {
            if(err){
                console.error(err)
            }
        })
    }

    public close(){
        this._db.close((err) => {
            if(err){
                console.error(err)
            }
        })
    }
}