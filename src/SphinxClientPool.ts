import * as mysql from 'mysql2';
import ClientBase from './ClientBase';

/**
 * This implements the connection class for Sphinx/Manticore
 * client with pooling. It uses the same protocol that MySQL client.
 * options object can be found in the mysql2 README file:
 * https://github.com/sidorares/node-mysql2
 *
 * Example usage:
 * const connection = new SphinxClientPool(options);
 */
export default class SphinxClientPool extends ClientBase {
  public constructor(options: object) {
    super();
    this.connection = mysql.createPool(options);
  }
};
