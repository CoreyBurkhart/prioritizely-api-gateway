import express from 'express';
import deleteUser from './routes/delete';

const router = new express.Router();

router.delete('/', deleteUser);

export default router;
