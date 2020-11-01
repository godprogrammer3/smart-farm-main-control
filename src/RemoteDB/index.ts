import firebase from "firebase/app";
import "firebase/firestore";
import { singleton } from "tsyringe";

@singleton()
class RemoteDB {
  private static readonly FIREBASE_CONFIG = {
    apiKey: "AIzaSyBHEHHC5wfXZakJKFvLlPT_625zQP0iUe8",
    authDomain: "dev-strawberry-74279.firebaseapp.com",
    databaseURL: "https://dev-strawberry-74279.firebaseio.com",
    projectId: "dev-strawberry-74279",
    storageBucket: "dev-strawberry-74279.appspot.com",
    messagingSenderId: "13176011539",
    appId: "1:13176011539:web:ef721456a2a1a3e9be38e6",
  };
  private static app: firebase.app.App;
  constructor() {
    if (!firebase.apps.length) {
      RemoteDB.app = firebase.initializeApp(RemoteDB.FIREBASE_CONFIG);
    }
    firebase.onLog((callbackParams) => this.logHandler(callbackParams), { level: 'debug' })
  }
  public getInstance(): firebase.app.App {
    return RemoteDB.app;
  }
  public setCallback(
    collection: string,
    document: string,
    callback: Function
  ): void {
    var doc = RemoteDB.app.firestore().collection(collection).doc(document);
    doc.onSnapshot((snapshot: firebase.firestore.DocumentSnapshot) => callback(snapshot));
  }
  public async setDocument(
    collection: string,
    document: string,
    data: any
  ): Promise<void> {
    try {
      await RemoteDB.app
        .firestore()
        .collection(collection)
        .doc(document)
        .set(data);
    } catch (err) {
      throw err;
    }
  }
  public async updateDocument(
    collection: string,
    document: string,
    data: JSON
  ): Promise<void> {
    try {
      await RemoteDB.app
        .firestore()
        .collection(collection)
        .doc(document)
        .update(data);
    } catch (err) {
      throw err;
    }
  }
  public async addDocument(collection: string, data: any): Promise<void> {
    try {
      await RemoteDB.app.firestore().collection(collection).add(data);
    } catch (err) {
      throw err;
    }
  }

  public logHandler(callbackParams: any): void {
    console.log('-> Firebase log');
    console.log('-> time stamp:', new Date().toLocaleString());
    console.log(' -> level:', callbackParams.level);
    console.log(' -> type:', callbackParams.type);
    console.log(' -> message:', callbackParams.message);
    console.log(' -> args:', callbackParams.args);
    if (callbackParams.level == 'error' || callbackParams.level == 'warn') {
      process.exit();
    }
  }
}

export default RemoteDB;
