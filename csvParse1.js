"use strict";

var primeroCountries;
var result = [];

function setCountries(countryList) {
  primeroCountries = countryList;
}

//sorts data by country, then adds the data source to the end
function sort(data, fileName) {
  var countries = primeroCountries;

  var sorted = d3.nest().key(function (d) {
    return d['Country name'];
  }).entries(data).filter(function (d) {
    return countries.includes(d.key);
  });
  sorted.push(fileName);

  return sorted;
}

//loads all data file, sorts
function coagData(dataServerPath, files, map, dataArray, startAt, callback) {
  d3.csv(dataServerPath + map[files[startAt]], function (data5) {
    dataArray.push(sort(data5, map[files[startAt]]));

    if (startAt == files.length - 1) {
      //if last file has been loaded
      callback(join(dataArray)); //goes back up through recursion and joins each data array to main array
    } else {
      startAt++;
      coagData(dataServerPath, files, map, dataArray, startAt, callback); //recurses until last file is loaded
    }
  });
}

//joins together an array of sorted data with the main array
function join(data) {
  var joinedData = data[0];
  var remainingData = data;
  for (var r = 1; r < remainingData.length; r++) {
    joinedData = merge(joinedData, remainingData[r], remainingData[r][remainingData[r].length - 1]);
  }

  return joinedData;
}

//merges two data arrays into one based on country
function merge(data1, data2, property) {
  var mergedData = data1;
  var countryCodes = primeroCountries;
  //if no data is available for a country add a null set for it
  var null_set = $.extend(true,{},data2[0]);
  for (var key in null_set.values[0]) {
    null_set.values[0][key] = "";
  }

  for (var t = 0; t < countryCodes.length; t++) {
    var index1 = data1.findIndex(function (d) {
      return d.key === countryCodes[t];
    });
    var index2 = data2.findIndex(function (d) {
      return d.key === countryCodes[t];
    });

    if (index1 != -1 && index2 != -1) {
      //if they both contain the country
      mergedData[index1][property] = data2[index2];
    } else if (index1 == -1 && index2 != -1) {
      mergedData.push(data2[index2]);
    } else if (index1 != -1 && index2 == -1) {
      null_set.key = countryCodes[t];
      mergedData[index1][property] = null_set;
    } else if (index1 == -1 && index2 == -1) {
      null_set.key = countryCodes[t];
      mergedData.push(null_set);
    }
  }

  return mergedData;
}