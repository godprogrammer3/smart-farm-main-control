import LocalDB from "../LocalDB";
import RemoteDB from "../RemoteDB";
import Mqtt from "../Mqtt";
import {singleton} from "tsyringe";
import {container} from "tsyringe";
import NodeControlConfig from "../DataModel/NodeControlConfig"
import Node from "../DataModel/Node"
import NodeControlType from "../DataModel/NodeControlType";
import {CronJob} from "cron";
import firebase from "firebase";
@singleton()
class NodeManager {
  localDB: LocalDB;
  remoteDB: RemoteDB;
  mqtt: Mqtt;
  jobs: Record<string,any>;
  constructor() {
    this.localDB = container.resolve(LocalDB);
    this.remoteDB = container.resolve(RemoteDB);
    this.mqtt = container.resolve(Mqtt);
    this.jobs = {};
  }
  async run(): Promise<void> {
    await this.localDB.updateFromRemoteDB();
    var controlNodes = await this.localDB.getControlNode();
    this.controlNodeRegist(controlNodes);
    var sensorNodes:any = await this.localDB.getSensorNode();
    this.sensorNodeRegist(sensorNodes);
    var controlConfigs:any = await this.localDB.getControlNodeConfig();
    this.controlScheduleRegist(controlConfigs);
  }
  controlNodeRegist(controlNodes: any):void{
    for (var i = 0; i < controlNodes.length; i++) {
      this.remoteDB.setCallback(
              "control",
              controlNodes[i].id,
              this.mqtt.resgistControlNode
            );
    }
  }
  async sensorNodeRegist(sensorNodes: any): Promise<void> {
    sensorNodes.forEach(async (sensorNode:any) => {
        var localNodeType:any;
        try{ 
          localNodeType = await this.localDB.getSensorTypeById(sensorNode.type_id);
        }catch(err){
          throw err;
        }
        this.mqtt.sensorNodeUpdateValue(
        sensorNode.mac_address,
          localNodeType.type,
          sensorNode.id,
        );
    });
  }

  async controlScheduleRegist(controlConfigs:any):Promise<void>{
    var controlConfigNode:Array<NodeControlConfig>;
    controlConfigNode = controlConfigs.map((element:any) => {
      return NodeControlConfig.fromLocalDB(element);
    });
    for(var i = 0 ; i < controlConfigNode.length ; i++){
      this.controlScheduleSet(controlConfigNode[i]);
      this.remoteDB.setCallback('control_config',controlConfigNode[i].id,(snapshot: firebase.firestore.DocumentSnapshot,context=this)=>{
        const controlConfig:NodeControlConfig = NodeControlConfig.fromSnapshot(snapshot);
        context.controlScheduleSet(controlConfig);
      });
    }
  }

  async controlScheduleSet(controlConfig:NodeControlConfig):Promise<void>{
    console.log("-> time stamp:",new Date().toLocaleString());
    console.log("-> Control Schedule set");
    console.log(" -> id:",controlConfig.id);
    console.log(" -> control_id:",controlConfig.controlId);
    console.log(" -> log_interval",controlConfig.logInterval);
    console.log(" -> cron_time:",controlConfig.cronTime);
    console.log(" -> period_time:",controlConfig.periodTime);
    console.log(" -> value:",controlConfig.value);
    const controlNodeLocalDB = await this.localDB.getControlNodeById(controlConfig.controlId);
      const controlNode:Node = Node.fromLocalDB(controlNodeLocalDB);
      const controlTypeLocalDB:any = await this.localDB.getControlTypeById(controlNode.typeId);
      const controlType:NodeControlType = NodeControlType.fromLocalDB(controlTypeLocalDB);
      if(this.jobs[controlConfig.id]){
        this.jobs[controlConfig.id].stop();
      }
      this.jobs[controlConfig.id] = new CronJob(controlConfig.cronTime,
        ( dummyParam = null, paramControlConfig = controlConfig,paramControlNode:Node = controlNode , paramControlType:NodeControlType = controlType)=>{
        this.runControlJob(paramControlNode.macAddress,paramControlType.type,paramControlConfig.value,paramControlConfig.periodTime,paramControlType.defaultValue);
      },null,false,'Asia/Bangkok',this);
      this.jobs[controlConfig.id].start();
  }

  async runControlJob(macaddress:string,type:string,startValue:string,periodTime:number,endValue:string):Promise<void>{
    console.log("-> time stamp:",new Date().toLocaleString());
    console.log("-> Run control job");
    console.log(" -> mac_address:",macaddress);
    console.log(" -> type:",type);
    console.log(" -> startValue:",startValue);
    console.log(" -> periodTime:",periodTime);
    console.log(" -> endValue:",endValue);
    Mqtt.controlNodeSetValue(macaddress,type,startValue);
    if(periodTime>0){
      setTimeout(()=>this.runControlJob(macaddress,type,endValue,-1,''),periodTime*1000);
    }
  }

}

export default NodeManager;
