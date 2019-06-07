import QueryBuilder from '../../src/QueryBuilder';
import SphinxClient from '../../src/SphinxClient';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests for select queries', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  const documents = [
    {
      id: 1,
      gid: 1,
      date_created: 1557479607,
      title: 'Sample test title message with a message in the bottle',
      content: 'Some text inside here with a message'
    },
    {
      id: 2,
      gid: 1,
      date_created: 1557479607,
      title: 'Second message for test porpouses',
      content: 'another one bits the dust'
    }
  ];

  const conn = new SphinxClient(params);

  afterAll(() => {
    conn.close();
  })

  test('inserts two documents into an index', async () => {
    try {
      const qb = new QueryBuilder(conn);
      await qb.transaction.begin();
      let results = await qb.insert('rt', documents).execute();

      expect(results.results.affectedRows).toBe(documents.length);

      await qb.transaction.rollback();
    } catch(e) {
      fail(e.message);
    }
  });

  test('select document from an index and then remove them', async () => {
    try {
      const qb = new QueryBuilder(conn);
      await qb.insert('rt', documents).execute();

      let results = await qb.select('id')
        .from('rt')
        .where('id', '=', 1)
        .execute();
        
      expect(results.results).toHaveLength(1);

      results = await qb.delete('rt').where('1', '=', 1).execute();
      expect(results.results.affectedRows).toBe(documents.length);
    } catch(e) {
      fail(e.message);
    }
  });

  test('select using match statement and get all the documents that contains in the title "message" word with OPTION param', async () => {
    try {
      const qb = new QueryBuilder(conn);
      await qb.insert('rt', documents).execute();

      let results = await qb.select('id')
        .from('rt')
        .match('title', 'message')
        .option('ranker', 'sph04')
        .execute();
        
      expect(results.results).toHaveLength(2);

      results = await qb.delete('rt').where('1', '=', 1).execute();
      expect(results.results.affectedRows).toBe(documents.length);
    } catch(e) {
      fail(e.message);
    }
  });

  test('update using match statement all documents that contains in the title the word "message"', async () => {
    try {
      const qb = new QueryBuilder(conn);
      await qb.insert('rt', documents).execute();

      let results = await qb.update('rt')
        .set({ gid: 2 })
        .match('title', 'message')
        .option('ranker', 'sph04')
        .execute();
      
      expect(results.results.affectedRows).toBe(documents.length);

      results = await qb.delete('rt').where('1', '=', 1).execute();
      expect(results.results.affectedRows).toBe(documents.length);
    } catch(e) {
      fail(e.message);
    }
  });

  test('replace a document field', async () => {
    try {
      const qb = new QueryBuilder(conn);
      await qb.insert('rt', documents).execute();

      const newDocument = {
        id: 1,
        title: 'UPDATED!',
        gid: 2
      };

      let results = await qb.replace('rt', newDocument).execute();
      results = await qb.select('gid').from('rt').where('id', '=', 1).execute();
      
      expect(results.results).toHaveLength(1);
      expect(results.results[0].gid).toBe(2);

      results = await qb.delete('rt').where('1', '=', 1).execute();
    } catch(e) {
      fail(e.message);
    }
  });
});
