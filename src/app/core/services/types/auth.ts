/**
 * A simple mock user
 */
export type User = {
  /**
   * The full name of the user
   */
  name: string;
  /**
   * A url to a user avatar image
   */
  avatar?: string;
  /**
   * A username
   */
  username?: string;
  /**
   * User email
   */
  email?: string;
  /**
   * User ID
   */
  id?: string;
};

/**
 * Login credentials
 */
export type Credentials = {
  email: string;
  password: string;
};
