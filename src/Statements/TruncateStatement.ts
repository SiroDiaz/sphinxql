import ClientInterface from '../ClientInterface';
import BaseStatement from './BaseStatement';

/**
 * TRUNCATE RTINDEX rtindex [WITH RECONFIGURE]
 */
export default class TruncateStatement extends BaseStatement {
  protected reconfigure: boolean = false;

  public constructor(connection: ClientInterface, protected rtIndex: string) {
    super(connection);
  }

  /**
   * When RECONFIGURE option is used new tokenization, morphology,
   * and other text processing settings from config take effect
   * right after index got cleared. This allows to make operations atomic.
   */
  public withReconfigure(): TruncateStatement {
    this.reconfigure = true;
    return this;
  }

  /**
   * Generates the string statement.
   */
  generate(): string {
    let expression: string = `TRUNCATE RTINDEX ${this.rtIndex}`;
    if (this.reconfigure) {
      expression += ` WITH RECONFIGURE`;
    }
    
    return expression;
  }
}
