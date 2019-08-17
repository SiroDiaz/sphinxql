import ClientInterface from './ClientInterface';

export default abstract class ClientBase implements ClientInterface {
  public connection;

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

  public close(): void {}
}
