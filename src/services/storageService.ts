// storageService.ts

export interface WeatherData {
  location: string; // e.g., "London, UK"
  data: any; // API response (current + forecast combined)
  timestamp: number; // store fetch time for caching
}

const RECENT_KEY = 'weather_recent';
const FAVORITES_KEY = 'weather_favorites';
const CACHE_KEY = 'weather_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function addRecentSearch(location: string) {
  const recents = getRecentSearches();
  const updated = [location, ...recents.filter((r) => r !== location)].slice(
    0,
    5,
  ); // max 5
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

export function getRecentSearches(): string[] {
  return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
}

export function toggleFavorite(location: string) {
  const favorites = getFavorites();
  let updated;
  if (favorites.includes(location)) {
    updated = favorites.filter((f) => f !== location);
  } else {
    updated = [...favorites, location];
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export function getFavorites(): string[] {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
}

export function setCachedWeather(location: string, data: any) {
  const cache = getCache();
  cache[location.toLowerCase()] = {
    location,
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function getCachedWeather(location: string): WeatherData | null {
  const cache = getCache();
  const entry = cache[location.toLowerCase()];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry;
  }
  return null;
}

function getCache(): Record<string, WeatherData> {
  return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
}
