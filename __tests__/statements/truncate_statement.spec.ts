import sphinxql from '../../src/Sphinxql';

describe('Tests TRUNCATE statement', () => {
  test('truncate statement is generated', () => {
    const compiledQuery = sphinxql().truncate('my_rt_index').generate();
    const expectedQuery = `TRUNCATE RTINDEX my_rt_index`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('truncate statement with reconfigure is generated', () => {
    const compiledQuery = sphinxql()
      .truncate('my_rt_index')
      .withReconfigure()
      .generate();

    const expectedQuery = `TRUNCATE RTINDEX my_rt_index WITH RECONFIGURE`;
    expect(compiledQuery).toBe(expectedQuery);
  });
});
