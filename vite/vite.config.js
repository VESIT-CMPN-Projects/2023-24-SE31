// vite.config.js
import { resolve } from 'path';

export default {
  build: {
    sourcemap: true,
    outDir: '../dist',
    rollupOptions: {
      input: {
        base: resolve(__dirname, 'base.html'),

        crop: resolve(__dirname, 'crop.html'), // classification
        yield: resolve(__dirname, 'yield.html'), // regression
        price: resolve(__dirname, 'forecast.html'), // time series

        home: resolve(__dirname, 'home.html'),
        landing: resolve(__dirname, 'landing.html'),

        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      },
    },
  },
}