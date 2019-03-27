import * as mysql from 'mysql2';
import ClientBase from './ClientBase';

/**
 * This implements the connection class for Sphinx/Manticore
 * client. It uses the same protocol that MySQL client.
 * 
 * Example usage:
 * const connection = SphinxConnection.getInstance(options)
 */
export default class SphinxClientPool extends ClientBase {
  public constructor(options: object) {
    super();
    this.connection = mysql.createPool(options);
  }

  public close(): void {}
};
