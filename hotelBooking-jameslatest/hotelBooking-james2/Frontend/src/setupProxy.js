// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/hotels',
    createProxyMiddleware({
      target: 'https://hotelapi.loyalty.dev',
      changeOrigin: true,
      pathRewrite: {
        '^/api/hotels': '/api/hotels',
      },
    })
  );

  app.use(
    '/api/hotels/prices',
    createProxyMiddleware({
      target: 'https://hotelapi.loyalty.dev',
      changeOrigin: true,
      pathRewrite: {
        '^/api/hotels/prices': '/api/hotels/prices',
      },
    })
  );
};
