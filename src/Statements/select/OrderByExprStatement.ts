import StatementBuilderBase from '../StatementBuilderBase';

export default class OrderByExprStatement extends StatementBuilderBase {
  protected columnExpr: string;
  protected order: string;
  protected readonly defaultOrder: string = 'DESC';

  constructor(columnExpr: string, order?: string) {
    super();
    if (!columnExpr.length) {
      throw Error(`column/expression can't be empty`);
    }
    this.columnExpr = columnExpr;
    this.order = order;
  }

  public build(): String {
    if (this.order) {
      return `${this.columnExpr} ${this.order}`;
    }

    return `${this.columnExpr} ${this.defaultOrder}`;
  }
}
