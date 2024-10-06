import axios from 'axios';

export const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const cache = new Map();

export const cachedFetch = async (key, fetchFunction) => {
  const cachedData = cache.get(key);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  const data = await fetchFunction();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

export const getLocation = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (err) => reject(err)
      );
    }
  });
};

export const getWeather = async (lat, lon) => {
  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  
  const response = await axios.get(url);
  return response.data;
};

export const getRegion = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  
  const response = await axios.get(url);
  return response.data.address.country;
};
