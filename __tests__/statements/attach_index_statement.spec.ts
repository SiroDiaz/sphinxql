import sphinxql from '../../src/Sphinxql';

describe('Tests ATTACH INDEX statement', () => {
  test('attach index statement is generated', () => {
    const compiledQuery = sphinxql()
      .attachIndex('my_index')
      .to('my_rt_index')
      .generate();
    const expectedQuery = `ATTACH INDEX my_index TO RTINDEX my_rt_index`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('attach index statement with truncate is generated', () => {
    const compiledQuery = sphinxql()
      .attachIndex('my_index')
      .to('my_rt_index')
      .withTruncate()
      .generate();

    const expectedQuery = `ATTACH INDEX my_index TO RTINDEX my_rt_index WITH TRUNCATE`;
    expect(compiledQuery).toBe(expectedQuery);
  });
});
