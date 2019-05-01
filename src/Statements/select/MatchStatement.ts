import StatementBuilderBase from '../StatementBuilderBase';

export default class MatchStatement implements StatementBuilderBase {
  protected fullTextQuery: string;

  constructor()

  build(): String {
    let expression: string = '';
    return this.fullTextQuery;
  }
}
