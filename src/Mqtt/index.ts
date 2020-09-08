import mqtt from 'mqtt';
import firebase from 'firebase';
import Node from '../Node';
class Mqtt{ 
    private static readonly MQTT_HOST = 'localhost';
    static client: mqtt.Client;
    constructor(){
        Mqtt.client = mqtt.connect();
        Mqtt.client.on('connect',()=>{
            console.log('-> Mqtt client connected');
        });
        Mqtt.client.on('error',(error)=>{
           throw error;
        })
    }
    resgistNode(nodeType:string,snapshot:firebase.firestore.DocumentSnapshot):void{
        const node:Node = Node.fromSnapshot(snapshot);
        if( nodeType == 'control'){
            switch(node.typeId){
                case 0:{
                    Mqtt.client.publish('Node/'+snapshot.id,node.value);
                    break;
                }
                default:{
                    throw new Error("Unknow type_id of control Node in Mqtt.registNode()");
                }
            }
        }else{

        }
        
       
    }
}

export default Mqtt;