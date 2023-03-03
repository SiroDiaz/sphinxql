import BaseStatement from './BaseStatement';

/**
 * ATTACH INDEX diskindex TO RTINDEX rtindex [WITH TRUNCATE]
 */
export default class AttachIndexStatement extends BaseStatement {
  protected rtIndex: string;
  protected truncate = false;

  public constructor(protected diskIndex: string) {
    super();
  }

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
    let expression = `ATTACH INDEX ${this.diskIndex} TO RTINDEX ${this.rtIndex}`;
    if (this.truncate) {
      expression += ` WITH TRUNCATE`;
    }

    return expression;
  }
}
