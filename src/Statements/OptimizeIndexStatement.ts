import ClientInterface from '../ClientInterface';
import BaseStatement from './BaseStatement';

/**
 * RELOAD INDEX idx [ FROM '/path/to/index_files' ]
 */
export default class OptimizeIndexStatement extends BaseStatement {
  public constructor(connection: ClientInterface, protected index: string) {
    super(connection);
  }

  /**
   * Generates the string statement.
   */
  generate(): string {
    return `OPTIMIZE INDEX ${this.index}`;
  }
}
