var request = require('superagent');

var ReceptorUrlApi = {
  create({receptorUrl}) {
    return new Promise(function(resolve, reject) {
      request.post('/receptor_url')
        .accept('json')
        .send({receptor_url: receptorUrl})
        .end(function(err, res) {
          if (err) reject(err);
          resolve(res);
        });
    });

  }
};

module.exports = ReceptorUrlApi;