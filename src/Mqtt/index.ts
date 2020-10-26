import mqtt from "mqtt";
import firebase from "firebase";
import Node from "../DataModel/Node";
import RemoteDB from "../RemoteDB";
import LocalDB from "../LocalDB";
import {singleton} from "tsyringe";
import {container} from "tsyringe";
@singleton()
class Mqtt {
  private static readonly MQTT_HOST = "192.168.1.2";
  static client: mqtt.Client;
  static remoteDB: RemoteDB;
  static localDB: LocalDB;
  constructor() {
    Mqtt.client = mqtt.connect({ host: Mqtt.MQTT_HOST });
    Mqtt.client.on("connect", () => {
      console.log("-> Mqtt client connected");
    });
    Mqtt.client.subscribe("Node/+/value");
    Mqtt.client.on("message", this.manageMessage);
    Mqtt.client.on("error", (error) => {
      throw error;
    });
    Mqtt.remoteDB = container.resolve(RemoteDB);
    Mqtt.localDB = container.resolve(LocalDB);
  }
  public async resgistControlNode(
    snapshot: firebase.firestore.DocumentSnapshot
  ): Promise<void> {
    if(!snapshot.exists){
      process.exit();
    }
    const node: Node = Node.fromSnapshot(snapshot);
    console.log('-> time stamp:',new Date().toLocaleString());
    console.log('-> Node control update from firebase');
    console.log(" -> id:",node.id);
    console.log(" -> mac_address:",node.macAddress);
    console.log(" -> typeId:",node.typeId);
    console.log(" -> value:",node.value);
    var localNodeType: any;
    try {
      localNodeType = await Mqtt.localDB.getControlTypeById(node.typeId);
    } catch (err) {
      console.log("Error :",err);
      throw err;
    }
    Mqtt.controlNodeSetValue(node.macAddress,localNodeType.type,node.value);
    const firebaseApp = Mqtt.remoteDB.getInstance();
    const farm: any = await Mqtt.localDB.getFarmInfo();
    const data = {
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      farm_id: firebaseApp.firestore().collection("farm").doc(farm.id),
      control_id: firebaseApp
        .firestore()
        .collection("control")
        .doc(snapshot.id),
      server_date: firebase.firestore.Timestamp.now(),
      status: "running",
      value: node.value,
    };
    Mqtt.remoteDB.addDocument("control_log", data);
  } 
  private async manageMessage(topic: string, message: Buffer): Promise<void> {
    var messageList: string[] = message.toString().split(",");
    console.log("-> time stamp:",new Date().toLocaleString());
    console.log("-> Update " + message.toString());
    Mqtt.remoteDB.updateDocument(
      "sensor",
      messageList[1],
      JSON.parse(`{"value":"${messageList[0]}"}`)
    );
    const firebaseApp = Mqtt.remoteDB.getInstance();
    const farm: any = await Mqtt.localDB.getFarmInfo();

    const data = {
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      farm_id: firebaseApp.firestore().collection("farm").doc(farm.id),
      sensor_id: firebaseApp
        .firestore()
        .collection("sensor")
        .doc(messageList[1]),
      server_date: firebase.firestore.Timestamp.now(),
      status: "running",
      value: messageList[0],
    };
    Mqtt.remoteDB.addDocument("sensor_log", data);
  }
  public async sensorNodeUpdateValue(
    macAddress: string,
    sensorNodeType: string,
    sensorNodeId: string,
  ): Promise<void> {
    console.log("-> time stamp:",new Date().toLocaleString());
    console.log("-> Sensor update");
    console.log(" -> id:",sensorNodeId);
    console.log(" -> mac_address:",macAddress);
    console.log(" -> type:",sensorNodeType);
    var topic: string = `Node/${macAddress}`;
    var payload: string = `get;${sensorNodeType};${sensorNodeId};`;
    Mqtt.client.publish(topic, payload);
    let sensorConfig = await  Mqtt.localDB.getSensorNodeConfigBySensorId(sensorNodeId);
    setTimeout(()=>this.sensorNodeUpdateValue(macAddress,sensorNodeType,sensorNodeId),sensorConfig.log_interval*1000);
  }

  public static async controlNodeSetValue(
    macAddress:String,
    type:String,
    value:String
  ):Promise<void>{
    var topic: string = `Node/${macAddress}`;
    var payload: string = `set;${type};${value};`;
    Mqtt.client.publish(topic, payload,{retain:true});
  }
}

export default Mqtt;
