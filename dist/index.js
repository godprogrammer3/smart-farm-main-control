"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Router_1 = __importDefault(require("./Router"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const NodeManager_1 = __importDefault(require("./NodeManager"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use('/', Router_1.default);
app.listen(3000, () => console.log('Server listening on port 3000'));
const nodeManager = new NodeManager_1.default();
nodeManager.run();
