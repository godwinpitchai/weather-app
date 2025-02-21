import React, { useState } from "react";
import axios from "axios";
import "./WeatherApp.css"; // ✅ Import external CSS file

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForecast, setShowForecast] = useState(false);

  const API_KEY = "f4cc89bbbaba6b168b20be7bc037021d";

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }
    setLoading(true);
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      setWeather(weatherResponse.data);
      setForecast(forecastResponse.data.list.filter((_, index) => index % 8 === 0));
      setError(null);
      setShowForecast(true);
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
      setForecast([]);
      setShowForecast(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <h1 className="title">Live Weather App</h1>
      <div className="search-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
        />
        <button onClick={fetchWeather}>Get Weather</button>
      </div>

      {loading && <p className="loading">Fetching weather data...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="temperature">{weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p className="description">{weather.weather[0].description}</p>
        </div>
      )}

      {showForecast && forecast.length > 0 && (
        <div className="forecast-container">
          <h3>5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`}
                  alt={day.weather[0].description}
                />
                <p className="temperature">{day.main.temp}°C</p>
                <p>Humidity: {day.main.humidity}%</p>
                <p>Wind: {day.wind.speed} m/s</p>
                <p className="description">{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
