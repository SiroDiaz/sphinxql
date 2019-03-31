import StatementBuilderBase from '../StatementBuilderBase';

export default class SelectExprStatement extends StatementBuilderBase {
  protected fieldsExpr: string[];

  constructor(...fields: string[]) {
    super();
    this.fieldsExpr = fields;
  }

  public build(): String {
    return this.fieldsExpr.length ? this.fieldsExpr.join(', ') : '*';
  }

}
