"use strict";

function csvParse(callback, year2) {
  var primeroCountries = getKey();
  d3.csv("/refugeeData2013.csv", function (data) {
    var sortedData = [];
    var years = {};
    var yearPointer = data.length - 1;
    var yearTracker = 1975;

    for (var y = 1975; y <= 2013; y++) {
      years[y] = [];
    }

    for (var p = 1975; p <= 2013; p++) {
      while (data[yearPointer].Year == yearTracker) {
        //data is listed by year, so continues as long as the year column is equal to yearTrakcer
        var country = data[yearPointer]["Country or territory of origin"];
        var residence = data[yearPointer]["Country or territory of asylum or residence"]; //gets current country object name; attribute

        try {
          primeroCountries[country][residence] = data[yearPointer]["Refugees<sup>*</sup>"];
        } catch (err) {
          //do nothing, will throw an error if there is no data available for that country, in which case the country will simply not be highlighted
        }

        yearPointer--;
        if (yearPointer < 0) {
          break; //break if it's the last year
        }
      }
      years[yearTracker].push(primeroCountries); //adds data
      primeroCountries = getKey(); //getKey from countryParse returns all countries + ISO codes
      yearTracker++;
    }

    callback(years, year2);
  });
}