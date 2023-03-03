import BaseStatement from './BaseStatement';

/**
 * FLUSH RTINDEX rtindex
 */
export default class FlushRTIndexStatement extends BaseStatement {
  public constructor(protected readonly index: string) {
    super();
  }

  /**
   * Generates the string statement.
   */
  generate(): string {
    return `FLUSH RTINDEX ${this.index}`;
  }
}
