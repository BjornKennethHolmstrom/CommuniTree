import { extendTheme } from '@chakra-ui/react';

const baseTheme = {
  fonts: {
    body: "Roboto, system-ui, sans-serif",
    heading: "Montserrat, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: 'brand.background',
        color: 'brand.text',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: {
          bg: 'brand.secondary',
          color: 'white',
          _hover: {
            bg: 'brand.accent',
          },
        },
      },
    },
  },
};

export const themes = {
  default: {
    colors: {
      brand: {
        primary: '#2ECC71',
        secondary: '#3498DB',
        accent: '#F39C12',
        background: '#ECF0F1',
        text: '#34495E',
      },
    },
  },
  sunny: {
    colors: {
      brand: {
        primary: '#FFD700',
        secondary: '#FF6347',
        accent: '#FFA500',
        background: '#87CEEB',
        text: '#000000',
      },
    },
  },
  rainy: {
    colors: {
      brand: {
        primary: '#4682B4',
        secondary: '#6A5ACD',
        accent: '#1E90FF',
        background: '#708090',
        text: '#F0F8FF',
      },
    },
  },
  forest: {
    colors: {
      brand: {
        primary: '#228B22',
        secondary: '#32CD32',
        accent: '#8FBC8F',
        background: '#F0FFF0',
        text: '#006400',
      },
    },
  },
  ocean: {
    colors: {
      brand: {
        primary: '#00CED1',
        secondary: '#20B2AA',
        accent: '#48D1CC',
        background: '#E0FFFF',
        text: '#000080',
      },
    },
  },
  desert: {
    colors: {
      brand: {
        primary: '#DEB887',
        secondary: '#D2691E',
        accent: '#CD853F',
        background: '#FFDAB9',
        text: '#8B4513',
      },
    },
  },
};

export const getTheme = (themeName) => {
  const selectedTheme = themes[themeName] || themes.default;
  return extendTheme(baseTheme, selectedTheme);
};
