import firebase from 'firebase'; 
class Node {
    macAddress: string;
    typeId:number;
    startDate:Date;
    endDate:Date;
    value:string;
    public static readonly NODE_CONTROL_TYPE:string[] = [
        'switch'
    ];
    public static readonly NODE_SENSOR_TYPE:string[] = [
        'air_temp_and_humid',
        'light'
    ];
    constructor(macAddress:string,typeId:number,startDate:Date,endDate:Date,value:string){
        this.macAddress = macAddress;
        this.typeId = typeId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.value = value;
    }
    public static fromSnapshot(snapshot:firebase.firestore.DocumentSnapshot):Node{
        const data = snapshot.data();   
        if(data !== undefined){
            return new Node(snapshot.id,data.type_id,data.start_date,data.end_date,data.value);
        }else{
            throw new Error("snapshot.data() is undefined"); 
        }
        
    }
    toString():string{
        return `{ macAddress:'${this.macAddress}' , 
                  typeId:'${this.typeId}, 
                  startDate:'${this.startDate} ,
                  endDate:'${this.endDate},
                  value:'${this.value}
                }`;
    }
}

export default Node;
