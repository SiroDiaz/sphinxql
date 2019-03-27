import SelectExprStatement from './select/SelectExprStatement';
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
  protected fromIndexes: Array<string>;
  protected whereConditions: Array<WhereStatement>;
  protected groupBy: Array<GroupByStatement>;

  public constructor(connection: ClientInterface, ...fields: string[]) {
    this.connection = connection;
    this.select = new SelectExprStatement(fields);
  }

  public from(...indexes: string[]) : SelectStatement {
    this.fromIndexes = indexes;
    
    return this;
  }

  public where(columnExpr: string, operator: string, value): SelectStatement {
    const condition = new WhereStatement(columnExpr, operator, value);
    this.whereConditions = [...this.whereConditions, condition];

    return this;
  }

  public execute() {
    // sdas
  }
}