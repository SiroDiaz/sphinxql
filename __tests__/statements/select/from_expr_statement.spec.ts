import sphinxql from '../../../src/Sphinxql';
import FromExprStatement from '../../../src/Statements/statement_expressions/FromExprStatement';

describe('Tests for SELECT fields generator', () => {
  it('should create a multiple column string', () => {
    const generator = new FromExprStatement('rt');

    expect(generator.build()).toBe('rt');
  });

  it('should return indexes separated by ", " when string index is passed', () => {
    const generator = new FromExprStatement('rt', 'book');

    expect(generator.build()).toBe('rt, book');
  });

  it('should create a simple subquery string between parentheses', () => {
    const qb = sphinxql();

    const generator = new FromExprStatement(qb.select().from('rt'));

    expect(generator.build()).toBe('(SELECT * FROM rt)');
  });

  it('should create a subquery inside a subquery between parentheses', () => {
    const qb = sphinxql();

    const generator = new FromExprStatement(
      qb.select('title').from(qb.select().from('rt')),
    );

    expect(generator.build()).toBe('(SELECT title FROM (SELECT * FROM rt))');
  });

  it('should generate index names mixed with a subquery', () => {
    const qb = sphinxql();
    const qb2 = sphinxql();

    const generator1 = new FromExprStatement(
      'book',
      qb.select('title').from(qb2.select().from('rt')),
    );
    const generator2 = new FromExprStatement(
      'book',
      qb.select('title').from(qb2.select().from('rt')),
      'user',
    );
    const generator3 = new FromExprStatement(
      'book',
      qb.select('title').from('comment', qb2.select().from('rt')),
      'user',
    );

    expect(generator1.build()).toBe(
      'book, (SELECT title FROM (SELECT * FROM rt))',
    );
    expect(generator2.build()).toBe(
      'book, (SELECT title FROM (SELECT * FROM rt)), user',
    );
    expect(generator3.build()).toBe(
      'book, (SELECT title FROM comment, (SELECT * FROM rt)), user',
    );
  });
});
