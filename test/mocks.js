var vows       = require('vows'),
    assert     = require('assert'),
    nextbus    = require('../lib/index').client,
    jsv        = require('JSV').JSV.createEnvironment(),
    readfile   = require('fs').readFile,
    async      = require('async'),
    nock       = require('nock'),
    rutgers    = nextbus(),
    invalidnb  = nextbus(),
    dtconn     = nextbus();

var baseURL = 'http://webservices.nextbus.com';
var getPath = '/service/publicXMLFeed';

var suite = vows.describe('mocked server responses');

// Use separate batches to make sure the queries run sequentially

suite.addBatch({
    'agency cache on bad response': {
        topic: function() {
            var mockRutgersAgency = nock(baseURL)
                .get(getPath)
                .query({command: 'routeConfig', a: 'rutgers'})
                .reply(404);
            rutgers.cacheAgency('rutgers', this.callback);
        },
        'throws an error for bad cache attempt': function (err, data) {
            assert.isNotNull(err);
        }
    }
});

suite.addBatch({
    'agency cache on good response': {
        topic: function() {
            var mockRutgersAgency = nock(baseURL)
                .get(getPath)
                .query({command: 'routeConfig', a: 'rutgers'})
                .replyWithFile(200, __dirname+'/replies/rutgers_routeConfig.xml');
            rutgers.cacheAgency('rutgers', this.callback);
        },
        'cached mock routeConfig for rutgers': function (err, data) {
            assert.isObject(data);
        }
    }
});

suite.addBatch({
    'vehicleLocations 503 response handling (after a valid cache)' : {
        topic: function () {
            var mock503 = nock(baseURL)
                .get(getPath)
                .query(true)
                .replyWithFile(503, __dirname+'/replies/503.html');
            rutgers.vehicleLocations(null, this.callback, true);
        },
        'throws an error for bad response code' : function (err, data) {
            assert.isNotNull(err);
        }
    }
});

suite.addBatch({
    'vehicleLocations 200 empty response handling (after a valid cache)' : {
        topic: function() {
            var mockEmpty = nock(baseURL)
                .get(getPath)
                .query(true)
                .reply(200, '');
            rutgers.vehicleLocations(null, this.callback, true);
        },
        'throws an error for empty 200 response' : function (err, data) {
            assert.isNotNull(err);
        }
    }
});

suite.export(module);
