import mqtt from "mqtt";
import firebase from "firebase";
import Node from "../Node";
import RemoteDB from "../RemoteDB";
import LocalDB from "../LocalDB";
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
    Mqtt.remoteDB = new RemoteDB();
    Mqtt.localDB = new LocalDB();
  }
  public async resgistControlNode(
    snapshot: firebase.firestore.DocumentSnapshot
  ): Promise<void> {
    const node: Node = Node.fromSnapshot(snapshot);
    var localNodeType: any;
    try {
      localNodeType = await Mqtt.localDB.getControlTypeById(node.typeId);
    } catch (err) {
      throw err;
    }
    Mqtt.client.publish(
      `Node/${node.macAddress}`,
      `set;${localNodeType.type};${node.value};`
    );
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
    console.log("Update " + message.toString());
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
  public sensorNodeUpdateValue(
    macAddress: string,
    sensorNodeType: string,
    sensorNodeId: string
  ): void {
    var topic: string = `Node/${macAddress}`;
    var payload: string = `get;${sensorNodeType};${sensorNodeId};`;
    Mqtt.client.publish(topic, payload);
  }
}

export default Mqtt;
