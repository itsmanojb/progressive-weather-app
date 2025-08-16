import { DailyWeatherSummary, WeatherForecast } from './types';

function getDateTime(
  unixTimestamp: number,
  need: 'date' | 'time',
  full: boolean = false,
  military: boolean = false,
): string {
  if (!unixTimestamp) return '';
  const date = new Date(unixTimestamp * 1000);
  let formattedDate = '';

  if (need === 'date') {
    formattedDate = date.toLocaleDateString();
  } else if (need === 'time') {
    formattedDate = date.toLocaleTimeString(undefined, {
      hour12: !military,
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  if (full) {
    formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString(
      undefined,
      {
        hour12: !military,
        hour: 'numeric',
        minute: '2-digit',
      },
    )}`;
  }

  return formattedDate;
}

function getWeekDayFromTimestamp(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[date.getDay()];
}

function getWeekdayFromDate(dateString: string): string {
  const date = new Date(dateString.replace(' ', 'T'));
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return weekdays[date.getDay()];
}

function getWeekdayWithRelative(
  dateString: string,
  locale: string = 'en-US',
): string {
  const inputDate = new Date(dateString.replace(' ', 'T'));
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const stripTime = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const inputDay = stripTime(inputDate);
  const todayDay = stripTime(today);
  const tomorrowDay = stripTime(tomorrow);

  if (inputDay === todayDay) return 'Today';
  if (inputDay === tomorrowDay) return 'Tomorrow';

  return inputDate.toLocaleDateString(locale, { weekday: 'long' });
}

function formatTimeTo12Hour(timeString: string): string {
  const [hourStr, minuteStr] = timeString.split(':');
  let hour = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; // Convert 0 → 12, 13 → 1, etc.

  return minutes === 0
    ? `${hour} ${ampm}`
    : `${hour}:${minuteStr.padStart(2, '0')} ${ampm}`;
}

function degreesToCompass(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
}

function round(val: number, decimals = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

function getBackgroundClass(icon: string, id: number) {
  let klass = '';
  switch (icon) {
    case '01d':
    case '01n':
      klass = 'clear-sky';
      break;
    case '02d':
    case '02n':
      klass = 'few-clouds';
      break;
    case '03d':
    case '03n':
      klass = 'scattered-clouds';
      break;
    case '04d':
    case '04n':
      klass = 'broken-clouds';
      break;
    case '09d':
    case '09n':
      klass = 'showering-rain';
      break;
    case '10d':
    case '10n':
      klass = 'heavy-rain';
      break;
    case '11d':
    case '11n':
      klass = 'thunderstorm';
      break;
    case '13d':
    case '13n':
      klass = 'snowfall';
      break;
    case '50d':
    case '50n':
      if (id === 701) {
        klass = 'mist';
      } else if (id === 711) {
        klass = 'smoke';
      } else if (id === 721) {
        klass = 'haze';
      } else if (id === 731 || id === 751 || id === 761) {
        klass = 'dust-sand';
      } else if (id === 741) {
        klass = 'fog';
      } else if (id === 762) {
        klass = 'ash';
      } else if (id === 781) {
        klass = 'tornado';
      } else {
        klass = 'mist';
      }
      break;
    default:
      break;
  }
  if (icon.slice(-1) === 'n') {
    klass += ' night';
  }
  return klass;
}

function setDataInCache<T>(
  key: string,
  value: T,
  minutes: 15 | 30 | 60 = 60,
): T {
  const now = new Date();
  const expiryTimestamp = now.getTime() + minutes * 60 * 1000;

  const item = {
    value,
    expiry: expiryTimestamp,
  };

  localStorage.setItem(key, JSON.stringify(item));
  return value;
}

function getCachedData<T>(key: string): T | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value as T;
  } catch {
    return null;
  }
}

export function summarizeWeatherByDate(
  data: WeatherForecast[],
): DailyWeatherSummary[] {
  const grouped: Record<string, WeatherForecast[]> = {};

  for (const entry of data) {
    const date = entry.dt_txt.split(' ')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(entry);
  }

  return Object.entries(grouped).map(([date, entries]) => {
    const temps = entries.map((e) => e.main.temp);
    const tempMaxs = entries.map((e) => e.main.temp_max);
    const tempMins = entries.map((e) => e.main.temp_min);
    const feels = entries.map((e) => e.main.feels_like);
    const humidity = entries.map((e) => e.main.humidity);
    const pressure = entries.map((e) => e.main.pressure);
    const windSpeeds = entries.map((e) => e.wind.speed);
    const windGusts = entries.map((e) => e.wind.gust ?? 0);
    const windDirs = entries.map((e) => e.wind.deg);
    const clouds = entries.map((e) => e.clouds.all);
    const pops = entries.map((e) => e.pop * 100); // %
    const visibilities = entries.map((e) => e.visibility);
    const rainAmounts = entries.map((e) => e.rain?.['3h'] ?? 0);
    const snowAmounts = entries.map((e) => e.snow?.['3h'] ?? 0);
    const conditions = entries.map((e) => e.weather[0].main);
    const icons = [...new Set(entries.map((e) => e.weather[0].icon))]; // Unique icons

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const max = (arr: number[]) => Math.max(...arr);
    const min = (arr: number[]) => Math.min(...arr);

    const windSectorCounts: Record<string, number> = {};
    windDirs.forEach((deg) => {
      const dir = degreesToCompass(deg);
      windSectorCounts[dir] = (windSectorCounts[dir] || 0) + 1;
    });
    const prevailingWindDir = Object.entries(windSectorCounts).sort(
      (a, b) => b[1] - a[1],
    )[0][0];

    const conditionCounts: Record<string, number> = {};
    conditions.forEach((c) => {
      conditionCounts[c] = (conditionCounts[c] || 0) + 1;
    });
    const mainCondition = Object.entries(conditionCounts).sort(
      (a, b) => b[1] - a[1],
    )[0][0];

    const popDailyChance =
      (1 - pops.reduce((acc, pop) => acc * (1 - pop / 100), 1)) * 100;

    return {
      date,
      tempHigh: round(max(tempMaxs)),
      tempLow: round(min(tempMins)),
      tempAvg: round(avg(temps)),
      feelsLikeHigh: round(max(feels)),
      feelsLikeLow: round(min(feels)),
      humidityAvg: Math.round(avg(humidity)),
      humidityMax: Math.round(max(humidity)),
      humidityMin: Math.round(min(humidity)),
      pressureAvg: round(avg(pressure)),
      pressureMin: round(min(pressure)),
      windSpeedMax: round(max(windSpeeds)),
      windSpeedAvg: round(avg(windSpeeds)),
      windGustMax: round(max(windGusts)),
      prevailingWindDir,
      cloudCoverAvg: Math.round(avg(clouds)),
      popMax: Math.round(max(pops)),
      popDailyChance: Math.round(popDailyChance),
      visibilityMin: min(visibilities), // meters
      mainCondition,
      totalPrecipitation: round(
        rainAmounts.reduce((a, b) => a + b, 0) +
          snowAmounts.reduce((a, b) => a + b, 0),
        1,
      ),
      icons,
    };
  });
}

const DataService = {
  getDateTime,
  getWeekDayFromTimestamp,
  getWeekdayFromDate,
  getWeekdayWithRelative,
  formatTimeTo12Hour,
  degreesToCompass,
  summarizeWeatherByDate,
  getBackgroundClass,
  getCachedData,
  setDataInCache,
};

export default DataService;
