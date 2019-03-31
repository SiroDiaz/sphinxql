import StatementBuilderBase from '../StatementBuilderBase';

export default class WhereStatement extends StatementBuilderBase {
  protected columnExpr: string;
  protected operator: string;
  protected value;

  constructor(columnExpr: string, operator: string, value: any) {
    super();
    this.columnExpr = columnExpr;
    this.operator = operator;
    this.value = value;
  }

  public build(): String {
    let expression : string = this.columnExpr;
    if (this.operator.includes('IN')) {
      expression += ` ${this.operator} (`;
    } else if (this.operator === 'BETWEEN') {
      expression += ` ${this.operator} ${this.value[0]} AND ${this.value[1]}`;
    } else {
      expression += ` ${this.operator} ${this.value}`;
    }

    return expression;
  }
}
