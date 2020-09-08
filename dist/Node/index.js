"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(macAddress, typeId, startDate, endDate, value) {
        this.macAddress = macAddress;
        this.typeId = typeId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.value = value;
    }
    static fromSnapshot(snapshot) {
        const data = snapshot.data();
        if (data !== undefined) {
            return new Node(snapshot.id, data.type_id, data.start_date, data.end_date, data.value);
        }
        else {
            throw new Error("snapshot.data() is undefined");
        }
    }
    toString() {
        return `{ macAddress:'${this.macAddress}' , 
                  typeId:'${this.typeId}, 
                  startDate:'${this.startDate} ,
                  endDate:'${this.endDate},
                  value:'${this.value}
                }`;
    }
}
exports.default = Node;
