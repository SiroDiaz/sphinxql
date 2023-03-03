import BaseStatement from './BaseStatement';

/**
 * RELOAD INDEX idx [ FROM '/path/to/index_files' ]
 */
export default class OptimizeIndexStatement extends BaseStatement {
  public constructor(protected index: string) {
    super();
  }

  /**
   * Generates the string statement.
   */
  generate(): string {
    return `OPTIMIZE INDEX ${this.index}`;
  }
}
