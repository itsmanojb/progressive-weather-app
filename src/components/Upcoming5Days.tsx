import DataService from '../services/dataService';
import { City, WeatherForecast } from '../services/types';
import './Forecasts.css';

const Upcoming5Days = ({ data }: { data: WeatherForecast[]; city: City }) => {
  const todayDate = new Date().toISOString().split('T')[0];
  const summarizedData = DataService.summarizeWeatherByDate(data).filter(
    (dt) => dt.date !== todayDate,
  );

  const tempUnit = '°c'; //  F

  const upcomingDays = summarizedData.map((day) => {
    day['weekday'] = DataService.getWeekdayWithRelative(day.date);
    return day;
  });

  return (
    upcomingDays.length && (
      <div className="days-5">
        <div className="header">5 days forecast</div>
        <div className="scroll-wrapper">
          {upcomingDays.map((day, i) => (
            <div className="day" key={`day${i + 1}`}>
              <div className="name">
                {day['weekday']}
                <span>{day.mainCondition}</span>
              </div>
              <div className="icon">
                <img
                  src={`https://openweathermap.org/img/wn/${day.icons[0]}@2x.png`}
                  alt={day.mainCondition}
                />
              </div>
              <div className="weather">
                <div>
                  <span className="temp H">
                    {Math.round(day.tempHigh)} {tempUnit}
                  </span>
                  <span className="temp L">
                    {Math.round(day.tempLow)} {tempUnit}
                  </span>
                </div>
                <div>
                  <span>Humidity</span>
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
