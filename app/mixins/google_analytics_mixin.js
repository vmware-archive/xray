var googleAnalytics = require('../vendor/google_analytics');

module.exports = {
  componentDidMount() {
    googleAnalytics.init(window, document);
  }
};