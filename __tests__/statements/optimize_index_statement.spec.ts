import sphinxql from '../../src/Sphinxql';

describe('Tests OPTIMIZE INDEX statement', () => {
  test('optimize index statement is generated', () => {
    const compiledQuery = sphinxql().optimizeIndex('my_index').generate();
    const expectedQuery = `OPTIMIZE INDEX my_index`;

    expect(compiledQuery).toBe(expectedQuery);
  });
});
