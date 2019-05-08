import StatementBuilderBase from '../StatementBuilderBase';

export default class MatchStatement implements StatementBuilderBase {
  protected fullTextQuery: string;
  protected operator: string = ' ';
  protected escapeChars: object = {
    '\\': '\\\\',
    '(' : '\(',
    ')' : '\)',
    '!' : '\!',
    '@' : '\@',
    '~' : '\~',
    '&' : '\&',
    '/' : '\/',
    '^' : '\^',
    '$' : '\$',
    '=' : '\=',
    '<' : '\<'
  };

  constructor() {

  }

  build(): String {
    let expression: string = '';
    return this.fullTextQuery;
  }
}
