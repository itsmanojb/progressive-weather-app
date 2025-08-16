import { useState } from 'react';
import {
  addRecentSearch,
  getRecentSearches,
  toggleFavorite,
  getFavorites,
  getCachedWeather,
  setCachedWeather,
} from '../services/storageService';
import './Sidebar.css';

const API_KEY = import.meta.env.VITE_OWM_API_KEY;

const Sidebar = ({ klass, onPlaceClicked, onCloseClicked }) => {
  const tempUnit = '°c';
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [recent, setRecent] = useState<string[]>(getRecentSearches());

  function inputChange(e) {
    setQuery(e.target.value);
  }

  const search = async (e) => {
    if (e.key === 'Enter') {
      if (searching) return;
      setSearching(true);
      try {
        const data = await fetchWeather(query);
        setSearching(false);
        setSearchCompleted(true);
        setWeather(data);
        setQuery('');
        setRecent(getRecentSearches());
      } catch (error) {
        console.log('error', error);
        setSearchCompleted(true);
        setWeather(null);
      } finally {
        setSearching(false);
      }
    }
  };

  async function fetchWeather(location: string) {
    // 1. Check cache
    const cached = getCachedWeather(location);
    if (cached) {
      console.log('Using cached:', cached);
      return cached.data;
    }

    // 2. Fetch from API
    let data: any = null;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&APPID=${API_KEY}`,
      );
      const _data = await res.json();
      if (_data?.cod === 200) {
        // 3. Save to cache + recent
        setCachedWeather(location, data);
        addRecentSearch(location);
        data = _data;
      }
    } catch (error) {
      console.log('error', error);
    }

    return data;
  }

  function toggleFav(location: string) {
    toggleFavorite(location);
    console.log('Favorites:', getFavorites());
  }

  const selectPlace = (e) => {
    onCloseClicked(true);
    onPlaceClicked(e);
  };

  return (
    <>
      <div className={`glass ${klass}`}></div>
      <div
        className={`glass-contents ${klass.includes('night') ? 'night' : ''}`}
      >
        <div className="close" onClick={(e) => onCloseClicked(true)}>
          &times;
        </div>
        <div className="searchbox">
          <input
            type="text"
            name="name"
            id="name"
            className="search"
            placeholder="Search place..."
            value={query}
            onChange={inputChange}
            onKeyDown={search}
            autoComplete="off"
          />
        </div>
        {searching && <div className="searching">Searching...</div>}
        {searchCompleted && (
          <div className="locations">
            {weather ? (
              <>
                <div className="results">
                  <div
                    className="place big"
                    onClick={() => selectPlace(weather)}
                  >
                    <div className="place-info">
                      <p>
                        {weather.name}, {weather.sys.country}
                      </p>
                      <span>Currently {weather.weather[0].description}</span>
                    </div>
                    <div className="condition">
                      <div className="w">
                        <div className="temp">
                          {Math.round(weather.main.temp)} {tempUnit}
                        </div>
                        <div className="icon">
                          <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt={weather.weather[0].description}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="place">Set as default</div> */}
              </>
            ) : (
              !searching && <div className="noplace">No result found</div>
            )}
          </div>
        )}
        {recent.length > 0 && (
          <div className="recent-searches">
            <h3>Recent Searches</h3>
            <ul>
              {recent.map((loc, i) => (
                <li key={i}>{loc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
