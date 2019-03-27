import StatementBuilderBase from '../StatementBuilderBase';

export default class SelectExprStatement extends StatementBuilderBase {
  protected fieldsExpr;

  constructor(...fields: string[]) {
    super();
    this.fieldsExpr = fields;
  }

  public build(): String {
    return this.fieldsExpr.join(', ');
  }

}