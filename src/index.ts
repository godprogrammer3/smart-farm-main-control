import "reflect-metadata";
import NodeManager from "./NodeManager";
import {container} from "tsyringe";
const nodeManager: NodeManager = container.resolve(NodeManager);
console.log("######################## Started Service #####################");
console.log('-> time stamp:',new Date().toLocaleString());
nodeManager.run();
