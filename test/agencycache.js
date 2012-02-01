var vows       = require('vows'),
    assert     = require('assert'),
    nextbus    = require('../lib/index').client,
    jsv        = require('JSV').JSV.createEnvironment(),
    readfile   = require('fs').readFile,
    async      = require('async'),
    rutgers    = nextbus(),
    invalidnb  = nextbus(),
    dtconn     = nextbus();

var suite = vows.describe('just agency cache');

suite.addBatch({
   'rutgers' : {
      topic    : function () { rutgers.cacheAgency('rutgers', this.callback); },
      'doesnt break' : function (topic) {
         //console.dir(topic);
         assert.isObject(topic);
      }
   }
});

suite.export(module);

