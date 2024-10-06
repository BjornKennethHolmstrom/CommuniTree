import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      primary: '#2ECC71',
      secondary: '#3498DB',
      accent: '#F39C12',
      background: '#ECF0F1',
      text: '#34495E',
    },
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
})

export default theme
