var primeroCountries;
var result = [];

function setCountries(countryList) {
  primeroCountries = countryList;
}

/*function test(files) {
  d3.csv("/dataFiles/perCapitaFoodSupply.csv", function(data){
    d3.csv("/dataFiles/undernourishment.csv", function(data2) {
      var foodData = d3.nest()
        .key(d => d['Country name'])
        .entries(data);

      var undernourishmentData = d3.nest()
        .key(d => d['Country name'])
        .entries(data2);

      var result = merge(foodData, undernourishmentData);
    });
  });
}*/

//sorts data by country, then adds the data source to the end
function sort(data, fileName) {
  var countries = primeroCountries;

  var sorted = d3.nest()
    .key(d => d['Country name'])
    .entries(data)
    .filter(d => countries.includes(d.key));
  sorted.push(fileName);

  return sorted;
}

//loads all data file, sorts
function coagData(files, dataArray, startAt, callback) {
  d3.csv("/dataFiles/" + files[startAt], function(data5) {
    dataArray.push(sort(data5, files[startAt]));

    if (startAt == files.length-1) {//if last file has been loaded
      callback(join(dataArray)); //goes back up through recursion and joins each data array to main array
    } else {
      startAt++;
      coagData(files, dataArray, startAt, callback); //recurses until last file is loaded
    }
  });
}


//joins together an array of sorted data with the main array
function join(data) {
  var joinedData = data[0];
  var remainingData = data;
  for(var r = 1; r<remainingData.length; r++){
    joinedData = merge(joinedData, remainingData[r], remainingData[r][remainingData[r].length-1]);
  }

  return joinedData;
}

//merges two data arrays into one based on country
function merge(data1, data2, property) {
  var mergedData = data1;
  var countryCodes = primeroCountries;

  for(var t =0; t<countryCodes.length; t++) {
    var index1 = data1.findIndex(d => d.key === countryCodes[t]);
    var index2 = data2.findIndex(d => d.key === countryCodes[t]);

    if (index1 != -1 && index2 !=-1) { //if they both contain the country
      mergedData[index1][property] = data2[index2];
    } else if ( index1 == -1 && index2 !=-1) {
      mergedData.push(data2[index2]);
    } //if only the second array has the country, add it to the general array
  }

  return mergedData;
}