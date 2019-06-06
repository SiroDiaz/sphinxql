import FromExprStatement from './statement_expressions/FromExprStatement';
import HavingExprStatement from './statement_expressions/HavingExprStatement';
import LimitExprStatement from './statement_expressions/LimitExprStatement';
import OrderByExprStatement from './statement_expressions/OrderByExprStatement';
import SelectExprStatement from './statement_expressions/SelectExprStatement';
import MatchExprStatement from './statement_expressions/MatchStatement';
import ClientInterface from '../ClientInterface';
import GroupByExprStatement from './statement_expressions/GroupByExprStatement';
import WhereStatement from './statement_expressions/WhereStatement';
import StatementBuilderBase from './StatementBuilderBase';
import OptionExprStatement from './statement_expressions/OptionExprStatement';
import FacetStatement from './FacetStatement';

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
  protected optionExprs: OptionExprStatement[] = [];

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

  /**
   * Adds an AND logical operator (by default) to the new full text condition.
   * It recieves a field or an array of string fields to match against.
   * "value" parameter is used for the text to match.
   * If escapeValue is true (default) it will escape full text operators
   * to prevent security issues, else the value will contain syntax FT operators
   * to make possible use proximity, negation, exact phrase, and so forth.
   */
  public match(fields: string[] | string, value: string, escapeValue: boolean = true) {
    this.matchStatement.match(fields.length ? fields : undefined, value, escapeValue);

    return this;
  }

  /**
   * Adds an OR "|" logical operator to the new full text condition.
   * It MUST be used after call "match" method because "orMatch" preppends
   * the OR operator.
   */
  public orMatch(fields: string[] | string, value: string, escapeValue: boolean = true) {
    this.matchStatement.orMatch(fields.length ? fields : undefined, value, escapeValue);

    return this;
  }

  /**
   * Creates the a GROUP BY expression and append it to the
   * end of the array.
   */
  public groupBy(columns: string[]) {
    const expression = new GroupByExprStatement(columns);
    this.groupByExpr = [...this.groupByExpr, expression];

    return this;
  }

  /**
   * Creates a HAVING expression.
   * Only is allowed one condition in HAVING expression.
   */
  public having(columnExpr: string, operator: string, value?: any) {
    if (value === undefined) {
      value = operator;
      operator = '=';
    }

    this.havingExpr = new HavingExprStatement(columnExpr, operator, value);

    return this;
  }

  /**
   * Creates an ORDER BY expression and appends it to the end of columns.
   */
  public orderBy(fields: object) {
    for (const [field, order] of Object.entries(fields)) {
      this.orderByFields = [...this.orderByFields, new OrderByExprStatement(field, order)];
    }

    return this;
  }

  /**
   * Creates a LIMIT expression if doesn't exist with a default size.
   * If "limit" method has been called before then updates the offset.
   */
  public offset(offset: number = 0) {
    if (this.limitExpr !== undefined) {
      this.limitExpr.setOffset(offset);
    } else {
      this.limitExpr = new LimitExprStatement(offset);
    }

    return this;
  }

  /**
   * Creates a LIMIT expression if doesn't exist with the specified
   * size (length or number of results).
   * If "offset" method has been called before then updates the size.
   */
  public limit(size: number = 5) {
    if (this.limitExpr !== undefined) {
      this.limitExpr.setSize(size);
    } else {
      this.limitExpr = new LimitExprStatement(0, size);
    }

    return this;
  }

  /**
   * Creates a new option and appends it at the end of OPTION expressions.
   * "option" parameter is the name of the option and "value", as you might guest,
   * contains all the option values. "value" can be a key/value object, a string
   * or a Expression instance object.
   */
  public option(option: string, value: any) {
    this.optionExprs = [...this.optionExprs, new OptionExprStatement(option, value)];

    return this;
  }

  public facet(cb) {
    let values = [];
    values = [...values, cb.apply(this, [new FacetStatement(this.connection)])];

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

    if (this.optionExprs.length) {
      statement += ` OPTION ${this.optionExprs.map((option) => option.build()).join(',')}`;
    }

    return statement;
  }

  public execute() {
    return this.connection.execute(this.generate(), []);
  }
}
