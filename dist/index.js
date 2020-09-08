"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Node_1 = __importDefault(require("./Node"));
var node = new Node_1.default();
node.hello();
const app = express_1.default();
app.get('/', (req, res, next) => {
    res.send('Hello');
});
app.listen(3000, () => console.log('Server listening on port 3000'));
