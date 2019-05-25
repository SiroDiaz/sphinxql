import OptionExprStatement from "../../../src/Statements/statement_expressions/OptionExprStatement";
import Expression from '../../../src/Statements/Expression';

describe('Tests for OPTION expressions', () => {
  test('simple OPTION generate with a key and one value', () => {
    const expr: OptionExprStatement = new OptionExprStatement('key', 'value');
    expect(expr.build()).toBe(`key='value'`);
  });

  test('escape value of a option', () => {
    const expr = new OptionExprStatement('comment', 'this should be quoted');
    expect(expr.build()).toBe(`comment='this should be quoted'`);
  });

  test('not escape the string passed', () => {
    const expr = new OptionExprStatement('ranker', Expression.raw('sph04'));

    expect(expr.build()).toBe(`ranker=sph04`);
  })

  test('value is an key/value object that should be joined with commas', () => {
    const expr = new OptionExprStatement('field_weights', {title: 100, content: 1});
    expect(expr.build()).toBe('field_weights=(title=100,content=1)');
  });
});
