import StatementBuilderBase from './StatementBuilderBase';
import ClientInterface from '../ClientInterface';
import Expression from './Expression';
import LimitExprStatement from './statement_expressions/LimitExprStatement';
import OrderByExprStatement from './statement_expressions/OrderByExprStatement';

/**
 * FACET {expr_list} [BY {expr_list}] [ORDER BY {expr | FACET()} {ASC | DESC}] [LIMIT [offset,] count]
 */
export default class FacetStatement implements StatementBuilderBase {
  protected fieldColumns: string[] = [];
  protected byExpressions: string[] = [];
  protected orderByExpression: OrderByExprStatement;
  protected limitExpression: LimitExprStatement;

  constructor(protected connection: ClientInterface) {}

  public field(column: string | Expression): FacetStatement {
    if (column instanceof Expression) {
      this.fieldColumns = [...this.fieldColumns, column.getExpression()];
    } else {
      this.fieldColumns = [...this.fieldColumns, column];
    }

    return this;
  }

  public fields(columns: (string|Expression)[]): FacetStatement {
    const results = this.getExpressions(columns);
    this.fieldColumns = [...this.fieldColumns, ...results];

    return this;
  }

  protected getExpressions(exprList: (string|Expression)[]): string[] {
    let results: string[] = exprList.map((expr) => {
      if (expr instanceof Expression) {
        return expr.getExpression();
      }

      return expr;
    });

    return results;
  }

  public by(expressions: (string|Expression)[]): FacetStatement {
    const results = this.getExpressions(expressions);
    this.byExpressions = [...this.byExpressions, ...results];
    return this;
  }

  public orderBy(expression: string|Expression, order: string = 'DESC'): FacetStatement {
    if (expression instanceof Expression) {
      this.orderByExpression = new OrderByExprStatement(expression.getExpression(), order);
    } else {
      this.orderByExpression = new OrderByExprStatement(expression, order);
    }
    
    return this;
  }

  public offset(offset: number = 0): FacetStatement {
    if (this.limitExpression !== undefined) {
      this.limitExpression.setOffset(offset);
    } else {
      this.limitExpression = new LimitExprStatement(offset);
    }

    return this;
  }

  public limit(size: number = 5): FacetStatement {
    if (this.limitExpression !== undefined) {
      this.limitExpression.setSize(size);
    } else {
      this.limitExpression = new LimitExprStatement(0, size);
    }

    return this;
  }
  
  build(): string {
    let statement: string = '';

    if (this.fieldColumns.length) {
      statement += this.fieldColumns.join(', ');
    }

    if (this.byExpressions.length) {
      statement += ` BY ${this.byExpressions.join(', ')}`
    }

    if (this.orderByExpression !== undefined) {
      statement += ` ORDER BY ${this.orderByExpression.build()}`;
    }

    if (this.limitExpression !== undefined) {
      statement += ` LIMIT ${this.limitExpression.build()}`;
    }

    return statement;
  }
}
