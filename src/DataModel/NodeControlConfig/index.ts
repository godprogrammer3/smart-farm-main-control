import firebase from 'firebase';
class NodeControlConfig {
    id: string;
    controlId: string;
    value: string;
    startCronTime: string;
    endCronTime: string;
    constructor(id: string, controlId: string, startCronTime: string, endCronTime: string, value: string) {
        this.id = id;
        this.controlId = controlId;
        this.startCronTime = startCronTime;
        this.endCronTime = endCronTime;
        this.value = value;
    }
    public static fromSnapshot(snapshot: firebase.firestore.DocumentSnapshot): NodeControlConfig {
        const data = snapshot.data();
        if (data !== undefined) {
            return new NodeControlConfig(snapshot.id, data.control_id.id, data.toggle_interval.start, data.toggle_interval.end, data.value);
        } else {
            throw new Error("Error : Node_control_config snapshot.data() is undefined");
        }

    }
    public static fromLocalDB(data: any): NodeControlConfig {
        if (data) {
            return new NodeControlConfig(data.id, data.control_id, data.start_cron_time, data.end_cron_time, data.value);
        } else {
            console.log('Error : NodeControlConfig data of localDB is undefine or null');
            throw new Error('NodeControlConfig data of localDB is undefine or null');
        }

    }
    toString(): string {
        return `{ 
                  id:'${this.id}',
                  controlId:'${this.controlId}' , 
                  startCronTime:'${this.startCronTime}, 
                  endCtronTime:'${this.endCronTime} ,
                  value:'${this.value}
                }`;
    }
}

export default NodeControlConfig;
