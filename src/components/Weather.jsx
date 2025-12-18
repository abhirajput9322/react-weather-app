import React, { useState, useEffect } from "react";
import './Weather.css';

const API_KEY = "aab106bfb2b25db7088fc09da64c1eed";

function Weather() {
    const [city, setCity] = useState("Mumbai");
    const [queryCity, setQueryCity] = useState("Mumbai");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!queryCity) return;

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchWeather = async () => {
            setLoading(true);
            setError(null);

            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(queryCity)}&units=metric&appid=${API_KEY}`;
                const res = await fetch(url, { signal });

                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("City not found");
                    }
                    throw new Error("Failed to fetch weather data");
                }

                const data = await res.json();
                setWeather(data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();

        return () => controller.abort();
    }, [queryCity]);

    const handleSearch = (e) => {
        e.preventDefault();
        setQueryCity(city);
    };

    if (loading) return <div className="loading">Loading weather...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="weather-container">
            <div className="search-section">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city name"
                        className="city-input"
                    />
                    <button type="submit" className="search-btn">
                        Search
                    </button>
                </form>
            </div>

            {weather && (
                <div className="weather-card">
                    <div className="main-weather">
                        <div className="temp">{Math.round(weather.main.temp)}°C</div>
                        <div className="description">
                            {weather.weather[0].description}
                            <span className="weather-icon">
                                {getWeatherIcon(weather.weather[0].main)}
                            </span>
                        </div>
                    </div>

                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="label">City:</span>
                            <span>{weather.name}, {weather.sys.country}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Humidity:</span>
                            <span>{weather.main.humidity}%</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Wind:</span>
                            <span>{weather.wind.speed} m/s</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Pressure:</span>
                            <span>{weather.main.pressure} hPa</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const getWeatherIcon = (main) => {
    if (main === 'Clear') return '☀';
    if (main === 'Clouds') return '☁';
    if (main === 'Rain') return '🌧';
    if (main === 'Snow') return '❄';
    if (main === 'Thunderstorm') return '⛈';
    return '🌤';
};

export default Weather;