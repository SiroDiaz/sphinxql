import ClientInterface from '../ClientInterface';

/**
 * ATTACH INDEX diskindex TO RTINDEX rtindex [WITH TRUNCATE]
 */
export default class AttachIndexStatement {
  protected rtIndex: string;
  protected truncate: boolean = false;

  public constructor(protected connection: ClientInterface, protected diskIndex: string) {}

  /**
   * The target real-time index to attach the disk index
   */
  public to(rtIndex: string): AttachIndexStatement {
    this.rtIndex = rtIndex;

    return this;
  }

  /**
   * When TRUNCATE option is used RT index got truncated prior to attaching source disk index.
   * This allows to make operation atomic or make sure that attached source disk index
   * will be only data at target RT index.
   */
  public withTruncate(): AttachIndexStatement {
    this.truncate = true;
    return this;
  }

  /**
   * Generates the string statement.
   */
  generate(): string {
    let expression: string = `ATTACH INDEX ${this.diskIndex} TO RTINDEX ${this.rtIndex}`;
    if (this.truncate) {
      expression += ` WITH TRUNCATE`;
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
