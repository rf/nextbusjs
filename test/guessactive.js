var vows       = require('vows'),
    assert     = require('assert'),
    nextbus    = require('../lib/index').client,
    jsv        = require('JSV').JSV.createEnvironment(),
    readfile   = require('fs').readFile,
    async      = require('async'),
    rutgers    = nextbus(),
    invalidnb  = nextbus(),
    dtconn     = nextbus();

var suite = vows.describe('guess active');

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

function isValidRouteList (err, data) {
   assert.isArray(data);
   data.forEach(function (val) {
      assert.isString(val.tag);
      assert.isString(val.title);
   });
   //console.dir(data);
}

function isValidStopList (err,data) {
   assert.isArray(data);
   data.forEach(function (val) {
      assert.isString(val.geoHash);
      assert.isString(val.title);
   });
   //console.dir(data);
}

suite.addBatch({
   'caching agency' : {
      topic    : function () { rutgers.cacheAgency('rutgers', this.callback); },
      'doesnt break' : function (topic) {
         assert.isObject(topic);
      },
      'guessActive' : {
         topic : function () { rutgers.guessActive(this.callback); },
         'valid return' : function (err, data) {
            assert.isNull(err);
            assert.isObject(data);
            assert.isArray(data.routes);
            assert.isArray(data.stops);
            data.routes.forEach(function (val) {
               assert.isString(val.tag);
               assert.isString(val.title);
            });
            data.stops.forEach(function (val) {
               assert.isString(val.geoHash);
               assert.isString(val.title);
            });
            //console.dir(data);
         }
      },
      'getRoutes': {
         topic: function() { this.callback(null, rutgers.getRoutes()); },
         'valid return': isValidRouteList
      },
      'getStops': {
         topic: function () { this.callback(null, rutgers.getStops()); },
         'valid return': isValidStopList
      }
   }
});

suite.export(module);

