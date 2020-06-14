import express from 'express';
import vesselService from '../services/vesselService';

const router = express.Router();

/* GET a list of vessels with related statistics.
 *
 * @param (optional) req.query.limit      {Number}  The number of records to return
 * @param (optional) req.query.sortKey    {String}  The property on which to sort
 * @param (optional) req.query.sortDir    {String}  The sort direction ('asc' or 'dsc')
 * @param (optional) req.query.delayDays  {Array}   An array of forecast points expressed in days
 * @param (optional) req.query.delayPerc  {Array}   An array of port call delay percentile points
 * */
router.get('/', async (req, res, next) => {
  try {
    const { limit, sortKey, sortDir, delayPerc, delayDays } = req.query;

    const data = vesselService.findAll(sortKey, sortDir, +limit, delayDays, delayPerc);

    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
});

/* GET basic info about a specific vessel.
 * @param (optional) req.query.delayDays  {Array}   An array of forecast points expressed in days
 * @param (optional) req.query.delayPerc  {Array}   An array of port call delay percentile points
 * */
router.get('/:vesselId', async (req, res, next) => {
  try {
    const id = req.params['vesselId'].trim();
    const { delayDays, delayPerc } = req.query;

    const schedule = vesselService.findOne(+id, delayDays, delayPerc);

    if (!schedule) res.status(404).end();

    res.status(200).send(schedule);
  } catch (e) {
    next(e);
  }
});

/* GET the full schedule for a specific vessel.
 * @param req.params.vesselId   {String}  The id (aka 'imo') of the vessel
 * */
router.get('/:vesselId/schedule/', async (req, res, next) => {
  try {
    const id = req.params['vesselId'].trim();

    const schedule = vesselService.findOneWithSchedule(+id);

    if (!schedule) res.status(404).end();

    res.status(200).send(schedule);
  } catch (e) {
    next(e);
  }
});

export default router;
