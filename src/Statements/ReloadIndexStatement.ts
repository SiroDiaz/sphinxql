import ClientInterface from '../ClientInterface';

/**
 * RELOAD INDEX idx [ FROM '/path/to/index_files' ]
 */
export default class ReloadIndexStatement {
  protected path: string;

  public constructor(protected connection: ClientInterface, protected index: string) {}

  /**
   * Specifies the path of the index file. This is an option method.
   */
  public from(path: string): ReloadIndexStatement {
    this.path = path;

    return this;
  }

  /**
   * Generates the string statement.
   */
  generate(): string {
    let expression: string = `RELOAD INDEX ${this.index}`;
    if (this.path !== undefined) {
      expression += ` FROM '${this.path}'`;
    }
    
    return expression;
  }

  /**
   * Run the query and returns a promise that can be accepted or rejected.
   */
  execute(): Promise<any> {
    return this.connection.execute(this.generate(), []);
  }
}
