import SelectExprStatement from "../../../src/Statements/select/SelectExprStatement";

describe('Tests for SELECT fields generator', () => {
  it('should create a simple column string', () => {
    const generator = new SelectExprStatement('*');

    expect(generator.build()).toBe('*');
  });
});