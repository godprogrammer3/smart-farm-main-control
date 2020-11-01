import LocalDB from "../LocalDB";
import RemoteDB from "../RemoteDB";
import Mqtt from "../Mqtt";
import { singleton } from "tsyringe";
import { container } from "tsyringe";
import NodeControlConfig from "../DataModel/NodeControlConfig"
import Node from "../DataModel/Node"
import NodeControlType from "../DataModel/NodeControlType";
import { CronJob } from "cron";
import firebase from "firebase";
@singleton()
class NodeManager {
  localDB: LocalDB;
  remoteDB: RemoteDB;
  mqtt: Mqtt;
  jobs: Record<string, any>;
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
    var sensorNodes: any = await this.localDB.getSensorNode();
    this.sensorNodeRegist(sensorNodes);
    var controlConfigs: any = await this.localDB.getControlNodeConfig();
    this.controlScheduleRegist(controlConfigs);
  }
  controlNodeRegist(controlNodes: any): void {
    for (var i = 0; i < controlNodes.length; i++) {
      this.remoteDB.setCallback(
        "control",
        controlNodes[i].id,
        this.mqtt.resgistControlNode
      );
    }
  }
  async sensorNodeRegist(sensorNodes: any): Promise<void> {
    sensorNodes.forEach(async (sensorNode: any) => {
      var localNodeType: any;
      try {
        localNodeType = await this.localDB.getSensorTypeById(sensorNode.type_id);
      } catch (err) {
        throw err;
      }
      this.mqtt.sensorNodeUpdateValue(
        sensorNode.mac_address,
        localNodeType.type,
        sensorNode.id,
      );
    });
  }

  async controlScheduleRegist(controlConfigs: any): Promise<void> {
    var controlConfigNode: Array<NodeControlConfig>;
    controlConfigNode = controlConfigs.map((element: any) => {
      return NodeControlConfig.fromLocalDB(element);
    });
    for (var i = 0; i < controlConfigNode.length; i++) {
      this.controlScheduleSet(controlConfigNode[i]);
      this.remoteDB.setCallback('control_config', controlConfigNode[i].id, (snapshot: firebase.firestore.DocumentSnapshot, context = this) => {
        if (!snapshot.exists) {
          process.exit();
        }
        const controlConfig: NodeControlConfig = NodeControlConfig.fromSnapshot(snapshot);
        context.controlScheduleSet(controlConfig);
      });
    }
  }

  async controlScheduleSet(controlConfig: NodeControlConfig): Promise<void> {
    console.log("-> time stamp:", new Date().toLocaleString());
    console.log("-> Control Schedule set");
    console.log(" -> id:", controlConfig.id);
    console.log(" -> control_id:", controlConfig.controlId);
    console.log(" -> startCronTime", controlConfig.startCronTime);
    console.log(" -> endCronTime:", controlConfig.endCronTime);
    console.log(" -> value:", controlConfig.value);
    const controlNodeLocalDB = await this.localDB.getControlNodeById(controlConfig.controlId);
    const controlNode: Node = Node.fromLocalDB(controlNodeLocalDB);
    const controlTypeLocalDB: any = await this.localDB.getControlTypeById(controlNode.typeId);
    const controlType: NodeControlType = NodeControlType.fromLocalDB(controlTypeLocalDB);

    if (this.jobs[controlConfig.id]) {
      this.jobs[controlConfig.id].start.stop();
      this.jobs[controlConfig.id].end.stop();
    } else {
      this.jobs[controlConfig.id] = {};
    }

    this.jobs[controlConfig.id].start = new CronJob(controlConfig.startCronTime,
      (dummyParam = null, paramControlConfig = controlConfig, paramControlNode: Node = controlNode, paramControlType: NodeControlType = controlType) => {
        this.runControlJob(paramControlNode.id, paramControlNode.macAddress, paramControlType.type, paramControlConfig.value);
      }, null, false, 'Asia/Bangkok', this);
    this.jobs[controlConfig.id].start.start();

    this.jobs[controlConfig.id].end = new CronJob(controlConfig.endCronTime,
      (dummyParam = null, paramControlNode: Node = controlNode, paramControlType: NodeControlType = controlType) => {
        this.runControlJob(paramControlNode.id, paramControlNode.macAddress, paramControlType.type, paramControlType.defaultValue);
      }, null, false, 'Asia/Bangkok', this);
    this.jobs[controlConfig.id].end.start();
  }

  async runControlJob(controlNodeId: string, macaddress: string, type: string, value: string): Promise<void> {
    console.log("-> time stamp:", new Date().toLocaleString());
    console.log("-> Run control job");
    console.log(" -> mac_address:", macaddress);
    console.log(" -> type:", type);
    console.log(" -> value:", value);
    Mqtt.controlNodeSetValue(macaddress, type, value);
    this.remoteDB.updateDocument('control', controlNodeId, JSON.parse(`{"value":"${value}"}`));
    const firebaseApp = Mqtt.remoteDB.getInstance();
    const farm: any = await Mqtt.localDB.getFarmInfo();
    const data = {
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      farm_id: firebaseApp.firestore().collection("farm").doc(farm.id),
      control_id: firebaseApp
        .firestore()
        .collection("control")
        .doc(controlNodeId),
      server_date: firebase.firestore.Timestamp.now(),
      status: "running",
      value: value,
    };
    Mqtt.remoteDB.addDocument("control_log", data);
  }

}

export default NodeManager;
