import FromExprStatement from './select/FromExprStatement';
import HavingExprStatement from './select/HavingExprStatement';
import LimitExprStatement from './select/LimitExprStatement';
import OrderByExprStatement from './select/OrderByExprStatement';
import SelectExprStatement from './select/SelectExprStatement';
import MatchExprStatement from './select/MatchStatement';
import ClientInterface from '../ClientInterface';
import GroupByExprStatement from './select/GroupByExprStatement';
import WhereStatement from './select/WhereStatement';
import StatementBuilderBase from './StatementBuilderBase';

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
  protected matchStatement: MatchExprStatement = new MatchExprStatement();
  protected whereConditions: WhereStatement[] = [];
  protected groupByExpr: GroupByExprStatement[] = [];
  protected havingExpr: HavingExprStatement;
  protected orderByFields: OrderByExprStatement[] = [];
  protected limitExpr: LimitExprStatement;

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

  public match(fields: string[] | string, value?: string, escapeValue: boolean = false) {
    this.matchStatement.match((!fields.length) ? undefined : value, value, escapeValue);

    return this;
  }

  public orMatch(fields: string[] | string, value?: string, escapeValue: boolean = false) {
    this.matchStatement.orMatch((!fields.length) ? undefined : value, value, escapeValue);

    return this;
  }

  public groupBy(columns: string[]) {
    const expression = new GroupByExprStatement(columns);
    this.groupByExpr = [...this.groupByExpr, expression];

    return this;
  }

  public having(columnExpr: string, operator: string, value?: any) {
    if (value === undefined) {
      value = operator;
      operator = '=';
    }

    this.havingExpr = new HavingExprStatement(columnExpr, operator, value);

    return this;
  }

  public orderBy(fields: object) {
    for (const [field, order] of Object.entries(fields)) {
      this.orderByFields = [...this.orderByFields, new OrderByExprStatement(field, order)];
    }

    return this;
  }

  public limit(offset: number = 0, size: number = 5) {
    this.limitExpr = new LimitExprStatement(offset, size);

    return this;
  }

  public generate() : string {
    let statement = 'SELECT ';
    statement += this.select.build();
    statement += ' FROM ';
    statement += this.fromIndexes.build();

    const hasMatchStatement: boolean = this.matchStatement.getParts().length > 0;
    const hasWhereStatements: boolean = this.whereConditions.length > 0;

    if (hasWhereStatements || hasMatchStatement) {
      statement += ' WHERE ';

      if (hasMatchStatement) {
        statement += `MATCH(${this.matchStatement.build()})`;
        if (hasWhereStatements) {
          statement += ' AND ';
        }
      }

      let stringStatements: string[];
      stringStatements = this.whereConditions.map((condition: StatementBuilderBase) => condition.build());
      statement += stringStatements.join(' AND ');
    }

    if (this.groupByExpr.length) {
      statement += ' GROUP BY ';
      let stringStatements: string[];
      stringStatements = this.groupByExpr.map((group: GroupByExprStatement) => group.build());
      statement += stringStatements.join(', ');
    }

    if (this.havingExpr) {
      statement += ` HAVING ${this.havingExpr.build()}`;
    }

    if (this.orderByFields.length) {
      statement += ' ORDER BY ';
      let stringStatements: string[];
      stringStatements = this.orderByFields.map((field: StatementBuilderBase) => field.build());
      statement += stringStatements.join(', ');
    }

    if (this.limitExpr !== undefined) {
      statement += ` LIMIT ${this.limitExpr.build()}`;
    }

    return statement;
  }

  public execute() {
    const query = this.generate();
    // make query

    return query;
  }
}
