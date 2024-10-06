import { extendTheme } from '@chakra-ui/react';

const baseTheme = {
  // ... (your base theme)
};

const weatherThemes = {
  sunny: {
    colors: {
      primary: '#FFD700',
      background: '#87CEEB',
    },
  },
  rainy: {
    colors: {
      primary: '#4682B4',
      background: '#708090',
    },
  },
  snowy: {
    colors: {
      primary: '#F0F8FF',
      background: '#B0E0E6',
    },
  },
  // Add more weather conditions...
};

const regionThemes = {
  tropical: {
    colors: {
      accent: '#FF4500',
    },
  },
  arctic: {
    colors: {
      accent: '#E0FFFF',
    },
  },
  // Add more regions...
};

export const getTheme = (weather, region) => {
  const weatherTheme = weatherThemes[weather] || {};
  const regionTheme = regionThemes[region] || {};

  return extendTheme(baseTheme, weatherTheme, regionTheme);
};
