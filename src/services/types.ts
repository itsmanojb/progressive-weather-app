export interface CurrentWeather {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  rain: Rain;
  clouds: Clouds;
  dt: number;
  sys: SunData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface SunData {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface Clouds {
  all: number;
}

export interface Rain {
  '1h'?: number;
  '3h'?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherForecast[];
  city: City;
}

export interface WeatherForecast {
  dt: number;
  main: Forecast;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  snow?: Rain;
  sys: Sys;
  dt_txt: string;
}

export interface Forecast {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface Sys {
  pod: string;
}

export interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface DailyWeatherSummary {
  date: string;
  tempHigh: number;
  tempLow: number;
  tempAvg: number;
  feelsLikeHigh: number;
  feelsLikeLow: number;
  humidityAvg: number;
  humidityMax: number;
  humidityMin: number;
  pressureAvg: number;
  pressureMin: number;
  windSpeedMax: number;
  windSpeedAvg: number;
  windGustMax: number;
  prevailingWindDir: string;
  cloudCoverAvg: number;
  popMax: number;
  popDailyChance: number;
  visibilityMin: number;
  mainCondition: string;
  totalPrecipitation: number; // mm
  icons: string[]; // NEW: unique weather icons for the day
}

export interface HourlyWeatherForecast extends WeatherForecast {
  dateTime: string;
  windDirection: string;
}

export interface AirPollutionInfo {
  dt: number;
  main: {
    aqi: number;
  };
  components: Components;
}

interface Components {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export interface AirPollutionData {
  coord: [number, number];
  list: AirPollutionInfo[];
}

export interface CombinedWeatherData {
  current: CurrentWeather;
  forecast: ForecastData;
  airPollution: AirPollutionData;
}
