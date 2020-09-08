import mqtt from "mqtt";
import firebase from "firebase";
import Node from "../Node";
import RemoteDB from "../RemoteDB";
class Mqtt {
  private static readonly MQTT_HOST = "192.168.1.2";
  static client: mqtt.Client;
  static remoteDB:RemoteDB;
  constructor() {
    Mqtt.client = mqtt.connect({ host: Mqtt.MQTT_HOST });
    Mqtt.client.on("connect", () => {
      console.log("-> Mqtt client connected");
    });
    Mqtt.client.subscribe('Node/+/value');
    Mqtt.client.on("message", this.manageMessage);
    Mqtt.client.on("error", (error) => {
      throw error;
    });
    Mqtt.remoteDB = new RemoteDB();
  }
  public resgistControlNode(
    snapshot: firebase.firestore.DocumentSnapshot
  ): void {
    const node: Node = Node.fromSnapshot(snapshot);
    if (node.typeId >= 0 && node.typeId < Node.NODE_CONTROL_TYPE.length) {
      Mqtt.client.publish(
        `Node/${snapshot.id}`,
        `set;${Node.NODE_CONTROL_TYPE[node.typeId]};${node.value};`
      );
    } else {
      throw new Error("Unknow type_id of control Node in Mqtt.registNode()");
    }
  }
  private manageMessage(topic: string, message: string): void {
    var topicList: string[] = topic.split('/');
    Mqtt.remoteDB.updateDocument('sensor',topicList[1],JSON.parse(`{"value":"${message}"}`));
  }
  public sensorNodeUpdateValue(macAddress:string,sensorNodeType:string):void{
    var topic:string = `Node/${macAddress}`;
    var payload:string = `get;${sensorNodeType};null;`;
    Mqtt.client.publish(topic,payload)
  }
}

export default Mqtt;
