require ('es7-object-polyfill');
import MatchExprStatement from './statement_expressions/MatchStatement';
import ClientInterface from '../ClientInterface';
import WhereStatement from './statement_expressions/WhereStatement';
import StatementBuilderBase from './StatementBuilderBase';
import OptionExprStatement from './statement_expressions/OptionExprStatement';
import * as utils from '../utils';
import BaseStatement from './BaseStatement';

/**
  UPDATE index SET col1 = newval1 [, ...] WHERE where_condition [OPTION opt_name = opt_value [, ...]]
 */
export default class UpdateStatement extends BaseStatement {
  protected connection: ClientInterface;
  protected index: string;
  protected setParams: object = {};
  protected matchStatement: MatchExprStatement = new MatchExprStatement();
  protected whereConditions: WhereStatement[] = [];
  protected optionExprs: OptionExprStatement[] = [];

  public constructor(connection: ClientInterface, index: string) {
    super(connection);
    this.index = index;
  }

  public set(newValues: object) {
    this.setParams = newValues;

    return this;
  }

  /**
   *
   * @param columnExpr
   * @param operator
   * @param value
   */
  public where(columnExpr: string, operator: string, value?: any): UpdateStatement {
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
   * Creates a new option and appends it at the end of OPTION expressions.
   * "option" parameter is the name of the option and "value", as you might guest,
   * contains all the option values. "value" can be a key/value object, a string
   * or a Expression instance object.
   */
  public option(option: string, value: any) {
    this.optionExprs = [...this.optionExprs, new OptionExprStatement(option, value)];

    return this;
  }

  public generate() : string {
    let statement = 'UPDATE ';
    statement += this.index;

    statement += ' SET ';
    statement += this.generateSet();

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

    if (this.optionExprs.length) {
      statement += ` OPTION ${this.optionExprs.map((option) => option.build()).join(',')}`;
    }

    return statement;
  }

  protected generateSet(): string {
    return Object.entries(this.setParams).map(([key, value, ]) => {
      return `${key}=${utils.getExpressionCompare(value)}`;
    }).join(', ');
  }
}
