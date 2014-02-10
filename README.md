nextbus.js
==========

[![build status](https://secure.travis-ci.org/rf/nextbusjs.png)](http://travis-ci.org/rf/nextbusjs)

A reasonable interface to nextbus written in Javascript, targeting both
Appcelerator Titanium and Node.JS.

First `npm install nextbusjs`.  Then:

````javascript
    var rutgers = require('nextbusjs').client();
    rutgers.cacheAgency('rutgers', function (err) {
       if (err) {
          throw err;
       } else {
          rutgers.routePredict('a', null, function (err, data) {
             // data will contain:
             [ { title: 'Scott Hall',
                 predictions: [ '8', '19', '31', '43', '54' ] },
               { title: 'Student Activities Center',
                 predictions: [ '12', '23', '35', '47', '58' ] },
               { title: 'Visitor Center',
                 predictions: [ '3', '16', '27', '39', '51' ] },
               { title: 'Stadium',
                 predictions: [ '4', '17', '28', '40', '52' ] },
               { title: 'Werblin Back Entrance',
                 predictions: [ '6', '19', '30', '42', '54' ] },
               { title: 'Hill Center',
                 predictions: [ '7', '20', '31', '43', '55' ] },
               { title: 'Science Building',
                 predictions: [ '8', '22', '33', '45', '57' ] },
               { title: 'Library of Science',
                 predictions: [ '10', '23', '34', '46', '58' ] },
               { title: 'Busch Suites',
                 predictions: [ '1', '12', '25', '36', '48' ] },
               { title: 'Busch Campus Center',
                 predictions: [ '2', '13', '27', '38', '50' ] },
               { title: 'Buell Apartments',
                 predictions: [ '4', '15', '28', '39', '51' ] },
               { title: 'Werblin Main Entrance',
                 predictions: [ '5', '16', '29', '40', '52' ] },
               { title: 'Rutgers Student Center',
                 predictions: [ '10', '21', '34', '45', '57' ] } ]
          }, 'minutes');
          rutgers.stopPredict('Hill Center', null, function (err, data) {
             // data will contain:
             [ { direction: 'To Busch Student Center',
                 title: 'A',
                 predictions: [ '7', '20', '31', '43', '55' ] },
               { direction: 'To Busch Student Center',
                 title: 'B',
                 predictions: [ '8', '16', '22', '30', '38' ] },
               { direction: 'To Allison Road Classrooms',
                 title: 'C',
                 predictions: null },
               { direction: 'To Allison Road Classrooms',
                 title: 'REX B',
                 predictions: [ '6', '20', '23', '35', '47' ] },
               { direction: 'To Livingston Student Center',
                 title: 'All Campuses',
                 predictions: null },
               { direction: 'To Livingston Student Center',
                 title: 'Weekend 1',
                 predictions: null },
               { direction: 'To Stadium West Lot',
                 title: 'C',
                 predictions: null },
               { direction: 'To Rutgers Student Center',
                 title: 'H',
                 predictions: [ '1', '13', '24', '36', '48' ] },
               { direction: 'To College Hall',
                 title: 'REX B',
                 predictions: [ '0', '12', '24', '35', '47' ] },
               { direction: 'To Rutgers Student Center',
                 title: 'Weekend 2',
                 predictions: null } ]
          }, 'minutes');
          var nearest = rutgers.closestStops(40.40264, -74.3840120);
          //{ 'Rutgers Student Center': 7,
          //  'Student Activities Center': 6,
          //  'Scott Hall': 5 }
       }
    });
````

Documentation
=============

A short tutorial of the features is available on the [wiki](https://github.com/rf/nextbusjs/wiki).

License
=======

MIT.
