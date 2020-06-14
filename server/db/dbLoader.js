import apiService from '../services/apiService';
import dbCache from './dbCache';
import { Schedule } from '../models/Schedule';
import { Vessel } from '../models/Vessel';

export async function importData() {
  console.log('Loading vessels...');
  let vessels = await apiService.fetchVessels();

  console.log('Loading schedules...');
  let schedules = await Promise.all(
    vessels.data.map(vessel => apiService.fetchScheduleByVesselId(vessel.imo))
  );

  vessels = vessels.data.map(vessel => new Vessel(vessel));
  schedules = schedules.map(schedule => new Schedule(schedule.data));

  dbCache.set('vessels', vessels);
  dbCache.set('schedules', schedules);
}
