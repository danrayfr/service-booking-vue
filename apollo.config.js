// apollo.config.js
module.exports = {
  client: {
    service: {
      name: 'static_app',
      // URL to the GraphQL API
      url: 'https://service-booking.onrender.com/graphql',
    },
    // Files processed by the extension
    includes: [
      'src/**/*.vue',
      'src/**/*.js',
    ],
  },
}