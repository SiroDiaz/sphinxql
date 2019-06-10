import Sphinxql from "../src/Sphinxql";
import QueryBuilder from '../src/QueryBuilder';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest


describe('greeter function', () => {

  it('it creates and stablish a Sphinx/Manticore connection successfully', () => {
    const sphql = Sphinxql.createConnection({
      host: '127.0.0.1',
      port: 9307,
    });
    
    expect(sphql.getQueryBuilder()).not.toBe(null);
    expect(sphql.getQueryBuilder()).toBeInstanceOf(QueryBuilder);
    sphql.getConnection().close();
  });
});
