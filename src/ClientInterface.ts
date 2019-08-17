/**
 * Wraps a list of main methods that MySQL clients
 * implements. In this case we are taking the mysql2 node
 * package. All methods are not implemented because you can
 * access to connection property in the ClientInterface implementation.
 */
export default interface ClientInterface {
  /**
   * Makes a ping to the Sphinx/Manticore server.
   * It returns a promise, instead of a callback.
   */
  ping(): Promise<any>;

  /**
   * It recieves a SphinxSQL query and makes the request.
   * The query IS NOT escaped (by default).
   * To escape values in the query you can use execute method or implement a
   * helper escape method and concat it and pass to this method like this:
   * 
   * const myQuery: String = "SELECT * FROM my_index WHERE title="+ escape("Some text...");
   * client.query(myQuery).then((resul) => { ... });
   * 
   * Returns a promise that has an array of results in case of the query was
   * successfully done; in other case it will reject with an error instance.
   */
  query(query: String) : Promise<any>;
  
  /**
   * Runs a query with escaped paramaters. The query must have zero or more question mark (?).
   * This first question mark will be replaced with the first value the values array;
   * Second question mark will be replaced with the second element in the values array and so on.
   * It returns a promise with the values received from Sphinx/Manticore server.
   */
  execute(query: String, values: Array<any>) : Promise<any>;

  /**
   * Closes the active connection.
   */
  close(): void;
}
