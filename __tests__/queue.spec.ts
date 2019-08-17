import Sphinxql from '../src/Sphinxql';
import Queue from '../src/Queue';
import BaseStatement from '../src/Statements/BaseStatement';

describe('Tests for Queue class', () => {
  
  const sphql = Sphinxql.createConnection({
    host: 'localhost',
    port: 9307,
  });

  afterAll(() => {
    sphql.getConnection().close();
  })

  test('create an empty queue', () => {  
    const queue = new Queue(sphql.getConnection());

    expect(queue.empty()).toBeTruthy();
  });

  test('push multiple statements', () => {
    const queue = new Queue(sphql.getConnection());

    queue.push(sphql.getQueryBuilder().select('*').from('rt'));
    queue.push(sphql.getQueryBuilder().select('*').from('rt'));
    
    expect(queue.empty()).toBeFalsy();
    expect(queue.size()).toBe(2);
  });

  test('shift statements', () => {
    const queue = new Queue(sphql.getConnection());

    queue.push(sphql.getQueryBuilder().select('*').from('rt'));
    queue.push(sphql.getQueryBuilder().select('*').from('rt'));
    
    expect(queue.empty()).toBeFalsy();
    expect(queue.size()).toBe(2);

    expect(queue.shift()).toBeInstanceOf(BaseStatement);
    expect(queue.empty()).toBeFalsy();
    expect(queue.size()).toBe(1);
    expect(queue.shift()).toBeInstanceOf(BaseStatement);
    expect(queue.empty()).toBeTruthy();
    expect(queue.size()).toBe(0);
  });

  test('join query statements with a semicolon separator', () => {
    const queue = new Queue(sphql.getConnection());

    queue.push(sphql.getQueryBuilder().select('*').from('rt'));
    queue.push(sphql.getQueryBuilder().select('*').from('rt'));
    
    const result = queue.joinQueries();
    const expected = "SELECT * FROM rt;SELECT * FROM rt";
    expect(result).toBe(expected);
  });

  test('process multi query statements', (done) => {
    const queue = new Queue(sphql.getConnection());

    queue
      .push(sphql.getQueryBuilder().select('*').from('rt'))
      .push(sphql.getQueryBuilder().select('*').from('rt'))
      .push(sphql.getQueryBuilder().select('*').from('rt'));
    
    queue.process()
      .then((results) => {
        expect(results.results).toHaveLength(3);

        done();
      })
      .catch((error) => {
        console.log(error);
        done();
      });
  });

  test('process empty queue with rejected promise with an Error', (done) => {
    const queue = new Queue(sphql.getConnection());
    
    queue.process()
      .then((results) => {
        expect(results.results).toHaveLength(3);

        done();
      })
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).not.toHaveLength(0);
        done();
      });
  });
});
