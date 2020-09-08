import express , {Request , Response } from 'express';
import LocalDB from '../LocalDB';
const router = express.Router();
const localDB = new LocalDB();
router.get("/",(req: Request, res : Response) => {
  res.send('This is backend for manage smartfarm main control');
});
router.post("/addNode",async (req: Request, res: Response) => {
    try{
        console.log(req.body);
        await localDB.addControlNode(req.body.macAddress,req.body.typeId,req.body.farmId);
        res.status(200).send('Add node success');
    }catch(err){
        console.log(err);
    }
});

export default router;