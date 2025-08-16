import DataService from '../services/dataService';
import { City, WeatherForecast } from '../types';
import style from './Upcoming5Days.module.css';

const Upcoming5Days = ({ data }: { data: WeatherForecast[]; city: City }) => {
  const todayDate = new Date().toISOString().split('T')[0];
  const summarizedData = DataService.summarizeWeatherByDate(data).filter(
    (dt) => dt.date !== todayDate,
  );

  const tempUnit = '°c';

  const upcomingDays = summarizedData.map((day) => {
    day['weekday'] = DataService.getWeekdayWithRelative(day.date);
    return day;
  });

  return (
    upcomingDays.length && (
      <div className={style['section']}>
        <h2>5 days forecast</h2>
        <div className="scroll-wrapper">
          {upcomingDays.map((day, i) => (
            <div className={style['day']} key={`day${i + 1}`}>
              <div className={style['name']}>
                {day['weekday']}
                <span>{day.mainCondition}</span>
              </div>
              <div className={style['icon']}>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icons[0]}@2x.png`}
                  alt={day.mainCondition}
                />
              </div>
              <div className={style['weather']}>
                <div>
                  <span>Temp :</span>
                  <span>
                    {Math.round(day.tempHigh)} - {Math.round(day.tempLow)}{' '}
                    <sup>{tempUnit}</sup>
                  </span>
                </div>
                <div>
                  <span>Humidity :</span>
                  <span>{day.humidityAvg}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Upcoming5Days;
