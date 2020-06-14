import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/indexRouter';
import portRouter from './routes/portRouter';
import vesselRouter from './routes/vesselRouter';

import { importData } from './db/dbLoader';
import { registerEndpoints } from './utils/routerUtils';

require('./utils/nativeUtils');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

const initialize = new Promise((resolve, reject) => {
  importData()
    .then(() => resolve())
    .catch(e => reject(e));
});

app.use('/', indexRouter);

app.use(async (req, res, next) => {
  await initialize;
  next();
});

app.use('/ports', portRouter);
app.use('/vessels', vesselRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err);
});

registerEndpoints(app._router.stack);

export default app;
