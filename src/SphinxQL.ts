import QueryBuilder from './QueryBuilder';
import SphinxClient from './SphinxClient';

/**
 * 
 */
export default class SphinxQL {
  private client: SphinxClient;
  private queryBuilder: QueryBuilder;

  constructor(connection: SphinxClient) {
    this.connection = connection;
  }

  getConnection(): object {
    return this.connection;
  }

  setConnection(connection) {
    this.connection = connection;
  }

  static connect() {

  }

  static select() {
    return new this(connection);
  }
}
