require ('es7-object-polyfill');
import { format } from 'sqlstring';
import StatementBuilderBase from '../StatementBuilderBase';
import Expression from '../Expression';


export default class OptionExprStatement implements StatementBuilderBase {
  protected option: string;
  protected value: any;

  constructor(option: string, value: any) {
    this.option = option;
    this.value = value;
  }

  public build(): string {
    let expression: string = `${this.option}=`;

    if (this.value instanceof Expression) {
      expression += this.value.getExpression();
    } else if (typeof this.value === 'object') {
      let values: any[] = [];
      for (const [key, value] of Object.entries(this.value)) {
        values = [...values, `${key}=${value}`];
      }
      expression += `(${values.join(',')})`;
    } else {
        expression += format('?', this.value);
    }

    return expression;
  }
}
