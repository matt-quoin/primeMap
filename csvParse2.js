function csvParse(callback, year2){ //direction of 1 is country:id
    
    var primeroCountries = getKey();

    d3.csv("/refugeeData2013.csv", function(data){
        var sortedData = [];
        var years = {};
        var yearPointer = data.length-1;
        var yearTracker = 1975;
        
        for (var y=1975; y<=2013; y++){
            years[y] = [];
        }
   
        for(var p = 1975; p<=2013; p++){

            while(data[yearPointer].Year == yearTracker){
                if(yearPointer < 0){break;}

                var country = data[yearPointer]["Country or territory of origin"]; //main object
                var residence = data[yearPointer]["Country or territory of asylum or residence"]; //gets current country object name; attribute

            try{
                    primeroCountries[country][residence] = data[yearPointer]["Refugees<sup>*</sup>"];
            }
                catch(err){
                
            }
            
            yearPointer--;
            if(yearPointer < 0)break;
 
        }
     
            years[yearTracker].push(primeroCountries);
            primeroCountries = getKey();
            yearTracker++;
        }
        
   callback(years, year2);
    
    });
}