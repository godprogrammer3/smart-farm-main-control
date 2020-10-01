import * as firebase from "firebase/app";
import "firebase/firestore";
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
    doc.onSnapshot((snapshot) => callback(snapshot));
  }
  public async addDocument(
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
}

export default RemoteDB;
