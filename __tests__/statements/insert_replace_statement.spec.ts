import QueryBuilder from '../../src/QueryBuilder';
import SphinxClient from '../../src/SphinxClient';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests for INSERT queries', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  const conn = new SphinxClient(params);

  afterAll(() => {
    conn.close();
  })

  it('Creates a simple insert query that insert new record to rt index', () => {
    const compiledQuery = new QueryBuilder(conn).insert('rt', {
      id: 1,
      title: 'Sample title',
      content: 'some random text without sense',
    }).generate();
    const expectedQuery = `INSERT INTO rt (id, title, content) VALUES (1, 'Sample title', 'some random text without sense')`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('Inserts multiple values into the rt index', () => {
    const compiledQuery = new QueryBuilder(conn).insert('rt', [
      {id: 1, title: 'Sample title', content: 'some random text without sense'},
      {id: 2, title: 'Second post', content: 'Another random and dummy text.'},
    ]).generate();
    const expectedQuery = `INSERT INTO rt (id, title, content) VALUES (1, 'Sample title', 'some random text without sense'), (2, 'Second post', 'Another random and dummy text.')`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('Fails to insert values to an rt index with empty value', () => {
    expect(() => {
      new QueryBuilder(conn).insert('', [
        {id: 1, title: 'Sample title', content: 'some random text without sense'},
        {id: 2, title: 'Second post', content: 'Another random and dummy text.'},
      ]);
    }).toThrow();

    expect(() => {
      new QueryBuilder(conn).insert('rt', []);
    }).toThrow();
  });

  it('inserts a key-value object which the order doesn\'t matters', () => {
    expect(
      new QueryBuilder(conn).insert('rt', {
        id: 1,
        title: 'Some random title',
        content: 'Another random and dummy text.'
      }).generate()).toBe(`INSERT INTO rt (id, title, content) VALUES (1, 'Some random title', 'Another random and dummy text.')`);

    expect(
      new QueryBuilder(conn).insert('rt', [{
        id: 1,
        title: 'Some random title',
        content: 'Another random and dummy text.'
      }, {
        title: 'Second title',
        id: 2,
        content: 'Use your imagination'
      }]).generate()).toBe(`INSERT INTO rt (id, title, content) VALUES (1, 'Some random title', 'Another random and dummy text.'), (2, 'Second title', 'Use your imagination')`);
  });

  it('inserts a key-value object without the id field', () => {
    expect(
      new QueryBuilder(conn).insert('rt', {
        id: 1,
        title: 'Some random title',
        content: 'Another random and dummy text.'
      }).generate()).toBe(`INSERT INTO rt (id, title, content) VALUES (1, 'Some random title', 'Another random and dummy text.')`);

    expect(
      new QueryBuilder(conn).insert('rt', [{
        title: 'Some random title',
        content: 'Another random and dummy text.'
      }, {
        title: 'Second title',
        content: 'Use your imagination'
      }]).generate()).toBe(`INSERT INTO rt (title, content) VALUES ('Some random title', 'Another random and dummy text.'), ('Second title', 'Use your imagination')`);
  });

  it('Inserts a complex document that fails', () => {
    const doc = {
      uid: '3WerqTQHEVhgFKQ',
      original_title: 'Bill Gates gives best-case scenario for US economy',
      original_duration: 459,
      platform: 'youtube',
      is_private: 0,
      video_url: 'https://www.youtube.com/watch?v=T5klk4ZEEsk',
      thumbnail: 'https://i.ytimg.com/vi/T5klk4ZEEsk/sddefault.jpg',
      created_at: 1588422121
    };

    expect(
      new QueryBuilder(conn).insert('rt', doc)
        .generate()).toBe(
          `INSERT INTO rt (uid, original_title, original_duration, platform, is_private, video_url, thumbnail, created_at) VALUES ('3WerqTQHEVhgFKQ', 'Bill Gates gives best-case scenario for US economy', 459, 'youtube', 0, 'https://www.youtube.com/watch?v=T5klk4ZEEsk', 'https://i.ytimg.com/vi/T5klk4ZEEsk/sddefault.jpg', 1588422121)`
    );
  });

  it('Creates a simple REPLACE query', () => {
    const compiledQuery = new QueryBuilder(conn).replace('rt', {
      id: 1,
      title: 'Sample title',
      content: 'some random text without sense',
    }).generate();
    const expectedQuery = `REPLACE INTO rt (id, title, content) VALUES (1, 'Sample title', 'some random text without sense')`;

    expect(compiledQuery).toBe(expectedQuery);
  });
});
