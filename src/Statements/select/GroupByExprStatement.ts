import StatementBuilderBase from '../StatementBuilderBase';

export default class GroupByExprStatement implements StatementBuilderBase {
  protected columnExprs: string[];
  
  constructor(columnExprs: string[]) {
    this.columnExprs = columnExprs;
  }

  public build(): String {
    return this.columnExprs.join(', ');
  }
}
