import Connection from '../../../src/Connection';
import FromExprStatement from '../../../src/Statements/statement_expressions/FromExprStatement';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest


describe('Tests for SELECT fields generator', () => {

  const connection = Connection.createConnection({
    host: '127.0.0.1',
    port: 9307,
  });

  it('should create a multiple column string', () => {
    const generator = new FromExprStatement('rt');

    expect(generator.build()).toBe('rt');
  });

  it('should return indexes separated by ", " when string index is passed', () => {
    const connection = Connection.createConnection({
      host: '127.0.0.1',
      port: 9307,
    });
    // connection.getQueryBuilder()
    const generator = new FromExprStatement('rt', 'book');

    expect(generator.build()).toBe('rt, book');
    connection.getConnection().close();
  });

  it('should create a simple subquery string between parentheses', () => {
    const qb = connection.getQueryBuilder();

    const generator = new FromExprStatement(qb.select().from('rt'));

    expect(generator.build()).toBe('(SELECT * FROM rt)');
  });

  it('should create a subquery inside a subquery between parentheses', () => {
    const qb = connection.getQueryBuilder();

    const generator = new FromExprStatement(qb.select('title').from(qb.select().from('rt')));

    expect(generator.build()).toBe('(SELECT title FROM (SELECT * FROM rt))');
  });

  it('should generate index names mixed with a subquery', () => {
    const qb = connection.getQueryBuilder();
    const qb2 = connection.getQueryBuilder();

    const generator1 = new FromExprStatement('book', qb.select('title').from(qb2.select().from('rt')));
    const generator2 = new FromExprStatement('book', qb.select('title').from(qb2.select().from('rt')), 'user');
    const generator3 = new FromExprStatement('book', qb.select('title').from('comment', qb2.select().from('rt')), 'user');

    expect(generator1.build()).toBe('book, (SELECT title FROM (SELECT * FROM rt))');
    expect(generator2.build()).toBe('book, (SELECT title FROM (SELECT * FROM rt)), user');
    expect(generator3.build()).toBe('book, (SELECT title FROM comment, (SELECT * FROM rt)), user');
  });
});
