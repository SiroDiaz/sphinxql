import StatementBuilderBase from '../StatementBuilderBase';

export default class GroupByExprStatement extends StatementBuilderBase {
  protected columnExprs: string[];
  
  constructor(columnExprs: string[]) {
    super();
    this.columnExprs = columnExprs;
  }

  public build(): String {
    return this.columnExprs.join(', ');
  }
}
