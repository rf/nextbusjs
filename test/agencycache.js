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

var isValidPredictions = function (err, data) {
   var item;
//   console.log(data);
   if (err) {
      throw err;
   }
   if (data !== null) {
      assert.isObject(data);
      for (item in data) {
         if (data.hasOwnProperty(item)) {
            if (data[item] !== null) {
               assert.isArray(data[item]);
               data[item].forEach(function (val) {
                  assert.isNumber(Number(val));
               });
            }
         }
      }
   } else {
      assert.isNull(data);
   }
};

suite.addBatch({
   'rutgers' : {
      topic    : function () { rutgers.cacheAgency('rutgers', this.callback); },
      'doesnt break' : function (topic) {
         assert.isObject(topic);
      }
   }
});

suite.export(module);

