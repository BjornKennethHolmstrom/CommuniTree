import { useState, useEffect } from 'react';

const useLocationTheme = () => {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const getLocationTheme = async () => {
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const { latitude } = position.coords;
          
          // Determine theme based on latitude
          if (latitude < 23.5 && latitude > -23.5) {
            setTheme('tropical');
          } else if (latitude >= 23.5 && latitude <= 66.5) {
            setTheme('continental');
          } else if (latitude < -23.5 && latitude >= -66.5) {
            setTheme('continental');
          } else {
            setTheme('polar');
          }
        } catch (error) {
          console.error('Error getting location:', error);
          setTheme('default');
        }
      } else {
        console.log('Geolocation is not supported by this browser.');
        setTheme('default');
      }
    };

    getLocationTheme();
  }, []);

  return theme;
};

export default useLocationTheme;
