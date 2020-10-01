import mariadb from "mariadb";
import dotenv from "dotenv";
import moment from "moment";
import RemoteDB from "../RemoteDB";
dotenv.config();
class LocalDB {
  private DB_NAME: string = "smart_farm";
  private pool: mariadb.Pool;
  private remoteDB: RemoteDB;
  constructor() {
    this.pool = mariadb.createPool({
      host: "localhost",
      port: 3307,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "smart_farm",
      connectionLimit: 50,
    });
    this.remoteDB = new RemoteDB();
  }
  public async addControlNode(
    mac_address: string,
    type_id: number
  ): Promise<void> {
    try {
      var conn = await this.pool.getConnection();
      var sql: string = `INSERT INTO control(mac_address,type_id,start_date,status) 
            values (
            '${mac_address}',
            ${type_id},
            '${moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")}', 
            'running'
            )`;
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw err;
    }
  }
  public async getControlNode(): Promise<any> {
    try {
      var conn = await this.pool.getConnection();
      var sql: string = `SELECT * FROM control;`;
      var result = await conn.query(sql);
      return result;
    } catch (err) {
      throw err;
    }
  }
  public async addSensorNode(
    mac_address: string,
    type_id: number
  ): Promise<void> {
    try {
      var conn = await this.pool.getConnection();
      var sql: string = `INSERT INTO sensor(mac_address,type_id,start_date,status) 
            values (
            '${mac_address}',
            ${type_id},
            '${moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")}', 
            'running'
            )`;
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw err;
    }
  }
  public async getSensorNode(): Promise<any> {
    try {
      var conn = await this.pool.getConnection();
      var sql: string = `SELECT * FROM sensor;`;
      var result = await conn.query(sql);
      return result;
    } catch (err) {
      throw err;
    }
  }
  public async getSensorNodeById(id: string): Promise<any> {
    try {
      var conn = await this.pool.getConnection();
      var sql: string = `SELECT * FROM sensor WHERE id = '${id}';`;
      var result = await conn.query(sql);
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
      var conn = await this.pool.getConnection();
      var sql: string = `INSERT INTO control_config(control_id,log_interval) 
            values (
            '${mac_address}',
            ${log_interval}
            )`;
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw err;
    }
  }
  public async addSensorNodeConfig(
    mac_address: string,
    log_interval: number
  ): Promise<void> {
    try {
      var conn = await this.pool.getConnection();
      var sql: string = `INSERT INTO sensor_config(sensor_id,log_interval) 
            values (
            '${mac_address}',
            ${log_interval}
            )`;
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw err;
    }
  }
  public async getSensorNodeConfig(): Promise<any> {
    try {
      var conn = await this.pool.getConnection();
      var sql: string = `SELECT * FROM sensor_config;`;
      var result = await conn.query(sql);
      return result;
    } catch (err) {
      throw err;
    }
  }

  public async getControlTypeById(id: string): Promise<any> {
    try {
      var conn = await this.pool.getConnection();
      var sql: string = `SELECT * FROM control_type WHERE id = '${id}';`;
      var result = await conn.query(sql);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  public async getSensorTypeById(id: string): Promise<any> {
    try {
      var conn = await this.pool.getConnection();
      var sql: string = `SELECT * FROM sensor_type WHERE id = '${id}';`;
      var result = await conn.query(sql);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  public async updateFromRemoteDB(): Promise<void> {
    await this.updateSensorTypeFromRemoteDB();
    await this.updateSensorConfigFromRemoteDB();
    await this.updateSensorFromRemoteDB();
    await this.updateControlTypeFromRemoteDB();
    await this.updateControlConfigFromRemoteDB();
  }

  public async getFarmInfo(): Promise<any> {
    try {
      var conn = await this.pool.getConnection();
      var sql: string = `SELECT * FROM farm WHERE 1;`;
      var result = await conn.query(sql);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  public async updateSensorTypeFromRemoteDB(): Promise<void> {
    var firebaseApp = this.remoteDB.getInstance();
    var sensorTypes = await firebaseApp
      .firestore()
      .collection("sensor_type")
      .get();
    sensorTypes.forEach(async (document) => {
      try {
        var conn = await this.pool.getConnection();
        var sql: string = `
        INSERT INTO sensor_type(id, type, display_type) 
        values ('${document.id}', '${document.data().type}' , '${
          document.data().display_type
        }')
        ON DUPLICATE KEY 
        UPDATE  type = '${document.data().type}', display_type = '${
          document.data().display_type
        }';
        `;
        var result = await conn.query(sql);
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }
  public async updateSensorConfigFromRemoteDB(): Promise<void> {
    var firebaseApp = this.remoteDB.getInstance();
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
    sensorConfigs.forEach(async (document) => {
      try {
        var conn = await this.pool.getConnection();
        var sql: string = `
        INSERT INTO sensor_config(id, sensor_id, log_interval) 
        values ('${document.id}', '${document.data().sensor_id.id}' , ${
          document.data().log_interval
        })
        ON DUPLICATE KEY 
        UPDATE  sensor_id = '${document.data().sensor_id.id}', log_interval = ${
          document.data().log_interval
        };
        `;
        var result = await conn.query(sql);
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }
  public async updateSensorFromRemoteDB(): Promise<void> {
    var firebaseApp = this.remoteDB.getInstance();
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
        var conn = await this.pool.getConnection();
        var sql: string = `
        INSERT INTO sensor(id, mac_address,start_date,end_date,status,type_id,value) 
        values ('${document.id}' , '${document.data().mac_address}',
              ${start_date != null ? `'${start_date}'` : null} , ${
          end_date != null ? `'${end_date}'` : null
        } , '${document.data().status}' , '${document.data().type_id.id}',
              '${document.data().value}'
              )
        ON DUPLICATE KEY 
        UPDATE  id = '${document.id}', 
        mac_address = '${document.data().mac_address}',
        start_date = ${
          start_date != null ? `'${start_date}'` : null
        } , end_date = ${
          end_date != null ? `'${end_date}'` : null
        } , status = '${document.data().status}' , type_id= '${
          document.data().type_id.id
        }',
        value = '${document.data().value}';
        `;
        var result = await conn.query(sql);
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }

  public async updateControlTypeFromRemoteDB(): Promise<void> {
    var firebaseApp = this.remoteDB.getInstance();
    var controlTypes = await firebaseApp
      .firestore()
      .collection("control_type")
      .get();
    controlTypes.forEach(async (document) => {
      try {
        var conn = await this.pool.getConnection();
        var sql: string = `
        INSERT INTO control_type(id, type, display_type) 
        values ('${document.id}', '${document.data().type}' , '${
          document.data().display_type
        }')
        ON DUPLICATE KEY 
        UPDATE  type = '${document.data().type}', display_type = '${
          document.data().display_type
        }';
        `;
        var result = await conn.query(sql);
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }
  public async updateControlConfigFromRemoteDB(): Promise<void> {
    var firebaseApp = this.remoteDB.getInstance();
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
    controlConfigs.forEach(async (document) => {
      try {
        var conn = await this.pool.getConnection();
        var sql: string = `
        INSERT INTO control_config(id, control_id, log_interval) 
        values ('${document.id}', '${document.data().control_id.id}' , ${
          document.data().log_interval
        })
        ON DUPLICATE KEY 
        UPDATE  control_id = '${
          document.data().control_id.id
        }', log_interval = ${document.data().log_interval};
        `;
        var result = await conn.query(sql);
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }
  public async updateControlFromRemoteDB(): Promise<void> {
    var firebaseApp = this.remoteDB.getInstance();
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
        var conn = await this.pool.getConnection();
        var sql: string = `
        INSERT INTO control(id, farm_id, mac_address,start_date,end_date,status,type_id,value) 
        values ('${document.id}', '${document.data().farm_id.id}' , '${
          document.data().mac_address
        }',
              ${start_date != null ? `'${start_date}'` : null} , ${
          end_date != null ? `'${end_date}'` : null
        } , '${document.data().status}' , '${document.data().type_id.id}',
              '${document.data().value}'
              )
        ON DUPLICATE KEY 
        UPDATE  id = '${document.id}',  farm_id = '${
          document.data().farm_id.id
        }' , mac_address = '${document.data().mac_address}',
        start_date = ${
          start_date != null ? `'${start_date}'` : null
        } , end_date = ${
          end_date != null ? `'${end_date}'` : null
        } , status = '${document.data().status}' , type_id= '${
          document.data().type_id.id
        }',
        value = '${document.data().value}';
        `;
        var result = await conn.query(sql);
        return result[0];
      } catch (err) {
        throw err;
      }
    });
  }
}

export default LocalDB;
