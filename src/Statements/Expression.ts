import SqlString from 'sqlstring';

export default class Expression {
  protected expr: string;

  private constructor(expr: string) {
    this.expr = expr;
  }

  public static raw(expr: string) {
    return new Expression(expr);
  }

  public getExpression(): string {
    return SqlString.raw(this.expr);
  }
}
