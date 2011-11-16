var geohash = require('../lib/geohash'),
    vows    = require('vows'),
    assert  = require('assert');

var suite = vows.describe('geohash tests');

var checkstr = function (str) {
   return function (topic) {
      assert.notEqual(topic.indexOf(str), -1);
   };
};

var locs = [
   {
      name     : 'palo alto',
      geoHash  : '9q9jh844v2gw23c',
   },
   {
      name     : 'white house',
      geoHash  : 'dqcjr1074ze2m4e',
   }
];

suite.addBatch({
   'encode' : {
      'white house' : {
         topic    : geohash.encode(38.8976500, -77.0356669),
         'valid return' : checkstr('dqcjr1074ze2m')
      },
      'palo alto' : {
         topic    : geohash.encode(37.4418834, -122.1430195),
         'valid return' : checkstr('9q9jh844v2gw2')
      }
   }/*,
   'nearest' : {
      topic    : geohash.nearest('9q9huhc7hngxu', locs, 1, 2),
      'valid return' : function (topic) {
         console.log(topic);
      }
   }*/
});

suite.export(module);
