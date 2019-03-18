import * as mysql from 'mysql2';
import ClientBase from './ClientBase';
import ClientInterface from './ClientInterface';

/**
 * This implements the connection class for Sphinx/Manticore
 * client. It uses the same protocol that MySQL client.
 * 
 * Example usage:
 * const connection = SphinxConnection.getInstance(options)
 */
export default class SphinxClient extends ClientBase implements ClientInterface {
  private constructor(options: object) {
    super();
    this.connection = mysql.createConnection(options);

  }

  /**
   * Singleton pattern for connection with the Sphinx/Manticore client.
   *
   * @param options connection configuration object.
   */
  public static getInstance(options: object): ClientBase {
    if (ClientBase.instance == null) {
      ClientBase.instance = new this(options);
    }

    return ClientBase.instance;
  }

  /**
   * Checks if there is a Sphinx client created.
   */
  public static existsInstance(): Boolean {
    return ClientBase.instance != null;
  }

  /**
   * Creates/updates a connection instance. If there is an existing
   * connection it is replaced.
   *
   * @param options new configuration object for the connection.
   */
  public static set(options: object): void {
    ClientBase.instance = new this(options);
  }
  
  public query(query: String): Promise<any> {
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

  public close(): void {
    this.connection.end();
  }
};
