import { useState } from 'react';
import { useEffect } from 'react';
import DataService from '../services/dataService';
import { CurrentWeather } from '../types';
import style from './CurrentUpdate.module.css';

type CurrentWeatherUpdateProps = {
  data: CurrentWeather;
  dailydata?: any;
  miniview: boolean;
};

const CurrentUpdate = ({ data, miniview }: CurrentWeatherUpdateProps) => {
  const [minView, setMinView] = useState(miniview);

  const tempUnit = '°c';
  const windSpeedUnit = 'km/h';
  const windDirection = DataService.degreesToCompass(data.wind.deg);

  useEffect(() => {
    setMinView(miniview);
  }, [miniview]);

  const darkIcons = ['01n', '13d', '13n', '50d', '50n'];

  return (
    <div
      className={minView ? style['current-place-min'] : style['current-place']}
    >
      <div className={style['highlight']}>
        <div className={style['location']}>{data.name}</div>
        <div className={style['temp']}>
          <span>{data.main.temp.toFixed(0)}</span>
          <sup>{tempUnit}</sup>
        </div>
        <div
          className={
            darkIcons.includes(data.weather[0].icon)
              ? style['icon-inv']
              : style['icon']
          }
        >
          <img
            className={style['weather-icon']}
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
            alt={data.weather[0].main}
          />
        </div>
      </div>
      <div className={style['more-info']}>
        <div className={style['description']}>
          <span>
            {data.weather[0].main} ({data.weather[0].description}), Feels like{' '}
            {data.main.feels_like.toFixed(0)}
            {tempUnit}
          </span>
          {data.rain && <span>Rain: {data.rain['1h']}mm (in last 1hr)</span>}
        </div>
        <div className={style['humid']}>Humidity: {data.main.humidity}%</div>
        <div className={style['wind']}>
          {windDirection} {Math.round(data.wind.speed * 3.6)} {windSpeedUnit}
        </div>
        {/* <div className="temp">
          <span>
            <small>Hi</small>
            {data.main.temp_max.toFixed(0)}
            <sup>{tempUnit}</sup>
          </span>
          <span>
            <small>Lo</small>
            {data.main.temp_min.toFixed(0)}
            <sup>{tempUnit}</sup>
          </span>
        </div> */}
      </div>
      <div className={style['city']}>
        {data.dt < data.sys.sunrise && (
          <div>
            <span className={style['icon-sunrise']}></span>
            <p>
              Sunrise
              <strong>
                {DataService.getDateTime(data.sys.sunrise, 'time')}
              </strong>
            </p>
          </div>
        )}
        {data.dt >= data.sys.sunrise && data.dt < data.sys.sunset && (
          <div>
            <span className={style['icon-sunset']}></span>
            <p>
              Sunset
              <strong>
                {DataService.getDateTime(data.sys.sunset, 'time')}
              </strong>
            </p>
          </div>
        )}
        {data.dt >= data.sys.sunset && (
          <div>
            <span className={style['icon-sunrise']}></span>
            <p>
              Sunrise
              <strong>
                {DataService.getDateTime(data.sys.sunrise, 'time')}
              </strong>
            </p>
          </div>
        )}
        <div>
          <span className={style['icon-uv']}></span>
          <p>
            UV Index
            <strong>-</strong>{' '}
          </p>
        </div>
        <div>
          <span className={style['icon-visibility']}></span>
          <p>
            Visibility <strong>{Math.round(data.visibility / 1000)} km</strong>
          </p>
        </div>
        <div>
          <span className={style['icon-pressure']}></span>
          <p>
            Air Pressure <strong>{data.main.pressure} hPa</strong>
          </p>
        </div>
        <div>
          <span className={style['icon-cloudiness']}></span>
          <p>
            Cloudiness <strong>{data.clouds.all}%</strong>{' '}
          </p>
        </div>
        <div>
          <span className={style['icon-rain']}></span>
          <p>
            Rain in 3 hour{' '}
            <strong>{data?.rain?.['1h'] || 0 + ' mm'}</strong>{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentUpdate;
