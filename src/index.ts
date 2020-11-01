import "reflect-metadata";
import NodeManager from "./NodeManager";
import { container } from "tsyringe";
import { CronJob, job } from "cron";
import moment from "moment";
import NodeControlConfig from "./DataModel/NodeControlConfig";
import Node from "./DataModel/Node";
import NodeControlType from "./DataModel/NodeControlType";
const nodeManager: NodeManager = container.resolve(NodeManager);
console.log();
console.log("######################## Started Service #####################");
console.log('-> time stamp:', new Date().toLocaleString());
const restartJob = new CronJob('11 11 * * * *',
    async () => {
        console.log('-> Restart schedule');
        console.log('-> time stamp:', new Date().toLocaleString());
        for (var item in nodeManager.jobs) {
            var duration = moment.duration(nodeManager.jobs[item].start.nextDate().diff(moment(new Date())));
            var second = duration.asSeconds();
            if (second < 10) {
                const controlNodeConfigLocalDB = await nodeManager.localDB.getControlNodeConfigById(item);
                const controlNodeConfig = NodeControlConfig.fromLocalDB(controlNodeConfigLocalDB);
                const controlNodeLocalDB = await nodeManager.localDB.getControlNodeById(controlNodeConfig.controlId);
                const controlNode: Node = Node.fromLocalDB(controlNodeLocalDB);
                const controlTypeLocalDB: any = await nodeManager.localDB.getControlTypeById(controlNode.typeId);
                const controlType: NodeControlType = NodeControlType.fromLocalDB(controlTypeLocalDB);
                nodeManager.runControlJob(controlNode.id, controlNode.macAddress, controlType.type, controlNodeConfig.value);
            }
            var durationEnd = moment.duration(nodeManager.jobs[item].end.nextDate().diff(moment(new Date())));
            var secondEnd = durationEnd.asSeconds();
            if (secondEnd < 10) {
                const controlNodeConfigLocalDBEnd = await nodeManager.localDB.getControlNodeConfigById(item);
                const controlNodeConfigEnd = NodeControlConfig.fromLocalDB(controlNodeConfigLocalDBEnd);
                const controlNodeLocalDBEnd = await nodeManager.localDB.getControlNodeById(controlNodeConfigEnd.controlId);
                const controlNodeEnd: Node = Node.fromLocalDB(controlNodeLocalDBEnd);
                const controlTypeLocalDBEnd: any = await nodeManager.localDB.getControlTypeById(controlNodeEnd.typeId);
                const controlTypeEnd: NodeControlType = NodeControlType.fromLocalDB(controlTypeLocalDBEnd);
                nodeManager.runControlJob(controlNodeEnd.id, controlNodeEnd.macAddress, controlTypeEnd.type, controlNodeConfigEnd.value);
            }

        }
        process.exit();
    }, null, false, 'Asia/Bangkok', this)
restartJob.start();
nodeManager.run();
