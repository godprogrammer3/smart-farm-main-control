import mariadb from "mariadb";
import dotenv from "dotenv";
import moment from "moment";
import RemoteDB from "../RemoteDB";
import { singleton } from "tsyringe";
import { container } from "tsyringe";
import NodeControlConfig from "../DataModel/NodeControlConfig";
import NodeSensorConfig from "../DataModel/NodeSensorConfig";
import firebase from "firebase";
dotenv.config();

@singleton()
class LocalDB {
  private DB_NAME: string = "smart_farm";
  private static pool: mariadb.Pool;
  private static remoteDB: RemoteDB;
  constructor() {
    LocalDB.pool = mariadb.createPool({
      host: "localhost",
      port: 3306,
      user: 'user',
      password: 'gly33140',
      database: "smart_farm",
      connectionLimit: 50,
    });
    LocalDB.remoteDB = container.resolve(RemoteDB);
  }
  public async addControlNode(
    mac_address: string,
    type_id: number
  ): Promise<void> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `INSERT INTO control(mac_address,type_id,start_date,status) 
            values (
            '${mac_address}',
            ${type_id},
            '${moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")}', 
            'running'
            )`;
      await conn.query(sql);
      conn.end();
    } catch (err) {
      throw err;
    }
  }
  public async getControlNode(): Promise<any> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `SELECT * FROM control;`;
      var result = await conn.query(sql);
      conn.end();
      return result;
    } catch (err) {
      throw err;
    }
  }
  public async getControlNodeById(id: string): Promise<any> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `SELECT * FROM control WHERE id = '${id}';`;
      var result = await conn.query(sql);
      conn.end();
      return result[0];
    } catch (err) {
      throw err;
    }
  }
  public async addSensorNode(
    mac_address: string,
    type_id: number
  ): Promise<void> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `INSERT INTO sensor(mac_address,type_id,start_date,status) 
            values (
            '${mac_address}',
            ${type_id},
            '${moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")}', 
            'running'
            )`;
      await conn.query(sql);
      conn.end();
    } catch (err) {
      throw err;
    }
  }
  public async getSensorNode(): Promise<any> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `SELECT * FROM sensor;`;
      var result = await conn.query(sql);
      conn.end();
      return result;
    } catch (err) {
      throw err;
    }
  }
  public async getSensorNodeById(id: string): Promise<any> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `SELECT * FROM sensor WHERE id = '${id}';`;
      var result = await conn.query(sql);
      conn.end();
      return result[0];
    } catch (err) {
      throw err;
    }
  }
  public async addControlNodeConfig(
    mac_address: string,
    log_interval: number
  ): Promise<void> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `INSERT INTO control_config(control_id,log_interval) 
            values (
            '${mac_address}',
            ${log_interval}
            )`;
      await conn.query(sql);
      conn.end();
    } catch (err) {
      throw err;
    }
  }
  public async addSensorNodeConfig(
    mac_address: string,
    log_interval: number
  ): Promise<void> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `INSERT INTO sensor_config(sensor_id,log_interval) 
            values (
            '${mac_address}',
            ${log_interval}
            )`;
      await conn.query(sql);
      conn.end();
    } catch (err) {
      throw err;
    }
  }
  public async getControlNodeConfig(): Promise<any> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `SELECT * FROM control_config;`;
      var result = await conn.query(sql);
      conn.end();
      return result;
    } catch (err) {
      throw err;
    }
  }
  public async getSensorNodeConfig(): Promise<any> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `SELECT * FROM sensor_config;`;
      var result = await conn.query(sql);
      conn.end();
      return result;
    } catch (err) {
      throw err;
    }
  }
  public async getSensorNodeConfigBySensorId(sensorId: String): Promise<any> {
    try {

      var conn = await LocalDB.pool.getConnection();
      var sql: string = `SELECT * FROM sensor_config WHERE sensor_id = '${sensorId}';`;
      var result = await conn.query(sql);
      conn.end();
      return result[0];
    } catch (err) {
      console.log('Error :', err);
      throw err;
    }
  }

  public async getControlNodeConfigById(id: String): Promise<any> {
    try {

      var conn = await LocalDB.pool.getConnection();
      var sql: string = `SELECT * FROM control_config WHERE id = '${id}';`;
      var result = await conn.query(sql);
      conn.end();
      return result[0];
    } catch (err) {
      console.log('Error :', err);
      throw err;
    }
  }


  public async getControlTypeById(id: string): Promise<any> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `SELECT * FROM control_type WHERE id = '${id}';`;
      var result = await conn.query(sql);
      conn.end();
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  public async getSensorTypeById(id: string): Promise<any> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `SELECT * FROM sensor_type WHERE id = '${id}';`;
      var result = await conn.query(sql);
      conn.end();
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  public async updateFromRemoteDB(): Promise<void> {
    await this.updateFarm();
    console.log("Updated farm succeed");
    await this.updateSensorTypeFromRemoteDB();
    console.log("Updated sensor_type succeed");
    await this.updateSensorConfigFromRemoteDB();
    console.log("Updated sensor_config succeed");
    await this.updateSensorFromRemoteDB();
    console.log("Updated sensor succeed");
    await this.updateControlTypeFromRemoteDB();
    console.log("Updated control_type succeed");
    await this.updateControlConfigFromRemoteDB();
    console.log("Updated control_config succeed");
    await this.updateControlFromRemoteDB();
    console.log("Updated control succeed");
  }

  public async getFarmInfo(): Promise<any> {
    try {
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `SELECT * FROM farm WHERE 1;`;
      var result = await conn.query(sql);
      conn.end();
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  public async updateSensorTypeFromRemoteDB(): Promise<void> {
    var firebaseApp = LocalDB.remoteDB.getInstance();
    var sensorTypes = await firebaseApp
      .firestore()
      .collection("sensor_type")
      .get();
    const sensorTypeIdList = sensorTypes.docs.map((document) => {
      return document.id;
    });
    var conn = await LocalDB.pool.getConnection();
    var delSQl = `DELETE FROM sensor_type WHERE id NOT IN (`;
    sensorTypeIdList.forEach((element) => {
      delSQl += `'${element}',`;
    });
    delSQl = delSQl.slice(0, -1);
    delSQl += ');'
    await conn.query(delSQl);
    sensorTypes.forEach(async (document) => {
      try {
        var sql: string = `
        INSERT INTO sensor_type(id, type) 
        values ('${document.id}', '${document.data().type}')
        ON DUPLICATE KEY 
        UPDATE  type = '${document.data().type}';
        `;
        var result = await conn.query(sql);
        conn.end();
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }
  public async updateSensorConfigFromRemoteDB(): Promise<void> {
    var firebaseApp = LocalDB.remoteDB.getInstance();
    var farmLocalDB: any = await this.getFarmInfo();
    var farmIdRef = firebaseApp
      .firestore()
      .collection("farm")
      .doc(farmLocalDB.id);
    var sensorConfigs = await firebaseApp
      .firestore()
      .collection("sensor_config")
      .where("farm_id", "==", farmIdRef)
      .get();
    const sensorConfigList = sensorConfigs.docs.map((document) => {
      return document.id;
    });
    var conn = await LocalDB.pool.getConnection();
    var delSQl = `DELETE FROM sensor_config WHERE id NOT IN (`;
    sensorConfigList.forEach((element) => {
      delSQl += `'${element}',`;
    });
    delSQl = delSQl.slice(0, -1);
    delSQl += ');'
    // console.log(delSQl);
    await conn.query(delSQl);
    sensorConfigs.forEach(async (document) => {
      try {
        var conn = await LocalDB.pool.getConnection();
        var sql: string = `
        INSERT INTO sensor_config(id, sensor_id, log_interval) 
        values ('${document.id}', '${document.data().sensor_id.id}' , ${document.data().log_interval
          })
        ON DUPLICATE KEY 
        UPDATE  sensor_id = '${document.data().sensor_id.id}', log_interval = ${document.data().log_interval
          };
        `;
        var result = await conn.query(sql);
        conn.end();
        firebaseApp.firestore().collection('sensor_config').doc(document.id).onSnapshot(this.updateSensorConfigBySnapshot);
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }

  public async updateSensorConfigBySnapshot(snapshot: firebase.firestore.DocumentSnapshot): Promise<void> {
    if (!snapshot.exists) {
      process.exit();
    }
    try {
      const senserConfig: NodeSensorConfig = NodeSensorConfig.fromSnapshot(snapshot);
      console.log("-> time stamp:", new Date().toLocaleString());
      console.log("-> Update sensor config");
      console.log(" -> id:", senserConfig.id);
      console.log(" -> sensor_id:", senserConfig.sensorId);
      console.log(" -> log_interval:", senserConfig.logInterval);
      var conn = await LocalDB.pool.getConnection();
      var sql: string = `
        UPDATE sensor_config
        SET 
          log_interval = ${senserConfig.logInterval}
        WHERE id = '${senserConfig.id}';
        `;
      await conn.query(sql);
      conn.end();
      return;
    } catch (err) {
      if (err.code == -1) {
        console.log(snapshot.id);
      }
    }
  }
  public async updateSensorFromRemoteDB(): Promise<void> {
    var firebaseApp = LocalDB.remoteDB.getInstance();
    var farmLocalDB: any = await this.getFarmInfo();
    var farmIdRef = firebaseApp
      .firestore()
      .collection("farm")
      .doc(farmLocalDB.id);

    var sensors = await firebaseApp
      .firestore()
      .collection("sensor")
      .where("farm_id", "==", farmIdRef)
      .get();
    const sensorList = sensors.docs.map((document) => {
      return document.id;
    });
    var conn = await LocalDB.pool.getConnection();
    var delSQl = `DELETE FROM sensor WHERE id NOT IN (`;
    sensorList.forEach((element) => {
      delSQl += `'${element}',`;
    });
    delSQl = delSQl.slice(0, -1);
    delSQl += ');'
    // console.log(delSQl);
    await conn.query(delSQl);
    sensors.forEach(async (document) => {
      var start_date: any = moment(new Date(document.data().start_date * 1000));
      start_date.set("year", start_date.year() - 1969);
      start_date =
        document.data().start_date != undefined
          ? start_date.format("YYYY-MM-DD HH:mm:ss")
          : null;
      var end_date: any = moment(new Date(document.data().end_date * 1000));
      end_date.set("year", end_date.year() - 1969);
      end_date =
        document.data().end_date != undefined
          ? end_date.format("YYYY-MM-DD HH:mm:ss")
          : null;
      try {
        var conn = await LocalDB.pool.getConnection();
        var sql: string = `
        INSERT INTO sensor(id, mac_address,start_date,end_date,status,type_id,value) 
        values ('${document.id}' , '${document.data().mac_address}',
              ${start_date != null ? `'${start_date}'` : null} , ${end_date != null ? `'${end_date}'` : null
          } , '${document.data().status}' , '${document.data().type_id.id}',
              '${document.data().value}'
              )
        ON DUPLICATE KEY 
        UPDATE   
        mac_address = '${document.data().mac_address}',
        start_date = ${start_date != null ? `'${start_date}'` : null
          } , end_date = ${end_date != null ? `'${end_date}'` : null
          } , status = '${document.data().status}' , type_id= '${document.data().type_id.id
          }',
        value = '${document.data().value}';
        `;
        var result = await conn.query(sql);
        conn.end();
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }

  public async updateControlTypeFromRemoteDB(): Promise<void> {
    var firebaseApp = LocalDB.remoteDB.getInstance();
    var controlTypes = await firebaseApp
      .firestore()
      .collection("control_type")
      .get();
    const controlTypeList = controlTypes.docs.map((document) => {
      return document.id;
    });
    var conn = await LocalDB.pool.getConnection();
    var delSQl = `DELETE FROM  control_type WHERE id NOT IN (`;
    controlTypeList.forEach((element) => {
      delSQl += `'${element}',`;
    });
    delSQl = delSQl.slice(0, -1);
    delSQl += ');'
    // console.log(delSQl);
    await conn.query(delSQl);
    controlTypes.forEach(async (document) => {
      try {
        var conn = await LocalDB.pool.getConnection();
        var sql: string = `
        INSERT INTO control_type(id, type) 
        values ('${document.id}', '${document.data().type}')
        ON DUPLICATE KEY 
        UPDATE  type = '${document.data().type}';
        `;
        var result = await conn.query(sql);
        conn.end();
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }
  public async updateControlConfigFromRemoteDB(): Promise<void> {
    var firebaseApp = LocalDB.remoteDB.getInstance();
    var farmLocalDB: any = await this.getFarmInfo();
    var farmIdRef = firebaseApp
      .firestore()
      .collection("farm")
      .doc(farmLocalDB.id);
    var controlConfigs = await firebaseApp
      .firestore()
      .collection("control_config")
      .where("farm_id", "==", farmIdRef)
      .get();
    const controlConfigList = controlConfigs.docs.map((document) => {
      return document.id;
    });
    var conn = await LocalDB.pool.getConnection();
    var delSQl = `DELETE FROM  control_config WHERE id NOT IN (`;
    controlConfigList.forEach((element) => {
      delSQl += `'${element}',`;
    });
    delSQl = delSQl.slice(0, -1);
    delSQl += ');'
    // console.log(delSQl);
    await conn.query(delSQl);
    controlConfigs.forEach(async (document) => {
      try {
        var conn = await LocalDB.pool.getConnection();
        const controlConfig: NodeControlConfig = NodeControlConfig.fromSnapshot(document);
        var sql: string = `
        INSERT INTO control_config(id, control_id, start_cron_time , end_cron_time ,value) 
        values ('${controlConfig.id}', '${controlConfig.controlId}' , '${controlConfig.startCronTime
          }','${controlConfig.endCronTime}','${controlConfig.value}'
        
        )
        ON DUPLICATE KEY 
        UPDATE  control_id = '${controlConfig.controlId
          }',
        start_cron_time = '${controlConfig.startCronTime}',
        end_cron_time = '${controlConfig.endCronTime}',
        value = '${controlConfig.value}'
        ;
        `;
        var result = await conn.query(sql);
        conn.end();
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }
  public async updateControlFromRemoteDB(): Promise<void> {
    var firebaseApp = LocalDB.remoteDB.getInstance();
    var farmLocalDB: any = await this.getFarmInfo();
    var farmIdRef = firebaseApp
      .firestore()
      .collection("farm")
      .doc(farmLocalDB.id);
    var controls = await firebaseApp
      .firestore()
      .collection("control")
      .where("farm_id", "==", farmIdRef)
      .get();
    const controlList = controls.docs.map((document) => {
      return document.id;
    });
    var conn = await LocalDB.pool.getConnection();
    var delSQl = `DELETE FROM  control WHERE id NOT IN (`;
    controlList.forEach((element) => {
      delSQl += `'${element}',`;
    });
    delSQl = delSQl.slice(0, -1);
    delSQl += ');'
    // console.log(delSQl);
    await conn.query(delSQl);
    controls.forEach(async (document) => {
      var start_date: any = moment(new Date(document.data().start_date * 1000));
      start_date.set("year", start_date.year() - 1969);
      start_date =
        document.data().start_date != undefined
          ? start_date.format("YYYY-MM-DD HH:mm:ss")
          : null;
      var end_date: any = moment(new Date(document.data().end_date * 1000));
      end_date.set("year", end_date.year() - 1969);
      end_date =
        document.data().end_date != undefined
          ? end_date.format("YYYY-MM-DD HH:mm:ss")
          : null;
      try {
        var conn = await LocalDB.pool.getConnection();
        var sql: string = `
        INSERT INTO control(id, mac_address,start_date,end_date,status,type_id,value) 
        values ('${document.id}', '${document.data().mac_address}',
              ${start_date != null ? `'${start_date}'` : null} , ${end_date != null ? `'${end_date}'` : null
          } , '${document.data().status}' , '${document.data().type_id.id}',
              '${document.data().value}'
              )
        ON DUPLICATE KEY 
        UPDATE  id = '${document.id}',  
        mac_address = '${document.data().mac_address}',
        start_date = ${start_date != null ? `'${start_date}'` : null
          } , end_date = ${end_date != null ? `'${end_date}'` : null
          } , status = '${document.data().status}' , type_id= '${document.data().type_id.id
          }',
        value = '${document.data().value}';
        `;
        var result = await conn.query(sql);
        conn.end();
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }

  public async updateFarm(): Promise<void> {
    const conn = await LocalDB.pool.getConnection();
    const farmInfo = await this.getFarmInfo();
    var firebaseApp = LocalDB.remoteDB.getInstance();
    var farmDocument = await firebaseApp
      .firestore()
      .collection("farm")
      .doc(farmInfo.id)
      .get();
    const data = farmDocument.data();
    if (data != undefined) {
      var date: any = moment(new Date(data.date * 1000));
      date.set("year", date.year() - 1969);
      date =
        data.date != undefined
          ? date.format("YYYY-MM-DD HH:mm:ss")
          : null;
      var updateSql = `
        UPDATE farm
        SET
          date = '${date}',
          name = '${data.name}',
          plant_type = '${data.plant_type}',
          serial_key = '${data.serial_key}'
        WHERE id = '${farmInfo.id}';
        `;
      await conn.query(updateSql);
      firebaseApp.firestore().collection('farm').doc(farmInfo.id).onSnapshot(this.farmCommandHandler);
    }


    conn.end();
    return;
  }

  public async farmCommandHandler(snapshot: firebase.firestore.DocumentSnapshot): Promise<void> {
    if (!snapshot.exists) {
      process.exit();
    }
    const data = snapshot.data();
    if (data != undefined) {
      console.log("-> time stamp:", new Date().toLocaleString());
      console.log("-> update farm command");
      console.log(" -> restart_commnad:", data.restart_command);
      if (data.restart_command.status == 'waiting') {
        const jsonData = {
          restart_command: {
            status: "successed",
            time: firebase.firestore.Timestamp.fromDate(new Date())
          }
        };
        await LocalDB.remoteDB.updateDocument('farm', snapshot.id,
          JSON.parse(JSON.stringify(jsonData))
        );
        process.exit();
      }
    }
  }
}

export default LocalDB;
