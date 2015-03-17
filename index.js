var recluster = require('recluster'),
  path = require('path');

var cluster = recluster(path.join(__dirname, 'server', 'bootstrap.js'), {readyWhen: 'ready', workers: 1});
cluster.run();

process.on('SIGUSR2', function() {
  console.log('Got SIGUSR2, reloading cluster...');
  cluster.reload();
});

console.log('spawned cluster, kill -s SIGUSR2', process.pid, 'to reload');