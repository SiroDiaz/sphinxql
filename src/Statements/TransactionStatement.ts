export default class TransactionStatement {
  public begin(): string {
    return 'BEGIN';
  }

  public start(): string {
    return 'START TRANSACTION';
  }

  /**
   * Executes a COMMIT query and returns a promise.
   */
  public commit(): string {
    return 'COMMIT';
  }

  /**
   * Executes a ROLLBACK query and returns a promise.
   */
  public rollback(): string {
    return 'ROLLBACK';
  }
}
