import LocalDB from "../LocalDB";
import RemoteDB from "../RemoteDB";
import Mqtt from "../Mqtt";
import Node from "../Node";
class NodeManager {
  localDB: LocalDB;
  remoteDB: RemoteDB;
  mqtt: Mqtt;
  constructor() {
    this.localDB = new LocalDB();
    this.remoteDB = new RemoteDB();
    this.mqtt = new Mqtt();
  }
  async run(): Promise<void> {
    await this.localDB.updateFromRemoteDB();
    var controlNodes = await this.localDB.getControlNode();
    this.controlNodeRegist(controlNodes);
    var sensorNodes:any = await this.localDB.getSensorNode();
    var sensorNodesConfig:any = await this.localDB.getSensorNodeConfig();
    this.sensorNodeRegist(sensorNodes, sensorNodesConfig);
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
  async sensorNodeRegist(sensorNodes: any, sensorNodesConfig: any): Promise<void> {
    sensorNodes.forEach(async (sensorNode:any) => {
        var sensorNodeConfig = sensorNodesConfig.find(
          (sensorNodeConfig: any) => {
            return sensorNodeConfig.sensor_id == sensorNode.id;
          }
        );
        var localNodeType:any;
        try{ 
          localNodeType = await this.localDB.getSensorTypeById(sensorNode.type_id);
        }catch(err){
          throw err;
        }
        setInterval(
          () =>
            this.mqtt.sensorNodeUpdateValue(
            sensorNode.mac_address,
              localNodeType.type,
              sensorNode.id
            ),
            sensorNodeConfig.log_interval * 1000
        )
    });
  }
}

export default NodeManager;
