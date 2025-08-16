import { CurrentWeather, ForecastData } from './types';

export interface CombinedWeatherData {
  current: CurrentWeather;
  forecast: ForecastData;
}

const CACHE_DURATION_MINUTES = 10; // cache lifetime
const CACHE_KEY_PREFIX = 'weather_cache_';
const API_KEY = import.meta.env.VITE_OWM_API_KEY;

const CurrentWeatherAPI = 'https://api.openweathermap.org/data/2.5/weather';
const ForecastAPI = 'https://api.openweathermap.org/data/2.5/forecast';

// Round coordinates to reduce precision for better caching efficiency
function roundCoord(value: number, decimals = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// Generate a cache key from approximate location
function getCacheKey(lat: number, lon: number): string {
  const rLat = roundCoord(lat);
  const rLon = roundCoord(lon);
  return `${CACHE_KEY_PREFIX}${rLat}_${rLon}`;
}

export async function getWeatherWithForecast(
  lat: number,
  lon: number,
  units = 'metric',
): Promise<CombinedWeatherData | null> {
  const now = Date.now();
  const cacheKey = getCacheKey(lat, lon);

  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { timestamp, data } = JSON.parse(cached) as {
      timestamp: number;
      data: CombinedWeatherData;
    };
    if (now - timestamp < CACHE_DURATION_MINUTES * 60 * 1000) {
      return data;
    }
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `${CurrentWeatherAPI}?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`,
      ),
      fetch(
        `${ForecastAPI}?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`,
      ),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const current: CurrentWeather = await currentRes.json();
    const forecast: ForecastData = await forecastRes.json();

    const combined: CombinedWeatherData = { current, forecast };

    localStorage.setItem(
      cacheKey,
      JSON.stringify({ timestamp: now, data: combined }),
    );

    return combined;
  } catch (err) {
    console.error('Failed to fetch weather and forecast', err);
    return null;
  }
}
