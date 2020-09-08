import LocalDB from '../LocalDB';
import RemoteDB from '../RemoteDB';
import Mqtt from '../Mqtt';
class NodeManager{
    localDB:LocalDB;
    remoteDB:RemoteDB;
    mqtt:Mqtt;
    constructor(){  
        this.localDB = new LocalDB();
        this.remoteDB = new RemoteDB();
        this.mqtt = new Mqtt();
    }
    async run():Promise<void>{
        var controlNodes = await this.localDB.getControlNode();
        this.controlNodeRegist(controlNodes);
    }
    controlNodeRegist(controlNodes:any):void{
        for(var i = 0; i < controlNodes.length; i++){
            switch(controlNodes[i].type_id){
                case 0 :{
                    this.remoteDB.setCallback('control',controlNodes[i].mac_address,'control',this.mqtt.resgistNode);
                    break;
                }
                default:{
                    throw new Error('Unknow control node type');
                }
            }
        }
    }
}

export default NodeManager; 