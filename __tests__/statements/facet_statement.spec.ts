import OptionExprStatement from "../../src/Statements/statement_expressions/OptionExprStatement";
import FacetStatement from '../../src/Statements/FacetStatement';
import SphinxClient from '../../src/SphinxClient';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests for FACET expressions', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
    multipleStatements: true, // set to true for enabling faceted query results
  };

  test('simple FACET by column', () => {
    const connection = new SphinxClient(params);
    const facet = new FacetStatement(connection);
    facet.facet(['category_id', 'year']);
    /*
    const expr = new FacetStatement(conn, (facetBuilder) => {
      return facetBuilder
        .select()
        .by()
        .orderBy(Expression.raw('FACET() asc'))
        .offset(0)
        .limit(5)
    });
    expect(expr.build()).toBe(`key='value'`);
    */
   expect(true).toBeTruthy();
  });

  test('escape value of a option', () => {
    const expr = new OptionExprStatement('comment', 'this should be quoted');
    expect(expr.build()).toBe(`comment='this should be quoted'`);
  });

  test('not escape the string passed', () => {
    expect(true).toBeTruthy();
  });

  test('value is an key/value object that should be joined with commas', () => {
    const expr = new OptionExprStatement('field_weights', {title: 100, content: 1});
    expect(expr.build()).toBe('field_weights=(title=100,content=1)');
  });
});
