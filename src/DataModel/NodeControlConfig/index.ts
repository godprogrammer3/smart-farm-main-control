import firebase from 'firebase'; 
import { stringify } from 'querystring';
import { predicateAwareClassFactory } from 'tsyringe';
class NodeControlConfig {
    id:string;
    controlId: string;
    logInterval:number;
    cronTime:string;
    periodTime:number;
    value:string;
    constructor(id:string,controlId:string,logInterval:number,cronTime:string,periodTime:number,value:string){
        this.id = id;
        this.controlId = controlId;
        this.logInterval = logInterval;
        this.cronTime = cronTime;
        this.periodTime = periodTime;
        this.value = value;
    }
    public static fromSnapshot(snapshot:firebase.firestore.DocumentSnapshot):NodeControlConfig{
        const data = snapshot.data();   
        if(data !== undefined){
            return new NodeControlConfig(snapshot.id,data.control_id.id,data.log_interval,data.cron_time,data.period_time,data.value);
        }else{
            throw new Error("snapshot.data() is undefined"); 
        }
        
    }
    public static fromLocalDB(data:any):NodeControlConfig{
        if(data){
            return  new NodeControlConfig(data.id,data.control_id,data.log_interval,data.cron_time,data.period_time,data.value);
        }else{
            console.log('Error : NodeControlConfig data of localDB is undefine or null');
            throw new Error('NodeControlConfig data of localDB is undefine or null');
        }
          
    }
    public clone():NodeControlConfig{
        return new NodeControlConfig(this.id,this.controlId,this.logInterval,this.cronTime,this.periodTime,this.value);
    }
    public static cloneObject(object:NodeControlConfig):NodeControlConfig{
        return new NodeControlConfig(object.id,object.controlId,object.logInterval,object.cronTime,object.periodTime,object.value);
    }
    toString():string{
        return `{ 
                  id:'${this.id}',
                  controlId:'${this.controlId}' , 
                  logInterval:'${this.logInterval}, 
                  cronTime:'${this.cronTime} ,
                  periodTime:'${this.periodTime},
                  value:'${this.value}
                }`;
    }
}

export default NodeControlConfig;
