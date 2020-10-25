import firebase from 'firebase'; 
class Node {
    id:string;
    macAddress: string;
    typeId:string;
    startDate:Date;
    endDate:Date;
    status:string;
    value:string;
    constructor(id:string,macAddress:string,typeId:string,startDate:Date,endDate:Date,status:string,value:string){
        this.id = id;
        this.macAddress = macAddress;
        this.typeId = typeId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status
        this.value = value;
    }
    public static fromSnapshot(snapshot:firebase.firestore.DocumentSnapshot):Node{
        const data = snapshot.data();   
        if(data !== undefined){
            return new Node(snapshot.id,data.mac_address,data.type_id.id,data.start_date,data.end_date,data.status,data.value);
        }else{
            throw new Error("Node snapshot.data() is undefined"); 
        }
        
    }
    public static fromLocalDB(data:any):Node{
        if(data !== undefined){
            return new Node(data.id,data.mac_address,data.type_id,data.start_date??new Date(data.start_date),data.end_date??new Date(data.end_date),data.status,data.value);
        }else{
            throw new Error("Node data is undefined"); 
        }
        
    }
    toString():string{
        return `{ 
                  id:'${this.id}',
                  macAddress:'${this.macAddress}' , 
                  typeId:'${this.typeId}', 
                  startDate:'${this.startDate}' ,
                  endDate:'${this.endDate}',
                  status:'${this.status}',
                  value:'${this.value}
                }`;
    }
}

export default Node;
