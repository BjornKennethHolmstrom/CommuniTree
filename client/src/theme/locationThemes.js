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

// Base themes that users can select
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
  forest: {
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
  ocean: {
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
  desert: {
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
};

// Weather overlay themes
const weatherOverlays = {
  sunny: {
    styles: {
      global: {
        body: {
          bg: 'rgba(255, 244, 224, 0.2)',
        }
      }
    },
    colors: {
      overlay: '#FFD700',
    }
  },
  rainy: {
    styles: {
      global: {
        body: {
          bg: 'rgba(176, 196, 222, 0.2)',
        }
      }
    },
    colors: {
      overlay: '#4682B4',
    }
  },
  cloudy: {
    styles: {
      global: {
        body: {
          bg: 'rgba(211, 211, 211, 0.2)',
        }
      }
    },
    colors: {
      overlay: '#708090',
    }
  },
  snowy: {
    styles: {
      global: {
        body: {
          bg: 'rgba(255, 250, 250, 0.2)',
        }
      }
    },
    colors: {
      overlay: '#F0F8FF',
    }
  },
  stormy: {
    styles: {
      global: {
        body: {
          bg: 'rgba(47, 79, 79, 0.2)',
        }
      }
    },
    colors: {
      overlay: '#483D8B',
    }
  },
};

export const getTheme = (themeName, colorMode = 'light', weatherTheme = null) => {
  // Get base theme
  const selectedTheme = themes[themeName] || themes.default;
  
  // Apply dark mode adjustments if needed
  const themeWithColorMode = colorMode === 'dark' ? {
    ...selectedTheme,
    colors: {
      ...selectedTheme.colors,
      brand: {
        ...selectedTheme.colors.brand,
        50: selectedTheme.colors.brand[700],
        100: selectedTheme.colors.brand[600],
        700: selectedTheme.colors.brand[50],
      }
    }
  } : selectedTheme;

  // Apply weather overlay if present
  const weatherOverlay = weatherTheme ? weatherOverlays[weatherTheme] : null;
  
  // Combine all theme elements
  const finalTheme = weatherOverlay ? {
    ...baseTheme,
    ...themeWithColorMode,
    ...weatherOverlay,
  } : {
    ...baseTheme,
    ...themeWithColorMode,
  };

  return extendTheme(finalTheme);
};

export { baseTheme };
