import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
          const apiKey = '11fdc8a5303dbdd5b77d869aa752e3da'; // not using .env for the assignment purpose only
          
          // Get latitude and longitude of the city by its name
          const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
          const geoResponse = await fetch(geoApiUrl);
          if (!geoResponse.ok) {
            throw new Error('City not found');
          }
          const [cityData] = await geoResponse.json();
          const { lat, lon } = cityData;
          
          // Now, use latitude and longitude to get weather data
          const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
          const weatherResponse = await fetch(weatherApiUrl);
          if (!weatherResponse.ok) {
            throw new Error('Weather data not available for this city');
          }
          const weatherData = await weatherResponse.json();
          setWeatherData(weatherData);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      

    if (city) {
      fetchData();
    }

  }, [city]);
  useEffect(()=>{
    setError(null);

},[error])

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (city.trim()) {
      setWeatherData(null); 
      setError(null); 
    }
   
  };

  return (
    <div>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
       
      
      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Description: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
