import ClientInterface from '../ClientInterface';

/**
 * TRUNCATE RTINDEX rtindex [WITH RECONFIGURE]
 */
export default class TruncateStatement {
  protected reconfigure: boolean = false;

  public constructor(protected connection: ClientInterface, protected rtIndex: string) {}

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

  /**
   * Run the query and returns a promise that can be accepted or rejected.
   */
  execute(): Promise<any> {
    return this.connection.execute(this.generate(), []);
  }
}
