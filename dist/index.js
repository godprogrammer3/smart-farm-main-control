"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const NodeManager_1 = __importDefault(require("./NodeManager"));
const tsyringe_1 = require("tsyringe");
const cron_1 = require("cron");
const moment_1 = __importDefault(require("moment"));
const NodeControlConfig_1 = __importDefault(require("./DataModel/NodeControlConfig"));
const Node_1 = __importDefault(require("./DataModel/Node"));
const NodeControlType_1 = __importDefault(require("./DataModel/NodeControlType"));
const nodeManager = tsyringe_1.container.resolve(NodeManager_1.default);
console.log();
console.log("######################## Started Service #####################");
console.log('-> time stamp:', new Date().toLocaleString());
const restartJob = new cron_1.CronJob('11 11 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('-> Restart schedule');
    console.log('-> time stamp:', new Date().toLocaleString());
    for (var item in nodeManager.jobs) {
        var duration = moment_1.default.duration(nodeManager.jobs[item].start.nextDate().diff(moment_1.default(new Date())));
        var second = duration.asSeconds();
        if (second < 10) {
            const controlNodeConfigLocalDB = yield nodeManager.localDB.getControlNodeConfigById(item);
            const controlNodeConfig = NodeControlConfig_1.default.fromLocalDB(controlNodeConfigLocalDB);
            const controlNodeLocalDB = yield nodeManager.localDB.getControlNodeById(controlNodeConfig.controlId);
            const controlNode = Node_1.default.fromLocalDB(controlNodeLocalDB);
            const controlTypeLocalDB = yield nodeManager.localDB.getControlTypeById(controlNode.typeId);
            const controlType = NodeControlType_1.default.fromLocalDB(controlTypeLocalDB);
            nodeManager.runControlJob(controlNode.id, controlNode.macAddress, controlType.type, controlNodeConfig.value);
        }
        var durationEnd = moment_1.default.duration(nodeManager.jobs[item].end.nextDate().diff(moment_1.default(new Date())));
        var secondEnd = durationEnd.asSeconds();
        if (secondEnd < 10) {
            const controlNodeConfigLocalDBEnd = yield nodeManager.localDB.getControlNodeConfigById(item);
            const controlNodeConfigEnd = NodeControlConfig_1.default.fromLocalDB(controlNodeConfigLocalDBEnd);
            const controlNodeLocalDBEnd = yield nodeManager.localDB.getControlNodeById(controlNodeConfigEnd.controlId);
            const controlNodeEnd = Node_1.default.fromLocalDB(controlNodeLocalDBEnd);
            const controlTypeLocalDBEnd = yield nodeManager.localDB.getControlTypeById(controlNodeEnd.typeId);
            const controlTypeEnd = NodeControlType_1.default.fromLocalDB(controlTypeLocalDBEnd);
            nodeManager.runControlJob(controlNodeEnd.id, controlNodeEnd.macAddress, controlTypeEnd.type, controlNodeConfigEnd.value);
        }
    }
    process.exit();
}), null, false, 'Asia/Bangkok', this);
restartJob.start();
nodeManager.run();
