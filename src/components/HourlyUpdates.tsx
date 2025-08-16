import { useEffect, useState } from 'react';
import { HourlyWeatherForecast, WeatherForecast } from '../types';
import DataService from '../services/dataService';
import compassIcon from '../assets/icons/compass.svg';
import style from './HourlyUpdates.module.css';

const HourlyUpdates = ({ data }: { data: WeatherForecast[] }) => {
  const [nextHours, setNextHours] = useState<HourlyWeatherForecast[]>([]);
  const [selectedTile, setSelectedTile] = useState<number>(0);

  const tempUnit = '°c';
  const windSpeedUnit = ' km/h';

  useEffect(() => {
    const futureUpdates = data
      .map((hour) => ({
        dateTime: DataService.formatTimeTo12Hour(hour.dt_txt.split(' ')[1]),
        windDirection: DataService.degreesToCompass(hour.wind.deg),
        ...hour,
      }))
      .filter((hr) => new Date(hr.dt_txt).getTime() > new Date().getTime());

    setNextHours(futureUpdates);
  }, [data]);

  const isSelectedTile = (dt: number) => selectedTile === dt;

  return (
    <div className={style['section']}>
      <h2>Hourly Forecast</h2>
      <div className="scroll-wrapper">
        {nextHours.map((hour, i) => (
          <div
            className={
              style['hour'] +
              ' ' +
              (isSelectedTile(hour.dt) ? style['selected'] : '')
            }
            key={`hr${i + 1}`}
            onClick={() => setSelectedTile(hour.dt)}
          >
            <div className={style['fg']}>
              <div className={style['time']}>{hour.dateTime}</div>
              <div className={style['icon']}>
                <img
                  src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                  alt={hour.weather[0].main}
                />
              </div>
              <div className={style['weather']}>
                <div>
                  <span>
                    {Math.round(hour.main.temp)}
                    {tempUnit}
                  </span>
                </div>
              </div>
            </div>
            <div className={style['full-details']}>
              <dl>
                <dt>Cond.</dt>
                <dd>{hour.weather[0].description}</dd>
                <dt>Humidity</dt>
                <dd>{Math.round(hour.main.humidity)}%</dd>
                <dt>Feel like</dt>
                <dd>
                  {hour.main.feels_like}
                  {tempUnit}
                </dd>
              </dl>
              <dl>
                <dt>Cloudiness</dt>
                <dd>{hour.clouds.all}%</dd>
                <dt>Chance of Rain</dt>
                <dd>{hour.pop} %</dd>
                <dt>Pressure</dt>
                <dd>{hour.main.pressure} hPa</dd>
              </dl>
              <dl>
                <dt>Wind</dt>
                <dd>
                  <span>{hour.windDirection}</span>{' '}
                  <span>
                    {Math.round(hour.wind.speed * 3.6)}
                    {windSpeedUnit}
                  </span>
                  <div
                    className={style['compass']}
                    style={{ rotate: `${hour.wind.deg}deg` }}
                  >
                    <img src={compassIcon} alt="" />
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyUpdates;
