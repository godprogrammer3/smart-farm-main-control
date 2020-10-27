"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const NodeManager_1 = __importDefault(require("./NodeManager"));
const tsyringe_1 = require("tsyringe");
const nodeManager = tsyringe_1.container.resolve(NodeManager_1.default);
console.log("######################## Started Service #####################");
console.log('-> time stamp:', new Date().toLocaleString());
nodeManager.run();
