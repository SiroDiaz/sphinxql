import StatementBuilderBase from '../StatementBuilderBase';

export default class SelectExprStatement implements StatementBuilderBase {
  protected fieldsExpr: string[];

  constructor(...fields: string[]) {
    this.fieldsExpr = fields;
  }

  public build(): string {
    return this.fieldsExpr.length ? this.fieldsExpr.join(', ') : '*';
  }

}
