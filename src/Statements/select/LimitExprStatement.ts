import StatementBuilderBase from '../StatementBuilderBase';

export default class LimitExprStatement implements StatementBuilderBase {
  private size: number;
  private offset: number;

  constructor(offset: number = 0, size: number = 5) {
    this.setOffset(offset);
    this.setSize(size);
  }

  public build(): string {
    let expression: string = '';
    if (this.offset > 0) {
      expression += `${this.offset}, `;
    }
    expression += `${this.size}`;

    return expression;
  }

  public setOffset(offset: number) {
    if (offset < 0) {
      throw Error('Offset must greater or equal to zero');
    }
    this.offset = offset;
  }

  public setSize(size: number) {
    if (size < 1) {
      throw Error('Size of results must be greater than zero');
    }
    this.size = size;
  }
}
