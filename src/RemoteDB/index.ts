import * as firebase from 'firebase/app';
import 'firebase/firestore';
class RemoteDB{
    private static readonly FIREBASE_CONFIG = {
        apiKey: "AIzaSyBQOOgld8lxpLxqoVh3eFfI4Pir-9HaVec",
        authDomain: "smartfarm-366de.firebaseapp.com",
        databaseURL: "https://smartfarm-366de.firebaseio.com",
        projectId: "smartfarm-366de",
        storageBucket: "smartfarm-366de.appspot.com",
        messagingSenderId: "560283339420",
        appId: "1:560283339420:web:1127bc544e9d129695fb59"
    };
    private static app:firebase.app.App;
    constructor(){
        if (!firebase.apps.length) { 
            RemoteDB.app = firebase.initializeApp(RemoteDB.FIREBASE_CONFIG);
        }
       
    }
    public getInstance():firebase.app.App{
        return RemoteDB.app;
    }
    public setCallback(collection:string,document:string,nodeType:string,callback:Function):void{
        var doc = RemoteDB.app.firestore().collection(collection).doc(document);
        doc.onSnapshot(snapshot => callback(snapshot));
    }
    public async addDocument(collection:string,document:string,data:any):Promise<void>{
        try{
            await RemoteDB.app.firestore().collection(collection).doc(document).set(data);
        }catch (err) {
            throw err;
        }
    }
    public async updateDocument(collection:string,document:string,data:JSON):Promise<void>{
        try{
            await RemoteDB.app.firestore().collection(collection).doc(document).update(data);
        }catch (err) {
            throw err;
        }
    }
}

export default RemoteDB;