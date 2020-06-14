import dbCache from '../db/dbCache';
import utils from '../utils/miscUtils';
import { Vessel } from '../models/Vessel';

function findOne(vesselId, forecastPoints, percentilePoints) {
  if (forecastPoints) forecastPoints = utils.sanitizeNumbers(forecastPoints);
  if (percentilePoints) percentilePoints = utils.sanitizeNumbers(percentilePoints);

  const schedule = _schedules().find(schedule => schedule.vessel.imo === vesselId);

  if (!schedule) return;

  return _vesselStats(schedule, forecastPoints, percentilePoints);
}

function findOneWithSchedule(vesselId) {
  const schedule = _schedules().find(schedule => schedule.vessel.imo === vesselId);

  if (!schedule) return;

  return new Vessel({
    imo: schedule.vessel.imo,
    name: schedule.vessel.name,
    portCalls: schedule.portCalls,
  });
}

function findAll(sortKey, sortDir, limit, forecastPoints, percentilePoints) {
  if (forecastPoints) forecastPoints = utils.sanitizeNumbers(forecastPoints);
  if (percentilePoints) percentilePoints = utils.sanitizeNumbers(percentilePoints);

  const vessels = _schedules().map(s => _vesselStats(s, forecastPoints, percentilePoints));

  vessels.sortAndLimit(utils.sanitizeStrings(sortKey), sortDir, limit);

  return vessels;
}

function _vesselStats(schedule, forecastPoints, percentilePoints) {
  return {
    ...schedule.vessel,
    portCalls: schedule.portCalls.filter(portCall => !portCall.isOmitted).length,
    ...(forecastPoints &&
      percentilePoints && {
        portCallDelays: _vesselDelays(
          schedule.portCalls.filter(portCall => !portCall.isOmitted),
          forecastPoints,
          percentilePoints
        ),
      }),
  };
}

function _vesselDelays(portCalls, forecastPoints, percentilePoints) {
  const portCallDelays = [];

  portCalls.forEach(portCall => {
    const actualArrival = portCall.arrival;
    const forecastArrivals = portCall.logEntries.filter(entry => entry.updatedField === 'arrival');

    const delays = forecastPoints.reduce((obj, key) => ({ ...obj, [key]: 0 }), {});

    forecastArrivals.forEach(forecast => {
      let forecastPoint = utils.hoursBetween(forecast.createdDate, actualArrival, false) / 24;
      let forecastDelay = utils.hoursBetween(forecast.arrival, actualArrival, true).round(2);
      updateDelays(forecastPoint, forecastDelay);
    });

    function updateDelays(point, delay, n = 0) {
      if (forecastPoints.length <= n || point <= forecastPoints[n]) return;
      delays[forecastPoints[n]] = delay;
      updateDelays(point, delay, n + 1);
    }

    portCallDelays.push(delays);
  });

  const delayPercentiles = [];

  forecastPoints.forEach(forecastPoint =>
    delayPercentiles.push({
      days: forecastPoint,
      percentiles: {
        absolute: utils.percentiles(
          portCallDelays.map(delays => delays[forecastPoint]).sort((a, b) => a - b),
          percentilePoints
        ),
        relative: utils.percentiles(
          portCallDelays
            .map(delays => delays[forecastPoint])
            .sort((a, b) => a - b)
            .filter(d => d > 0),
          percentilePoints
        ),
      },
    })
  );

  return delayPercentiles;
}

const _schedules = () => dbCache.get('schedules');

export default { findAll, findOne, findOneWithSchedule };
