/**
 * Copyright (c) 2011, Sun Ning, with edits by Russell Frank.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*
   Class: geohash
   Geohashing algorithm in javascript.  Allows us to find the nearest stop to
   the user.
*/
var BASE32_CODES = "0123456789bcdefghjkmnpqrstuvwxyz",
    BASE32_CODES_DICT = {},
    i;
for (i = 0; i < BASE32_CODES.length; i++) {
   BASE32_CODES_DICT[BASE32_CODES.charAt(i)]=i;
}

/*
   Function: encode
   Encodes a lat and long to produce a geohash

   Parameters;
     latitude   - *Number* 
     longitude   - *Number*
     numberOfChars - *Number* precision of the calculation, can be undefined
*/
function encode (latitude, longitude, numberOfChars) {
   numberOfChars = numberOfChars || 15;
   var chars = [], 
      bits = 0,
      hash_value = 0,
      maxlat = 90, minlat = -90,
      maxlon = 180, minlon = -180,
      mid,
      islon = true;

   while (chars.length < numberOfChars) {
      if (islon){
         mid = (maxlon+minlon)/2;
         if(longitude > mid){
            hash_value = (hash_value << 1) + 1;
            minlon=mid;
         } else {
            hash_value = (hash_value << 1);
            maxlon=mid;
         }
      } else {
         mid = (maxlat+minlat)/2;
         if (latitude > mid ){
            hash_value = (hash_value << 1) + 1;
            minlat = mid;
         } else {
            hash_value = (hash_value << 1);
            maxlat = mid;
         }
      }
      islon = !islon;

      bits++;
      if (bits === 5) {
         var code = BASE32_CODES[hash_value];
         chars.push(code);
         bits = 0;
         hash_value = 0;
      } 
   }
   return chars.join('');
}

function decode_bbox (hash_string) {
   var islon = true,
      maxlat = 90, 
      minlat = -90,
      maxlon = 180, 
      minlon = -180,
      hash_value = 0, 
      i, 
      bits, 
      code,
      mid,
      bit;

   for (i = 0; i < hash_string.length; i++) {
      code = hash_string[i].toLowerCase();
      hash_value = BASE32_CODES_DICT[code];
      for (bits = 4; bits >= 0; bits--) {
         bit = (hash_value >> bits) & 1;
         if (islon) {
            mid = (maxlon+minlon)/2;
            if (bit === 1) {
               minlon = mid;
            } else {
               maxlon = mid;
            }
         } else {
            mid = (maxlat+minlat)/2;
            if (bit === 1) {
               minlat = mid;
            } else {
               maxlat = mid;
            }
         }
         islon = !islon;
      }
   }
   return [minlat, minlon, maxlat, maxlon];
}

function decode (hash_string) {
   var bbox = decode_bbox(hash_string),
       lat = (bbox[0]+bbox[2])/2,
       lon = (bbox[1]+bbox[3])/2,
       laterr = bbox[2]-lat,
       lonerr = bbox[3]-lon;

   return {
     latitude   : lat, 
     longitude  : lon, 
     error      : {
        latitude    : laterr, 
        longitude   : lonerr
     }
   };
}

/*
   Function: nearest
   Gets the nearest locations to the current one.  Stolen from
   http://www.synchrosinteractive.com/blog/1-software/38-geohash
   Loops through all locations and does a strcmp with the provided hash.
   Keeps trying with a smaller portion of the location hashes until a
   match is found.

   Parameters:
      currentLocation   - *string geohash* geohash of current location
      locations         - *array of object* array of objects where each object
                          has a geoHash property
      maxNeighbors      - *Number* max # of neighbors to return
      accuracy          - *Number* accuracy, can be undefined, defaults to 7,
                          higher is more accurate

   Returns: 
      *object* object of matching locations, maps location name
                          to the accuracy
*/
function nearest (currentLocation, locations, maxNeighbors, accuracy) {
   var matching = {}, matchCount = 0, cmpHash, i, ret, loc, title;
   accuracy = accuracy || 8;
   while (matchCount < maxNeighbors && accuracy > 0) {
      cmpHash = currentLocation.substring(0, accuracy);
      for (loc in locations) if (locations.hasOwnProperty(loc)) {
         if (locations[loc].title) {
            title = locations[loc].title;
         } else {
            title = loc;
         }
         if (matching.hasOwnProperty(loc)) {
            // don't re-check locations we already know match
            continue;
         }
         if (locations[loc].geoHash.substring(0, accuracy) === cmpHash) {
            matching[title] = accuracy;
            matchCount++;
            if (matchCount === maxNeighbors) {
               break;
            }
         }
      }
      accuracy -= 1;
   }
   return matching;
}

exports.encode = encode;
exports.decode = decode;
exports.nearest = nearest;
