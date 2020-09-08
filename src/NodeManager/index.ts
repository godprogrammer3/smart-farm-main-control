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
    var controlNodes = await this.localDB.getControlNode();
    this.controlNodeRegist(controlNodes);
    var sensorNodes = await this.localDB.getSensorNode();
    var sensorNodesConfig = await this.localDB.getSensorNodeConfig();
    this.sensorNodeRegist(sensorNodes, sensorNodesConfig);
  }
  controlNodeRegist(controlNodes: any): void {
    for (var i = 0; i < controlNodes.length; i++) {
      switch (controlNodes[i].type_id) {
        case 0: {
          this.remoteDB.setCallback(
            "control",
            controlNodes[i].mac_address,
            "control",
            this.mqtt.resgistControlNode
          );
          break;
        }
        default: {
          throw new Error("Unknow control node type");
        }
      }
    }
  }
  sensorNodeRegist(sensorNodes: any, sensorNodesConfig: any): void {
    sensorNodes.forEach((sensorNode:any) => {
        var sensorNodeConfig = sensorNodesConfig.find(
          (sensorNodeConfig: any) => {
            return sensorNodeConfig.sensor_id == sensorNode.mac_address;
          }
        );
        setInterval(
          () =>
            this.mqtt.sensorNodeUpdateValue(
            sensorNode.mac_address,
              Node.NODE_SENSOR_TYPE[sensorNode.type_id]
            ),
            sensorNodeConfig.log_interval * 1000
        )
    });
  }
}

export default NodeManager;
