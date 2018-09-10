import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routers/auth';
import morganMiddleware from './middleware/morgan';
import bodyParserMiddleware from './middleware/bodyParser';
import cookieParserMiddleware from './middleware/cookieParser';
import defaultProxy from './middleware/defaultProxy';
import authMiddleware from './middleware/auth';
import errorMiddleware from './middleware/error';
require('./../config/config');

const app = express();
/*
 * mongoose
 */
mongoose.Promise = Promise;

/*
 * non-error middleware.
 * TODO: implement Helmet security middleware.
 */
app.use(bodyParserMiddleware);
app.use(morganMiddleware);
app.use(cookieParserMiddleware);

/*
 * use auth middleware on non "/auth" routes
 */
app.use(/\/api(?!\/auth)/, authMiddleware);

/*
 * routers
 */
app.use('/api/auth', authRouter);

/*
 * proxy
 */
app.use(/\/api(?!\/auth)/, defaultProxy);

/*
 * error middleware (must be last call to app.use)
 */
app.use(errorMiddleware);

export default app;
