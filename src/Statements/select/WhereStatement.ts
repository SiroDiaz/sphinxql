import StatementBuilderBase from '../StatementBuilderBase';

export default class WhereStatement extends StatementBuilderBase {
  protected columnExpr;
  protected operator;
  protected value;

  constructor(columnExpr: any, operator: any, value: any) {
    super();
    this.columnExpr = columnExpr;
    this.operator = operator;
    this.value = value;
  }

  public build(): String {
    return '';
  }
}