import Connection from "../src/Connection";
import QueryBuilder from '../src/QueryBuilder';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest


describe('greeter function', () => {

  it('it creates and stablish a Sphinx/Manticore connection successfully', () => {
    const connection = Connection.createConnection({
      host: '127.0.0.1',
      port: 9307,
    });
    
    expect(connection.getQueryBuilder()).not.toBe(null);
    expect(connection.getQueryBuilder()).toBeInstanceOf(QueryBuilder);
    expect(true).toBeTruthy();
    connection.getConnection().close();
  });
});
