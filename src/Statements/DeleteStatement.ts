import MatchExprStatement from './statement_expressions/MatchStatement';
import WhereStatement from './statement_expressions/WhereStatement';
import StatementBuilderBase from './StatementBuilderBase';
import BaseStatement from './BaseStatement';

/**
 * DELETE FROM index WHERE where_condition
 */
export default class DeleteStatement extends BaseStatement {
  protected matchStatement: MatchExprStatement = new MatchExprStatement();
  protected whereConditions: WhereStatement[] = [];

  public constructor(protected index: string) {
    super();
  }

  /**
   *
   * @param columnExpr
   * @param operator
   * @param value
   */
  public where(
    columnExpr: string,
    operator: string,
    value?: any,
  ): DeleteStatement {
    if (value === undefined) {
      value = operator;
      operator = '=';
    }

    const condition = new WhereStatement(columnExpr, operator, value);
    this.whereConditions = [...this.whereConditions, condition];

    return this;
  }

  public whereIn(column: string, values: any[]) {
    const condition = new WhereStatement(column, 'IN', values);
    this.whereConditions = [...this.whereConditions, condition];

    return this;
  }

  public whereNotIn(column: string, values: any[]) {
    const condition = new WhereStatement(column, 'NOT IN', values);
    this.whereConditions = [...this.whereConditions, condition];

    return this;
  }

  public between(column: string, value1: any, value2: any) {
    const condtion = new WhereStatement(column, 'BETWEEN', [value1, value2]);
    this.whereConditions = [...this.whereConditions, condtion];

    return this;
  }

  /**
   * Adds an AND logical operator (by default) to the new full text condition.
   * It recieves a field or an array of string fields to match against.
   * "value" parameter is used for the text to match.
   * If escapeValue is true (default) it will escape full text operators
   * to prevent security issues, else the value will contain syntax FT operators
   * to make possible use proximity, negation, exact phrase, and so forth.
   */
  public match(fields: string[] | string, value: string, escapeValue = true) {
    this.matchStatement.match(
      fields.length ? fields : undefined,
      value,
      escapeValue,
    );

    return this;
  }

  /**
   * Adds an OR "|" logical operator to the new full text condition.
   * It MUST be used after call "match" method because "orMatch" preppends
   * the OR operator.
   */
  public orMatch(fields: string[] | string, value: string, escapeValue = true) {
    this.matchStatement.orMatch(
      fields.length ? fields : undefined,
      value,
      escapeValue,
    );

    return this;
  }

  public generate(): string {
    let statement = 'DELETE FROM ';
    statement += this.index;

    const hasMatchStatement: boolean =
      this.matchStatement.getParts().length > 0;
    const hasWhereStatements: boolean = this.whereConditions.length > 0;

    if (hasWhereStatements || hasMatchStatement) {
      statement += ' WHERE ';

      if (hasMatchStatement) {
        statement += `MATCH(${this.matchStatement.build()})`;
        if (hasWhereStatements) {
          statement += ' AND ';
        }
      }

      const stringStatements = this.whereConditions.map(
        (condition: StatementBuilderBase) => condition.build(),
      );
      statement += stringStatements.join(' AND ');
    }

    return statement;
  }
}
