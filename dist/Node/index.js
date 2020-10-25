"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(id, macAddress, typeId, startDate, endDate, value) {
        this.id = id;
        this.macAddress = macAddress;
        this.typeId = typeId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.value = value;
    }
    static fromSnapshot(snapshot) {
        const data = snapshot.data();
        if (data !== undefined) {
            return new Node(snapshot.id, data.mac_address, data.type_id.id, data.start_date, data.end_date, data.value);
        }
        else {
            throw new Error("snapshot.data() is undefined");
        }
    }
    toString() {
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
exports.default = Node;
