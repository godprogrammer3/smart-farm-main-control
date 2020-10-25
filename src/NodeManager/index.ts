import LocalDB from "../LocalDB";
import RemoteDB from "../RemoteDB";
import Mqtt from "../Mqtt";
import {singleton} from "tsyringe";
import {container} from "tsyringe";
@singleton()
class NodeManager {
  localDB: LocalDB;
  remoteDB: RemoteDB;
  mqtt: Mqtt;
  constructor() {
    this.localDB = container.resolve(LocalDB);
    this.remoteDB = container.resolve(RemoteDB);
    this.mqtt = container.resolve(Mqtt);
  }
  async run(): Promise<void> {
    await this.localDB.updateFromRemoteDB();
    var controlNodes = await this.localDB.getControlNode();
    this.controlNodeRegist(controlNodes);
    var sensorNodes:any = await this.localDB.getSensorNode();
    this.sensorNodeRegist(sensorNodes);
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
}

export default NodeManager;
