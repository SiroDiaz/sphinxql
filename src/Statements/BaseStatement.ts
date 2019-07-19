import ClientInterface from '../ClientInterface';

export default abstract class BaseStatement {
  protected connection: ClientInterface;

  constructor(connection: ClientInterface) {
    this.connection = connection;
  }

  /**
   * Generates the string statement and returns it.
   */
  abstract generate(): string;

  /**
   * Run the query and returns a promise that can be accepted or rejected.
   */
  public execute(): Promise<any> {
    return this.connection.execute(this.generate(), []);
  }
}