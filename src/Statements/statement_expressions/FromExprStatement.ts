import SelectStatement from '../SelectStatement';
import StatementBuilderBase from '../StatementBuilderBase';

/**
 * const conn.getQueryBuilder()
 * fromIndexes('books', conn.getQueryBuilder().select('').fromIndexes())
 */
export default class FromExprStatement implements StatementBuilderBase {
  protected indexes: any[];

  public constructor(...indexes: (string | SelectStatement)[]) {
    this.indexes = [];
    indexes.forEach((index: string | SelectStatement) => {
      this.indexes = [...this.indexes, index];
    });
  }

  protected static generateFromIndexExpressions(index: string | SelectStatement): string {
    if (index instanceof SelectStatement) {
      return `(${index.generate()})`;
    }

    return index;
  }

  build(): string {
    let expressions: string[];
    expressions = this.indexes.map(index => {
      return FromExprStatement.generateFromIndexExpressions(index);
    });

    return expressions.join(', ');
  }
}
