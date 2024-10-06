import { extendTheme } from '@chakra-ui/react';

const baseTheme = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    body: "Roboto, system-ui, sans-serif",
    heading: "Montserrat, sans-serif",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
    },
  },
};

export const themes = {
  default: {
    colors: {
      brand: {
        50: '#E6FFFA',
        100: '#B2F5EA',
        500: '#38B2AC',
        600: '#319795',
        700: '#2C7A7B',
      },
    },
  },
  tropical: {
    colors: {
      brand: {
        50: '#FFFAF0',
        100: '#FEEBC8',
        500: '#DD6B20',
        600: '#C05621',
        700: '#9C4221',
      },
    },
  },
  continental: {
    colors: {
      brand: {
        50: '#F0FFF4',
        100: '#C6F6D5',
        500: '#38A169',
        600: '#2F855A',
        700: '#276749',
      },
    },
  },
  polar: {
    colors: {
      brand: {
        50: '#EBF8FF',
        100: '#BEE3F8',
        500: '#3182CE',
        600: '#2B6CB0',
        700: '#2C5282',
      },
    },
  },
  darkMode: {
    colors: {
      brand: {
        50: '#F7FAFC',
        100: '#EDF2F7',
        500: '#718096',
        600: '#4A5568',
        700: '#2D3748',
      },
    },
  },
};

export const getTheme = (themeName, colorMode = 'light') => {
  const selectedTheme = themes[themeName] || themes.default;
  const darkModeColors = themes.darkMode.colors;
  
  const themeWithColorMode = {
    ...selectedTheme,
    colors: colorMode === 'dark' ? { ...selectedTheme.colors, ...darkModeColors } : selectedTheme.colors,
  };

  return extendTheme(baseTheme, themeWithColorMode);
};

export { baseTheme };
