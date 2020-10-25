class NodeControlType{
    id:string;
    type:string;
    defaultValue:string;
    constructor(id:string , type:string , defaultValue:string){
        this.id = id;
        this.type = type;
        this.defaultValue = defaultValue;
    }

    public static fromLocalDB(data:any):NodeControlType{
        return new NodeControlType(data.id,data.type,data.default_value);
    }

}

export default NodeControlType;