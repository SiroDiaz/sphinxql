import StatementBuilderBase from '../StatementBuilderBase';

export default class GroupByStatement extends StatementBuilderBase {
  protected columnExpr;

  constructor(columnsExpr: Array<string|any>) {
    super();
    this.columnExpr = columnsExpr;
  }

  public build(): String {
    return "";
  }
}