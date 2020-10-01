import firebase from 'firebase'; 
class Node {
    id:string;
    macAddress: string;
    typeId:string;
    startDate:Date;
    endDate:Date;
    value:string;
    constructor(id:string,macAddress:string,typeId:string,startDate:Date,endDate:Date,value:string){
        this.id = id;
        this.macAddress = macAddress;
        this.typeId = typeId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.value = value;
    }
    public static fromSnapshot(snapshot:firebase.firestore.DocumentSnapshot):Node{
        const data = snapshot.data();   
        if(data !== undefined){
            return new Node(snapshot.id,data.mac_address,data.type_id.id,data.start_date,data.end_date,data.value);
        }else{
            throw new Error("snapshot.data() is undefined"); 
        }
        
    }
    toString():string{
        return `{ 
                  id:'${this.id}',
                  macAddress:'${this.macAddress}' , 
                  typeId:'${this.typeId}, 
                  startDate:'${this.startDate} ,
                  endDate:'${this.endDate},
                  value:'${this.value}
                }`;
    }
}

export default Node;
