import OrderByExprStatement from '../../../src/Statements/select/OrderByExprStatement';

describe('Tests for ORDER BY fields generator', () => {

  it('throws an error because empty column is invalid', () => {
    expect(() => {
      new OrderByExprStatement('');
    }).toThrow();
  });

  it('generates a ORDER BY expression that uses DESC order as default', () => {
    const generator = new OrderByExprStatement('country');

    expect(generator.build()).toBe(`country DESC`);
  });

  it('generates a simple ORDER BY expression using an ASC order', () => {
    const generator = new OrderByExprStatement('group', 'ASC');

    expect(generator.build()).toBe(`group ASC`);
  });
});
