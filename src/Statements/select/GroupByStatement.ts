import StatementBuilderBase from '../StatementBuilderBase';

export default class GroupByStatement extends StatementBuilderBase {
  protected columnExpr: string;
  protected order: string;
  protected readonly defaultOrder: string = 'DESC';

  constructor(columnsExpr: string | string[]) {
    super();
    this.columnExpr = columnsExpr;

  }

  public build(): String {
    return "";
  }
}
