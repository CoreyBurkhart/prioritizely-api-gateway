import express from 'express';
import authMiddleware from './../../middleware/auth';

/**
 * @class
 * @name ProtectedRouter
 * @summary a simple express router that uses auth middleware to verify JWTs.
 */
export default class ProtectedRouter extends express.Router {
  /**
   * @constructor
   * @param {Object} options
   * @see express.Router
   */
  constructor(options) {
    super(options);

    this.use(authMiddleware);
  }
}
