import express from 'express';
import dbCache from '../db/dbCache';

const router = express.Router();

/* GET a list of available endpoints. */
router.get('/', async (req, res) => {
  const endpoints = dbCache.get('endpoints');
  res.status(200).json({ endpoints });
});

export default router;
