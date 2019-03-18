export default abstract class ClientBase {
  /**
   * 
   */
  public connection;

  /**
   * 
   */
  protected static instance: ClientBase | null = null;
}