import RemoteDB from '../RemoteDB';
import localDB from '../LocalDB';
import LocalDB from '../LocalDB';
class TestSpace{
    remoteDB: RemoteDB;
    localDB: LocalDB;
    constructor(){
        this.remoteDB = new RemoteDB();
        this.localDB = new LocalDB();
    }
    async test(): Promise<void>{
        // var app = this.remoteDB.getInstance();
        // var result:any= await app.firestore().collection('control').doc('cI7oo4PmMo1sfuAdV13X').get();
        // if(result.data().type_id !== undefined){
        //     console.log(result.data().type_id.id);
        // }
        
        this.localDB.updateFromRemoteDB();
       
    }
}

export default TestSpace;