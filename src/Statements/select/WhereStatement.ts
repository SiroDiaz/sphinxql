import { escape, format } from 'sqlstring';
import Expression from '../Expression';
import StatementBuilderBase from '../StatementBuilderBase';

export default class WhereStatement extends StatementBuilderBase {
  protected columnExpr: string;
  protected operator: string;
  protected value;

  constructor(columnExpr: string, operator: string, value: any) {
    super();
    if (!columnExpr.length) {
      throw Error(`column name can't be empty`);
    }
    this.columnExpr = columnExpr;
    this.operator = operator;
    this.value = value;
  }

  public build(): String {
    let expression : string = this.columnExpr;

    if (this.operator.includes('IN')) {
      expression += ` ${this.buildIn()}`;
    } else if (this.operator === 'BETWEEN') {
      expression += this.buildBetween();
    } else {
      expression += this.buildCondition();
    }

    return expression;
  }

  protected static getExpressionCompare(value: any) {
    if (value instanceof Expression) {
      return value.getExpression();
    }
    if (typeof value === 'string') {
      return escape(value);
    }
    if (typeof value === 'number') {
      return value;
    }

    return value;
  }

  protected buildIn(): string {
    let expression : string = '';
    expression += `${this.operator} `;
    const values: string = '?'.repeat(this.value.length)
      .split('')
      .join(', ');
    expression += `(${format(values, this.value)})`;

    return expression;
  }

  protected buildBetween(): string {
    return format(` ${this.operator} ? AND ?`, this.value);
  }

  protected buildCondition(): string {
    return format(` ${this.operator} ?`, this.value);
  }
}
