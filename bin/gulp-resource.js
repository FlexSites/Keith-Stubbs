var request = require('http').get
  , argv = require('yargs').argv
  , path = require('path');

var pkg = require(process.cwd()+'/package.json');

var config = {
  getSites: function(siteId, next) {
    this.grequest('/sites'+(siteId?'/'+siteId:''), next);
  },
  getSiteByHost: function(host, next) {
    this.grequest('/sites?filter[where][host]='+host.replace(/\./g, '%2E'), next);
  },
  getPages: function(siteId, next) {
    this.grequest('/pages?filter[where][site]=' + siteId, next);
  },
  getPrefix: function(){
    var env = this.getEnv();
    if(env === 'prod') return '';
    return env;
  },
  grequest: function(path, next) {
    var prefix = this.getPrefix();

    request({
      hostname: prefix + 'api.flexsites.io',
      port: 80,
      path: '/api/v1' + path,
      rejectUnauthorized: false
    }, function(res, error) {
      res.setEncoding('utf8');

      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });

      res.on('end', function() {
        next(null, JSON.parse(body));
      });
    }).on('error', function(err){
      if(err.code === 'ECONNREFUSED'){
        return next(new Error('Burgundy is not running.'));
      }
      next(err);
    });
  },
  getEnv: function(){
    if (process.env.NODE_ENV) return process.env.NODE_ENV;
    var env = 'local';
    if (argv.t || argv.test) {
      env = 'test';
    } else if (argv.p || argv.prod) {
      env = 'prod';
    }
    return env;
  },
  isLocal: function(){
    return !(argv.t || argv.test || argv.p || argv.prod);
  },
  isStage: function(){
    return argv.t || argv.test;
  },
  isProd: function(){
    return argv.p || argv.prod;
  },
  dest: 'public'
};

if(!config.isLocal){
  config.dest += pkg.version;
}

module.exports = config;
