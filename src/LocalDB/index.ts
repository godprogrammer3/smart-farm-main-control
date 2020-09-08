import mariadb from "mariadb";
import dotenv from "dotenv";
import moment from "moment";
dotenv.config();
class LocalDB {
  private DB_NAME: string = "smart_farm";
  private pool: mariadb.Pool;
  constructor() {
    this.pool = mariadb.createPool({
      host: "localhost",
      port: 3307,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "smart_farm",
      connectionLimit: 50,
    });
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
  public async getSensorNodeById(macAddress:string): Promise<any> {
    try {
      var conn = await this.pool.getConnection();
      var sql: string = `SELECT * FROM sensor WHERE mac_address = '${macAddress}';`;
      var result = await conn.query(sql);
      return result;
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


}

export default LocalDB;
