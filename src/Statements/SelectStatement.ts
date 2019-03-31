import FromExprStatement from './select/FromExprStatement';
import SelectExprStatement from './select/SelectExprStatement';
import MatchExprStatement from './select/MatchStatement';
import ClientInterface from '../ClientInterface';
import GroupByStatement from './select/GroupByStatement';
import WhereStatement from './select/WhereStatement';

/**
  SELECT
    select_expr [, select_expr ...]
    FROM index [, index2 ...]
    [WHERE where_condition]
    [GROUP [N] BY {col_name | expr_alias} [, {col_name | expr_alias}]]
    [WITHIN GROUP ORDER BY {col_name | expr_alias} {ASC | DESC}]
    [HAVING having_condition]
    [ORDER BY {col_name | expr_alias} {ASC | DESC} [, ...]]
    [LIMIT [offset,] row_count]
    [OPTION opt_name = opt_value [, ...]]
    [FACET facet_options[ FACET facet_options][ ...]]
 */
export default class SelectStatement {
  protected connection: ClientInterface;
  protected select: SelectExprStatement;
  protected fromIndexes: FromExprStatement;
  protected matchStatement: MatchExprStatement;
  protected whereConditions: WhereStatement[];
  protected groupBy: GroupByStatement[];

  public constructor(connection: ClientInterface, ...fields: string[]) {
    this.connection = connection;
    this.select = new SelectExprStatement(...fields);
  }

  public from(...indexes: any[]) : SelectStatement {
    this.fromIndexes = new FromExprStatement(...indexes);

    return this;
  }

  /**
   *
   * @param columnExpr
   * @param operator
   * @param value
   */
  public where(columnExpr: string, operator: string, value?: any): SelectStatement {
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

  public match() {

  }

  public generate() : String {
    let statement = 'SELECT ';
    statement += this.select.build();
    statement += ' FROM ';
    statement += this.fromIndexes.build();

    if (this.whereConditions !== undefined && this.whereConditions.length) {

    }

    return statement;
  }

  public execute() {
    const query = this.generate();
    // make query

    return query;
  }
}
