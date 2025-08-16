import axios from 'axios';
import { CurrentWeather } from './types.ts';

const CurrentWeatherAPI = '';
const AirPollutionAPI = 'http://api.openweathermap.org/data/2.5/air_pollution';

const API_KEY = import.meta.env.VITE_OWM_API_KEY;

export const fetchWeather = async (query: string, units = 'metric') => {
  const { data } = await axios.get(CurrentWeatherAPI, {
    params: { q: query, units, APPID: API_KEY },
  });
  return data as CurrentWeather;
};
