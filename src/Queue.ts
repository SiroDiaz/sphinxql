import * as yallist from 'yallist';
import BaseStatement from './Statements/BaseStatement';

/**
 * Simple queue using doubly linked lists using yallist package.
 * It has the minimal methods to make this work.
 *
 * As Manticore Search and Sphinx documentation said there is only
 * support for the following statements used in a batch:
 * - SELECT
 * - SHOW WARNINGS
 * - SHOW STATUS
 * - SHOW META
 *
 * For more information, read the Manticore documentation regarded this topic
 * https://docs.manticoresearch.com/latest/html/sphinxql_reference/multi-statement_queries.html
 */
export default class Queue {
  protected list = yallist.create([]);
  /**
   *Adds to the queue an statement.
   *
   * @param {BaseStatement} statement
   * @memberof Queue
   */
  public push(statement: BaseStatement): Queue {
    this.list.push(statement);

    return this;
  }

  /**
   * Removes the statement in the head of the queue.
   *
   * @returns {BaseStatement}
   * @memberof Queue
   */
  public shift(): BaseStatement {
    return this.list.shift();
  }

  /**
   * Returns the number of queries in the queue.
   *
   * @returns {number}
   * @memberof Queue
   */
  public size(): number {
    return this.list.length;
  }

  /**
   * Checks if the queue is empty.
   *
   * @returns {boolean}
   * @memberof Queue
   */
  public empty(): boolean {
    return this.size() === 0;
  }

  /**
   * Joins the queries in the queue using a semicolon (;).
   * Using semicolon allows to separate queries.
   *
   * @returns {string}
   * @memberof Queue
   */
  public joinQueries(): string {
    const sqlStrings: string[] = this.list
      .toArray()
      .map((query: BaseStatement) => query.generate());

    return sqlStrings.join(';');
  }
}
