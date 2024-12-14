const { defineConfig } = require('@vue/cli-service')
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new (require('webpack')).DefinePlugin({
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false),
        // You can add more feature flags here if necessary
      })
    ]
  }
};

