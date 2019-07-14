import ClientInterface from '../ClientInterface';

/**
 * RELOAD INDEX idx [ FROM '/path/to/index_files' ]
 */
export default class OptimizeIndexStatement {
  public constructor(protected connection: ClientInterface, protected index: string) {}

  /**
   * Generates the string statement.
   */
  generate(): string {
    return `OPTIMIZE INDEX ${this.index}`;
  }

  /**
   * Run the query and returns a promise that can be accepted or rejected.
   */
  execute(): Promise<any> {
    return this.connection.execute(this.generate(), []);
  }
}
