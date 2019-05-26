# sphinxql

[![Build Status](https://travis-ci.org/SiroDiaz/sphinxql.svg?branch=develop)](https://travis-ci.org/SiroDiaz/sphinxql)
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3XKLA6VTYVSKW&source=url)

SphinxQL query builder for Node.JS wrote in Typescript. Make easy queries avoiding
to write raw SphinxQL strings always that you can. By default, it uses escaped query parameters, always
thinking in security.

It is heavily inspired in the PHP [SphinxQL-Query-Builder](https://github.com/FoolCode/SphinxQL-Query-Builder) 
and also the Eloquent query builder (Laravel framework ORM)

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
  .match('title', 'harry potter')
  .where('created_at', '<',  Expression.raw('YEAR()'))
  .between(Expression.raw(`YEAR(created_at)`), 2014, 2019)
  .orderBy({'date_published': 'ASC', 'price': 'DESC'})
  .limit(10)
  .execute()
  .then((result, fields) => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
```

### SELECT
//TODO

### INSERT
An INSERT statement is created like this:
```ecmascript 6
const document = {
  id: 1,
  content: 'this is the first post for the blog...',
  title: 'First post'
};

connection.getQueryBuilder()
  .insert('my_rtindex', document)
  .execute()
  .then((result, fields) => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
```

Or using an array of key-value pairs to insert multiple values in the same query
```ecmascript 6
const document = [{
  id: 1,
  content: 'this is the first post for the blog...',
  title: 'First post'
}, {
  id: 2,
    content: 'this is the second post for the blog...',
    title: 'Second post'
}];

connection.getQueryBuilder()
  .insert('my_rtindex', document)
  .execute()
  .then((result) => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
```

### Transactions
This package also comes with support for transactions. Remember that transactions are only
available for RT indexes. For more information visit [transactions documentation for Manticore search](https://docs.manticoresearch.com/latest/html/sphinxql_reference/begin,_commit,_and_rollback_syntax.html).

The transactions API is simple and the list of methods is below here:
- connection.getQueryBuilder().transaction().begin()
- connection.getQueryBuilder().transaction().start()  // same that begin()
- connection.getQueryBuilder().transaction().commit()
- connection.getQueryBuilder().transaction().rollback()

all this methods returns a promise object.

A simple example working with transactions:
```exmascript 6
const document = {
  id: 1,
  content: 'this is the first post for the blog...',
  title: 'First post'
};

const insertDocumentAndCommit = async (doc) => {
  await connection.getQueryBuilder().transaction().begin();
  
  connection.getQueryBuilder()
    .insert('my_rtindex', doc)
    .execute()
    .then((result, fields) => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });

    await connection.getQueryBuilder().transaction().commit();

    return true;
}

insertDocumentAndCommit(document);
```
