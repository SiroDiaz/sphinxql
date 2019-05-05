import { raw } from 'sqlstring';

export default class Expression {
  protected expr: string;

  private constructor(expr: string) {
    this.expr = expr;
  }

  public static raw(expr: string): Expression {
    return new Expression(expr);
  }

  public getExpression(): string {
    return raw(this.expr).toSqlString();
  }
}
