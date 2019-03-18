import * as mysql from 'mysql2';
import ClientInterface from './ClientInterface';

/**
 * This implements the connection class for Sphinx/Manticore
 * client. It uses the same protocol that MySQL client.
 * 
 * Example usage:
 * const connection = SphinxConnection.getInstance(options)
 */
export default class SphinxClientPool implements ClientInterface {
  public connection;
  private static instance: SphinxClientPool | null = null;

  private constructor(options: object) {
    super();
    this.connection = mysql.createPool(options);
  }

  /**
   * Singleton pattern for connection with the Sphinx/Manticore client.
   *
   * @param options connection configuration object.
   */
  public static getInstance(options: object): SphinxClient {
    if (SphinxClient.instance == null) {
      SphinxClient.instance = new this(options);
    }

    return SphinxClient.instance;
  }

  /**
   * Checks if there is a Sphinx client created.
   */
  public static existsInstance(): Boolean {
    return SphinxClient.instance != null;
  }

  /**
   * Creates/updates a connection instance. If there is an existing
   * connection it is replaced.
   *
   * @param options new configuration object for the connection.
   */
  public static set(options: object): void {
    SphinxClient.instance = new this(options);
  }
  
  public query(query: String): Promise<any> {
    console.log(query);
    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, results, fields) => {
        if (error) {
          return reject(error);
        }

        interface QueryResult {
          results?: any;
          fields?: any;
        }

        const queryResult: QueryResult = {results: results, fields: fields};
        return resolve(queryResult);
      });
    });
  }

  public ping(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.ping(error => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }

  public execute(query: String, values: Array<any>) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (error, results, fields) => {
        if (error) {
          return reject(error);
        }

        interface QueryResult {
          results?: any;
          fields?: any;
        }

        const queryResult: QueryResult = {results: results, fields: fields};
        return resolve(queryResult);
      });
    });
  }

  public close(): void {}
};
