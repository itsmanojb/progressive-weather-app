import { useState, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import CurrentUpdate from './components/CurrentUpdate';
import Upcoming5Days from './components/Upcoming5Days';
import HourlyUpdates from './components/HourlyUpdates';
import Sidebar from './components/Sidebar';
import DataService from './services/dataService';
import { getWeatherWithForecast } from './services/weatherService';
import { CombinedWeatherData } from './services/types';
import './Weather.css';
import AirQuality from './components/AirQuality';

const App: React.FC = () => {
  const [bgClass, setBGClass] = useState('');
  const [drawerShown, setDrawerShown] = useState(false);
  const [minimalView, setMinimalView] = useState(false);
  const [weatherData, setWeatherData] = useState<CombinedWeatherData>();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleOnIdle = () => {
    if (!drawerShown) {
      setMinimalView(true);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        getWeatherForLatLon(latitude, longitude);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  }, []);

  async function getWeatherForLatLon(latitude: number, longitude: number) {
    try {
      const data = await getWeatherWithForecast(latitude, longitude);
      if (data) {
        setWeatherData(data);
        setBGClass(
          DataService.getBackgroundClass(
            data.current.weather[0].icon,
            data.current.weather[0].id,
          ),
        );
      }
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }

  useIdleTimer({
    timeout: 1000 * 60,
    onIdle: handleOnIdle,
  });

  return (
    <div
      className={`main-container ${bgClass} ${
        drawerShown ? ' drawer-open' : ''
      }`}
    >
      <div className="left" onClick={() => setMinimalView(false)}>
        {loading ? (
          <div className="loading">Fetching...</div>
        ) : error ? (
          <div className="loading">{error}</div>
        ) : (
          weatherData && (
            <>
              <CurrentUpdate
                data={weatherData.current}
                dailydata={[]}
                miniview={minimalView}
              />
              {!minimalView && (
                <>
                  <div className="w-layout">
                    <div className="a-data">
                      <AirQuality data={weatherData.airPollution.list[0]} />
                    </div>
                    <div className="u-data">
                      <Upcoming5Days
                        data={weatherData.forecast.list}
                        city={weatherData.forecast.city}
                      />
                    </div>
                    <div className="h-data">
                      <HourlyUpdates data={weatherData.forecast.list} />
                    </div>
                  </div>
                  <div className="footer">
                    Data provided by{' '}
                    <a
                      href="https://openweathermap.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      openweathermap
                    </a>
                  </div>
                </>
              )}
            </>
          )
        )}
      </div>
      {drawerShown ? (
        <div className="right">
          <Sidebar
            onCloseClicked={() => setDrawerShown(false)}
            onPlaceClicked={({ coord }) =>
              getWeatherForLatLon(coord.lat, coord.lon)
            }
            klass={bgClass}
          />
        </div>
      ) : (
        !loading &&
        !error && (
          <div
            className="grabber"
            onClick={() => setDrawerShown(!drawerShown)}
          ></div>
        )
      )}
    </div>
  );
};

export default App;
