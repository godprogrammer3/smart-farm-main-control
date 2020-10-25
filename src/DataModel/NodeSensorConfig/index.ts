import firebase from 'firebase'; 
class NodeSensorConfig {
    id:string;
    sensorId: string;
    logInterval:number;
    constructor(id:string,sensorId:string,logInterval:number){
        this.id = id;
        this.sensorId = sensorId;
        this.logInterval = logInterval;
    }
    public static fromSnapshot(snapshot:firebase.firestore.DocumentSnapshot):NodeSensorConfig{
        const data = snapshot.data();   
        if(data !== undefined && snapshot != undefined){
            return new NodeSensorConfig(snapshot.id,data.sensor_id.id,data.log_interval);
        }else{
            throw new CunstomError(-1,'shanpshot or snpshot.data() is undefine'); 
        }
        
    }
    public static fromLocalDB(data:any):NodeSensorConfig{
        if(data){
            return  new NodeSensorConfig(data.id,data.control_id,data.log_interval);
        }else{
            console.log('Error : NodeSensorConfig data of localDB is undefine or null');
            throw new Error('NodeSensorConfig data of localDB is undefine or null');
        }
          
    }
    toString():string{
        return `{ 
                  id:'${this.id}',
                  sensorId:'${this.sensorId}' , 
                  logInterval:'${this.logInterval}, 
                }`;
    }
}
class CunstomError extends Error{
    code:number;
    constructor(code:number,message:string){
        super(message);
        this.code = code;
    }
}
export default NodeSensorConfig;
