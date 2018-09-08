/* eslint new-cap: 0 */

import express from 'express';
import signupHandler from './signup';
import classicsigninHandler from './signin/classic';
import googlesigninHandler from './signin/google';
import signoutHandler from './signout';

const router = express.Router();

/*
 * Full route = "/api/auth/..."
 */
router.post('/signup', signupHandler);
router.post('/signin', classicsigninHandler);
router.post('/signin/google', googlesigninHandler);
router.get('/signout', signoutHandler);

export default router;
