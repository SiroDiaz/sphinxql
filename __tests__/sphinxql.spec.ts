import QueryBuilder from '../src/QueryBuilder';
import sphinxql from '../src/Sphinxql';

describe('greeter function', () => {
  it('it creates an sphinxql query builder instance successfully', () => {
    const sphql = sphinxql();

    expect(sphql).not.toBe(null);
    expect(sphql).toBeInstanceOf(QueryBuilder);
  });
});
