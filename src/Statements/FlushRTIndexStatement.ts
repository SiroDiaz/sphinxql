import ClientInterface from '../ClientInterface';
import BaseStatement from './BaseStatement';

/**
 * FLUSH RTINDEX rtindex
 */
export default class FlushRTIndexStatement extends BaseStatement {
  public constructor(connection: ClientInterface, protected readonly index: string) {
    super(connection);
  }

  /**
   * Generates the string statement.
   */
  generate(): string {
    return `FLUSH RTINDEX ${this.index}`;
  }
}
