import sphinxql from '../../src/Sphinxql';

describe('Tests FLUSH RTINDEX statement', () => {
  test('flush rt index statement query generated', () => {
    const compiledQuery = sphinxql().flushRTIndex('my_index').generate();
    const expectedQuery = `FLUSH RTINDEX my_index`;

    expect(compiledQuery).toBe(expectedQuery);
  });
});
