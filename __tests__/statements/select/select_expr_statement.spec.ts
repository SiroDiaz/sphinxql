import SelectExprStatement from "../../../src/Statements/statement_expressions/SelectExprStatement";

describe('Tests for SELECT fields generator', () => {

  it('should create a simple column string', () => {
    const generator = new SelectExprStatement('*');

    expect(generator.build()).toBe('*');
  });

  it('should create a multiple column string', () => {
    const generator = new SelectExprStatement('title', 'content');

    expect(generator.build()).toBe('title, content');
  });

  it('should return a "*" when a empty select expresion is created', () => {
    const generator = new SelectExprStatement();

    expect(generator.build()).toBe('*');
  });
});
