import * as mysql from 'mysql2';
import ClientBase from './ClientBase';

/**
 * This implements the connection class for Sphinx/Manticore
 * client. It uses the same protocol that MySQL client.
 * 
 * Example usage:
 * const connection = new SphinxClient(options);
 */
export default class SphinxClient extends ClientBase {
  public constructor(options: object) {
    super();
    this.connection = mysql.createConnection(options);
  }

  public close(): void {
    this.connection.end();
  }
};
