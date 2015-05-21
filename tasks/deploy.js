var gulp = require('gulp');
var runSequence = require('run-sequence');
var {spawn} = require('child_process');
const DEPLOY_ENVIRONMENTS = require('../config/deploy.json');

gulp.task('blue-green-deploy', function(callback) {
  if (!(process.env.ENV in DEPLOY_ENVIRONMENTS)) {
    return callback('Please set ENV to pws or staging');
  }
  var deployEnv = DEPLOY_ENVIRONMENTS[process.env.ENV];
  var uppercaseDeployEnv = Object.keys(deployEnv).reduce((memo, key) => (memo[key.toUpperCase()] = deployEnv[key], memo), {});
  var env = Object.assign(
    {},
    process.env,
    uppercaseDeployEnv
  );
  spawn('bash', ['-c', 'scripts/blue-green-deploy.sh'], {stdio: 'inherit', env}).on('close', callback);
});

gulp.task('deploy', function(callback) {
  var env = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  runSequence('assets', 'blue-green-deploy', function() {
    process.env.NODE_ENV = env;
    callback();
  });
});