import "reflect-metadata";
import NodeManager from "./NodeManager";
import {container} from "tsyringe";
const nodeManager: NodeManager = container.resolve(NodeManager);
console.log("######################## Started Service #####################");
nodeManager.run();
