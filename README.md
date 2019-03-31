# sphinxql

[![Build Status](https://travis-ci.org/SiroDiaz/sphinxql.svg?branch=develop)](https://travis-ci.org/SiroDiaz/sphinxql)
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3XKLA6VTYVSKW&source=url)

SphinxQL query builder for Node.JS wrote in Typescript. Make easy queries avoiding
to write raw SphinxQL strings always that you can. By default, it uses escaped query parameters, always
thinking in security.

The client used for create connection is [mysql2](https://github.com/sidorares/node-mysql2) that is focused
in performance.

## requirements

TODO

## install

Just run the npm command:
```bash
$ npm install --save sphinxql
```

## usage

To create a simple connection (not the most recommended, use a pool connection)
and write your first query, just do this:

```ecmascript 6
const sphinxql = require('sphinxql');

const connection = sphinxql.createConnection({
  host: 'localhost',
  port: 9306
});

connection.getQueryBuilder()
  .select('*')
  .from('book')
  .whereMatch('title', 'harry potter')
  .limit(10)
  .execute()
  .then((result, fields) => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
```
TODO