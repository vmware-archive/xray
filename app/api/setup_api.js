var request = require('superagent');

var SetupApi = {
  create({receptorUrl}) {
    return new Promise(function(resolve, reject) {
      request.post('/setup')
        .accept('json')
        .send({receptor_url: receptorUrl})
        .end(function(err, res) {
          if (err) reject(err);
          resolve(res);
        });
    });

  }
};

module.exports = SetupApi;