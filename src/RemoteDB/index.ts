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
    private app:firebase.app.App;
    constructor(){
        this.app = firebase.initializeApp(RemoteDB.FIREBASE_CONFIG);
       
    }
    public getInstance():firebase.app.App{
        return this.app;
    }
    public setCallback(collection:string,document:any,nodeType:string,callback:Function):void{
        var doc = this.app.firestore().collection(collection).doc(document);
        doc.onSnapshot(snapshot => callback(nodeType,snapshot));
    }
}

export default RemoteDB;