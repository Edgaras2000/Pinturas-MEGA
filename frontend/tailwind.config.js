module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 0deg, var(--tw-gradient-stops))',
      },
      colors: {
        'mercado': '#f0ecec',
        'boton_azul': '#e8ecfc',
        'cyan_caca': '#03fbfc',
        'magenta_caca': '#e9074f',
        'amarillo_caca': '#fecf02',
        'boton_azul_letra': '#5193fc',
        "fondo_crud": "#1f2937",
        'placeholder': '#a1a1aa',
        'Mercado': '#ebeaea',
      },
      height: {
        '128': '32rem', // 512px
        '144': '36rem', // 576px
        '160': '40rem', // 640px
        '176': '44rem', // 704px
        '192': '48rem', // 768px
        '208': '52rem', // 832px
        '224': '56rem', // 896px
      },
      width: {
        '128': '32rem',
        '144': '36rem',
        '200': '50rem',
        '256': '64rem', // 64rem
        '288': '72rem', // 72rem
        '320': '80rem', // 80rem
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.9)',
        '4xl': '3px 5px 4px 5px rgba(0, 0, 0, 0.4)',
        '2.5xl': '0 2px 2px 2px rgba(0, 0, 0, 0.1)',
        'inner-xl': 'inset 0 20px 50px rgba(0, 0, 0, 0.2)', // Sombra interna más grande
        'inner-2xl': 'inset 0 40px 80px rgba(0, 0, 0, 0.3)', // Sombra aún más grande
      },
      flex: {
        '1.5': '2.4 1 0%',
        '1.7': '0.5 1 0%',
      },
      keyframes: {
        'color-change': {
          '0%, 100%': { backgroundColor: '#10B981' }, // emerald-500
          '50%': { backgroundColor: '#4F46E5' },      // indigo-700
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        colorFade: {
          '0%': { color: 'rgb(16 185 129)' }, // emerald-800
          '100%': { color: 'rgb(110 231 183)' }, // emerald-400
        },
        // Animación para el efecto neón
        'neon-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.8), 0 0 20px rgba(16, 185, 129, 0.6)',
          },
          '50%': {
            boxShadow: '0 0 15px rgba(16, 185, 129, 1), 0 0 30px rgba(16, 185, 129, 0.8)',
          },
        },
        // Animación para el gradiente en movimiento
        gradientX: {
          '0%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '0% 100%' },
          '100%': { backgroundPosition: '100% 0%' },
        },
      },
      animation: {
        'color-cycle': 'color-change 6s infinite',
        gradient: 'gradient 6s infinite',
        colorFade: 'colorFade 2s ease-in-out forwards',
        neon: 'neon-pulse 2s infinite',
        // Animación de gradiente en movimiento
        'gradient-x': 'gradientX 5s ease infinite',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Agrega la fuente Inter aquí
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
