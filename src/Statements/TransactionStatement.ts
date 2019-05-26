import ClientInterface from '../ClientInterface';

export default class TransactionStatement {
  constructor(protected connection: ClientInterface) {}

  /**
   * Executes a COMMIT query and returns a promise.
   */
  public begin(): Promise<any> {
    return this.connection.query('BEGIN');
  }

  /**
   * Same than run begin method.
   */
  public start(): Promise<any> {
    return this.connection.query('START TRANSACTION');
  }

  /**
   * Executes a COMMIT query and returns a promise.
   */
  public commit(): Promise<any> {
    return this.connection.query('COMMIT');
  }

  /**
   * Executes a ROLLBACK query and returns a promise.
   */
  public rollback(): Promise<any> {
    return this.connection.query('ROLLBACK');
  }
}