import LimitExprStatement from "../../../src/Statements/select/LimitExprStatement";

describe('Tests for SELECT fields generator', () => {
  const defaultSize = 5;

  it('throws an error because negative values in offset', () => {
    expect(() => {
      new LimitExprStatement(-1);
    }).toThrow();
  });

  it('throws an error because zero or negative size', () => {
    expect(() => {
      new LimitExprStatement(0, 0);
    }).toThrow();
  });

  it('builds a simple limit statement omitting the offset', () => {
    const generator = new LimitExprStatement();

    expect(generator.build()).toBe(`${defaultSize}`);
  });

  it('builds a limit statement and changes its values', () => {
    const generator = new LimitExprStatement(5);
    expect(generator.build()).toBe(`5, 5`);

    generator.setOffset(10);
    generator.setSize(10);
    expect(generator.build()).toBe(`10, 10`);

    generator.setOffset(0);
    generator.setSize(10);
    expect(generator.build()).toBe(`10`);
  });
});
