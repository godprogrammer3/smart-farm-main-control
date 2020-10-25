import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import Router from "./Router";
import cors from "cors";
import bodyParser from "body-parser";
import NodeManager from "./NodeManager";
import TestSpace from "./TestSpace";
import {container} from "tsyringe";
const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", Router);
app.listen(3000, () => {
    console.log("-> time stamp:",new Date());
    console.log("-> Server listening on port 3000");});

const nodeManager: NodeManager = container.resolve(NodeManager);
nodeManager.run();

// const testSpace : TestSpace = new TestSpace();
// testSpace.test();

//TODO : Implement routine by cron(npm i cron) use routine collection by very simple to only set value add a time.
