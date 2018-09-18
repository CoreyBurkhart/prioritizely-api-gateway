import {GENERAL_ERROR} from '../error-messages';

/**
 * @class GeneralServerError
 * @summary creates a payload to be sent w/ errors that we don't have a
 *  specific error messages for.
 */
export default class GeneralServerError {
  /**
   * @constructor
   * @param {*} stacktrace
   * @param {Array} additionalMessages
   */
  constructor(stacktrace = null, additionalMessages = []) {
    let messages = [
      GENERAL_ERROR,
    ];

    if (additionalMessages instanceof Array) {
      messages = additionalMessages.concat(messages);
    }

    this.messages = messages;
    this.stacktrace = stacktrace;
    this.error = true;
  }
}
