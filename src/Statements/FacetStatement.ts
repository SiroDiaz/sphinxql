import StatementBuilderBase from './StatementBuilderBase';
import ClientInterface from '../ClientInterface';
import Expression from './Expression';

/**
 * FACET {expr_list} [BY {expr_list}] [ORDER BY {expr | FACET()} {ASC | DESC}] [LIMIT [offset,] count]
 */
export default class FacetStatement implements StatementBuilderBase {
  protected connection: ClientInterface;

  constructor(connection: ClientInterface) {
    this.connection = connection;
  }

  facet(columns: (string|Expression)[]): FacetStatement {
    console.log(columns);
    return this;
  }

  build(): string {
    throw new Error("Method not implemented.");
  }
}