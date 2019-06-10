import ClientInterface from './ClientInterface';
import QueryBuilder from './QueryBuilder';
import SphinxClient from './SphinxClient';
import SphinxClientPool from './SphinxClientPool';

export default class Sphinxql {
  protected connection: ClientInterface;

  public constructor(connection: ClientInterface) {
    this.connection = connection;
  }

  /**
   * Returns the client connection instance.
   */
  public getConnection() : ClientInterface {
    return this.connection;
  }

  /**
   * Gets the query builder instance. Then you can start building
   * the query.
   */
  public getQueryBuilder() : QueryBuilder {
    return new QueryBuilder(this.connection);
  }
  
  /**
   * Creates a client connection and returns an instance of this class.
   * 
   * @param params object containing 
   */
  public static createConnection(params: object): Sphinxql {
    const client = new SphinxClient(params);
    return new Sphinxql(client);
  }

  /**
   * Creates a client pool connection and returns an instance of this class.
   * 
   * @param params an object containing the MySQL client connection properties
   */
  public static createPoolConnection(params: object) : Sphinxql {
    const client = new SphinxClientPool(params);
    return new Sphinxql(client);
  }
}
