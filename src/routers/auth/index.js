/* eslint new-cap: 0 */

import express from 'express';
import signupHandler from './signup';
import classicLoginHandler from './login/classic';
import googleLoginHandler from './login/google';
import logoutHandler from './logout';

const router = express.Router();

/*
 * Full route = "/api/auth/..."
 */
router.post('/signup', signupHandler);
router.post('/login', classicLoginHandler);
router.post('/login/google', googleLoginHandler);
router.get('/logout', logoutHandler);

export default router;
