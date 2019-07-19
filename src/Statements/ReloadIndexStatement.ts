import ClientInterface from '../ClientInterface';
import BaseStatement from './BaseStatement';

/**
 * RELOAD INDEX idx [ FROM '/path/to/index_files' ]
 */
export default class ReloadIndexStatement extends BaseStatement {
  protected path: string;

  public constructor(connection: ClientInterface, protected index: string) {
    super(connection);
  }

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
}
