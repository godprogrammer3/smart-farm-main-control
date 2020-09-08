import express, {Application ,Request , Response ,NextFunction} from 'express';
import Node from './Node';
import Router from './Router';
import cors from 'cors';
import bodyParser from 'body-parser';
import NodeManager from './NodeManager';
const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/',Router);
app.listen(3000,()=> console.log('Server listening on port 3000'));


const nodeManager:NodeManager = new NodeManager();
nodeManager.run();