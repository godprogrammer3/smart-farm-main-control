import express , {Request , Response } from 'express';
import LocalDB from '../LocalDB';
const router = express.Router();
const localDB = new LocalDB();
router.get("/",(req: Request, res : Response) => {
  res.send('This is backend for manage smartfarm main control');
});
router.post("/addNode",async (req: Request, res: Response) => {
    try{
        if( req.body.nodeType == 'control_node'){
            await localDB.addControlNode(req.body.macAddress,req.body.typeId);
            res.status(200).send('Add control node success');
        }else{
            await localDB.addSensorNode(req.body.macAddress,req.body.typeId);
            res.status(200).send('Add sensor node success');
        }
       
    }catch(err){
        console.log(err);
        res.status(500).send("Error :"+err);
    }
});

router.post("/addNodeConfig",async (req: Request, res: Response) => {
    try{
        if( req.body.nodeType == 'control_node'){
            await localDB.addControlNodeConfig(req.body.macAddress,req.body.logInterval);
            res.status(200).send('Add control node config success');
        }else{
            await localDB.addSensorNodeConfig(req.body.macAddress,req.body.logInterval);
            res.status(200).send('Add sensor node config success');
        }
    }catch(err){
        console.log(err);
        res.status(500).send("Error :"+err);
    }
});

export default router;