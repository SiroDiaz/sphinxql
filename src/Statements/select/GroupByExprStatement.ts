import StatementBuilderBase from '../StatementBuilderBase';

export default class GroupByExprStatement extends StatementBuilderBase {
  protected columnExpr: string;
  protected order: string;
  protected readonly defaultOrder: string = 'DESC';

  constructor(columnExpr: string, order?: string) {
    super();
    this.columnExpr = columnExpr;
    this.order = order;
  }

  public build(): String {
    console.log('CADENA: ', this.order);
    if (this.order !== undefined) {
      return ``;
    }

    return ``;
  }
}
