"use strict";

var year = 2013;
var parsed;
var graphWidth = 900;
var mapWidth;
var mapHeight;
var graphWidth;
var graphHeight;
var width;
var height;
var height2;
var margin = { top: 20, right: 5, bottom: 20, left: 15 };
var marginCountryButton = { top: 2, right: 2, bottom: 2, left: 2 };
var graphLeftMargin = 20;
var dataSelect = ["perCapitaFoodSupply.csv", "undernourishment.csv", "poverty.csv"];
var selectButtonHeight = 20;
var primeCountries = ["AFGHANISTAN", "ALBANIA", "ALGERIA", "AMERICAN SAMOA", "ANDORRA", "ANGOLA", "ANGUILLA", "ANTIGUA AND BARBUDA", "ARGENTINA", "ARMENIA", "ARUBA", "IA", "AUSTRIA", "AZERBAIJAN", "BAHAMAS", "BAHRAIN", "BANGLADESH", "BARBADOS", "BELARUS", "BELGIUM", "BELIZE", "BENIN", "BERMUDA", "BHUTAN", "BOLIVIA", "BONAIRE", "BOSNIA-HERZEGOVINA", "BOTSWANA", "BOUVET ISLAND", "BRAZIL", "BRUNEI", "BULGARIA", "BURKINA FASO", "BURUNDI", "CAMBODIA", "CAMEROON", "CANADA", "CAPE VERDE", "CAYMAN ISLANDS", "CENTRAL AFRICAN REPUBLIC", "CHAD", "CHILE", "CHINA", "CHRISTMAS ISLAND", "COCOS (KEELING) ISLANDS", "COLOMBIA", "COMOROS", "CONGO", "CONGO (THE DEMOCRATIC REPUBLIC OF THE)", "COOK ISLANDS", "COSTA RICA", "CROATIA", "CUBA", "CYPRUS", "CZECH REP.", "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "ECUADOR", "EGYPT", "EL SALVADOR", "EQUATORIAL GUINEA", "ERITREA", "ESTONIA", "ETHIOPIA", "FALKLAND ISLANDS", "FAROE ISLANDS", "FIJI", "FINLAND", "FRANCE", "FRENCH GUIANA", "GABON", "GAMBIA", "GEORGIA", "GERMANY", "GHANA", "GIBRALTAR", "GREECE", "GREENLAND", "GRENADA", "GUATEMALA", "GUINEA", "GUINEA BISSAU", "GUYANA", "HAITI", "HOLY SEE", "HONDURAS", "HONG KONG", "HUNGARY", "ICELAND", "INDIA", "INDONESIA", "IRAN (ISLAMIC REPUBLIC OF)", "IRAQ", "IRELAND", "ISRAEL", "ITALY", "IVORY COAST", "JAMAICA", "JAPAN", "JORDAN", "KAZAKHSTAN", "KENYA", "KIRIBATI", "KOSOVO", "KUWAIT", "KYRGYZSTAN", "LAO PEOPLE'S DEMOCRATIC REPUBLIC", "LATVIA", "LEBANON", "LESOTHO", "LIBERIA", "LIBYA", "LIECHTENSTEIN", "LITHUANIA", "LUXEMBOURG", "MACAU", "MACEDONIA", "MADAGASCAR", "MALAWI", "MALAYSIA", "MALDIVES", "MALI", "MALTA", "MARSHALL ISLANDS", "MAURITANIA", "MAURITIUS", "MAYOTTE", "MEXICO", "MICRONESIA (FEDERATED STATES OF)", "MOLDOVA (THE REPUBLIC OF)", "MONACO", "MONGOLIA", "MONTENEGRO", "MONTSERRAT", "MOROCCO", "MOZAMBIQUE", "MYANMAR", "NAMIBIA", "NAURU", "NEPAL", "NETHERLANDS", "NETHERLANDS ANTILLES", "NEW ZEALAND", "NICARAGUA", "NIGER", "NIGERIA", "NIUE", "NORFOLK ISLAND", "KOREA (THE DEMOCRATIC PEOPLE'S REPUBLIC OF)", "NORTHERN MARIANA ISLANDS", "NORWAY", "OMAN", "PAKISTAN", "PALAU", "PANAMA", "PAPUA NEW GUINEA", "PARAGUAY", "PERU", "PHILIPPINES", "PITCAIRN ISLAND", "POLAND", "POLYNESIA (FRENCH)", "PORTUGAL", "PUERTO RICO", "QATAR", "RNION", "ROMANIA", "RUSSIA", "RWANDA", "SAINT HELENA", "SAINT KITTS AND NEVIS", "SAINT LUCIA", "SAINT PIERRE AND MIQUELON", "SAINT VINCENT AND GRENADINES", "SAMOA", "SAN MARINO", "SAO TOME AND PRINCIPE", "SAUDI ARABIA", "SENEGAL", "SERBIA", "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SINT MAARTEN", "SLOVAKIA", "SLOVENIA", "SOLOMON ISLANDS", "SOMALIA", "SOUTH AFRICA", "SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS", "KOREA (THE REPUBLIC OF)", "SOUTH SUDAN", "SOUTH SUDAN", "SPAIN", "SRI LANKA", "SUDAN", "SURINAME", "SVALBARD AND JAN MAYEN ISLANDS", "SWAZILAND", "SWEDEN", "SWITZERLAND", "SYRIA", "TAIWAN", "TAJIKISTAN", "TANZANIA (UNITED REPUBLIC OF)", "THAILAND", "TIMOR-LESTE (EAST TIMOR)", "TOGO", "TOKELAU", "TONGA", "TRINIDAD AND TOBAGO", "TUNISIA", "TURKEY", "TURKMENISTAN", "TURKS AND CAICOS ISLANDS", "TUVALU", "UGANDA", "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM", "UNITED STATES", "URUGUAY", "UZBEKISTAN", "VANUATU", "VENEZUELA", "VIETNAM", "VIRGIN ISLANDS", "WALLIS AND FUTUNA ISLANDS", "YEMEN", "ZAMBIA", "ZIMBABWE", "STATE OF PALESTINE"];
var primeCountriesLower = ["Angola", "Indonesia", "Kenya", "Nigeria", "Nepal", "Jordan", "South Sudan", "Sudan", "Sierra Leone"];
var prevCountry;
var parseDate = d3.timeParse("%Y");
var maxRefugees = 400000;
var mediaMap;
var transitionInProgress = false;
var mainScale = d3.scaleLog()
  .base(10)
  .domain([1, maxRefugees])
  .range([1, 10]);
var colorScaleLength = 10;
var yAxisLabelWidth = 9999;
var colorScale = d3.scaleLog()
  .domain([1, maxRefugees])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb("#007AFF"), d3.rgb('#FF0000')]);

var colorScaleLinear = d3.scaleLinear()
  .domain([1, maxRefugees])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb("#007AFF"), d3.rgb('#FF0000')]);

function clear() {
  d3.select("body")
    .select(".mapSVG")
    .select(".countries")
    .selectAll("path")
    .style("fill", "black");
}

function reDraw() {
  var topPanel = d3.select("#graph-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", "panelSVG");
  topPanel.append("g").attr("class", "xaxis");
  topPanel.append("g").attr("class", "yaxis");
  topPanel.append("defs").append("clipPath").attr("id", "clip");
  topPanel.append("g").attr("class", "graphTitle").append("text");


  topPanel.selectAll(".focus")
    .data(dataSelect)
    .enter()
    .append("g")
    .attr("class", function (d, i) {
      return "focus" + i;
    })
    .attr("transform", function (d, i) {
      var offset = 40 * i + 20;
      return "translate(" + margin.left + "," + offset + ")";
    });

  topPanel.append("g").attr("class", "dataSelecter"); //data select

  return topPanel;
}

function updateYear(yearChanged) {
  d3.select('.yearText').text(yearChanged);
}

function buildMap(dataServerPath, mediaFileMap,  initialize) {
  mediaMap = mediaFileMap;
  var data = [];
  var countCode;
  var divElement = d3.select("#map-container");
  var sidebarElement = d3.select("#side-bar-container");
  var yearElement = d3.select("#slider-year");
  var svg = divElement.append('svg')
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", '100%')
    .attr("height", '100%')
    .attr("class", "mapSVG");
  var sidePanel = sidebarElement.append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", "sidePanel");
  var yearDisplay = yearElement.append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", "yearDisplay");
  var topPanel = reDraw();
  var countries = svg
  .append("g")
    .attr("class", "countries");
  var movingCircles = svg.append("g")
    .attr("class", "movingCircle");
  var staticCircle = svg.append("g")
    .attr("class", "staticCircle");

  setCountries(primeCountries); //selects all countries for data parsing
  yearDisplay.append('text')
    .attr("class", "yearText")
    .attr("x", parseInt(yearDisplay.style("width")) / 2)
    .attr("y", parseInt(yearDisplay.style("height")) / 2)
    .style("text-anchor", "middle")
    .style("stroke", "black")
    .text("");
  graphWidth = parseInt(topPanel.style("width")); //gets number valus for svg widths and heights
  graphHeight = parseInt(topPanel.style("height"));
  width = graphWidth * .9;
  height = graphHeight * .16;
  height2 = graphHeight * .04;
  mapWidth = parseInt(svg.style("width"));
  mapHeight = parseInt(svg.style("height"));

  var buttonWidth = (parseInt(sidePanel.style("width")) - ((marginCountryButton.right + marginCountryButton.left) * 9)) / 9;

  sidePanel.append('g')
    .attr("class", "graph")
    .selectAll('rect') //adds country select buttons
    .data(primeCountriesLower)
    .enter()
    .append('rect')
    .attr("class", "countrySelect")
    .attr("x", function (d, i) {
      return i * (parseInt(sidePanel.style("width")) / 9) + marginCountryButton.left;
    }).attr("y", (marginCountryButton.top))
    .attr("height", parseInt(sidePanel.style("height")))
    .attr("width", buttonWidth);
  sidePanel.select(".graph")
    .selectAll("text") //adds country select names
    .data(primeCountriesLower)
    .enter()
    .append('text')
    .attr("class", "countryLabels")
    .transition()
    .attr("x", function (d, i) {
      return (i * (buttonWidth + marginCountryButton.right + marginCountryButton.left) + (buttonWidth / 2));
    }).attr("y", parseInt(sidePanel.style("height")) / 1.5) //shift labels down so that they ligne up with les boits
    .style("fill", "black")
    .style("pointer-events", "none")
    .style("text-anchor", "middle")
    .text(function (d) {
      return d;
    });

  svg.attr("width", mapWidth).attr("height", mapHeight);

  var projection = d3.geoPatterson()
    .scale(mapWidth / 6.3, mapHeight / 5)
    .translate([mapWidth / 2, mapHeight / 2])
    .precision(0.3);
  var path = d3.geoPath().projection(projection);

  svg.append("path") //adds the grid
    .datum(d3.geoGraticule10()).attr("class", "graticule").attr("d", path);

  var collectedData = coagData(dataServerPath, ["internetUsers.csv", "perCapitaFoodSupply.csv", "undernourishment.csv", "poverty.csv", "gdpPerCap.csv"], mediaFileMap, data, 0, function (dat) {
    dat.pop(); // removes unecessary country tag
    parsed = dat;
    //draws map
    d3.json("https://d3js.org/world-50m.v1.json", function (error, world) {
      if (error) {
        throw error;
      }
      countries.attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append("path")
        .attr("class", "countriePaths")
        .attr("d", path)
        .style("stroke-linejoin", "round")
        .style("fill", "#bcbcbc")
        .style("stroke", "#565656")
        .attr("id", function (d) {
          prevCountry = d.id;

          return d.id;
        });
        initialize();
    });
  });
}

function addMapLegend(refugees) {

  //add color legend
  maxRefugees = refugees;
  mainScale = d3.scaleLog()
    .base(10)
    .domain([1, maxRefugees])
    .range([1, 10]);
  colorScale = d3.scaleLog()
    .domain([1, maxRefugees])
    .interpolate(d3.interpolateHcl)
    .range([d3.rgb("#007AFF"), d3.rgb('#FF0000')]);
  colorScaleLinear = d3.scaleLinear()
    .domain([1, maxRefugees])
    .interpolate(d3.interpolateHcl)
    .range([d3.rgb("#007AFF"), d3.rgb('#FF0000')]);

  var svg = d3.select(".mapSVG");
  var colorInterval = maxRefugees / colorScaleLength;
  var offsetHeights = 0

  for (var i = 0; i < colorScaleLength; i++) {
    if (i != 0) {
      offsetHeights += 3 + ((i - 1) * 2);
    }

    svg.append('rect')
      .attr("class", "colorLegend legend")
      .attr("x", 20)
      .attr("y", parseInt(svg.style("height")) - offsetHeights - 20)
      .attr("height", 3 + (i * 2))
      .attr("width", 10)
      .style("fill", colorScaleLinear(i * colorInterval));
  }

  svg.append('text')
    .attr("class", "colorLegendTitle legend")
    .attr("x", 20)
    .attr("y", parseInt(svg.style("height")) - offsetHeights - 30)
    .style("pointer-events", "none")
    .text("Refugees");
  svg.append('text')
    .attr("class", "colorLegendUnits legend")
    .attr("x", 37)
    .attr("y", parseInt(svg.style("height")) - offsetHeights - 18)
    .style("pointer-events", "none")
    .text(maxRefugees);
  svg.append('text')
    .attr("class", "colorLegendUnits legend")
    .attr("x", 37)
    .attr("y", parseInt(svg.style("height")) - 14)
    .style("pointer-events", "none")
    .text("1");
  svg.append('rect')
    .attr("class", "colorLegend legend")
    .attr("x", 20)
    .attr("y", parseInt(svg.style("height")) - offsetHeights - 21)
    .attr("height", 1)
    .attr("width", 14)
    .style("fill", "black");
  svg.append('rect')
    .attr("class", "colorLegend legend")
    .attr("x", 20)
    .attr("y", parseInt(svg.style("height")) - 17)
    .attr("height", 1)
    .attr("width", 14)
    .style("fill", "black");
}

function updateMap(countryData, year) {
  //called whenever a country or button is clicked
  var svg = d3.select(".mapSVG");
  var panelSVG = d3.select(".panelSVG");
  var moveTo;
  var centroid;
  var selectedCenter;
  var center;
  var countryCounter = 0;
  var countryChecker = 0;
  var dataSet = countryData[year];
  var graphScale = d3.scaleLinear();
  var barPadding = 1;
  var leftMargin = 45;
  var bottomMargin = 25;
  var countries = svg.select(".states");
  var selectedCountryObject;
  var scale = d3.scaleSqrt();
  clearAll();
  scale.domain([0, 100]);
  scale.range([0, 90]);
  graphScale.domain([0, 2400]);
  graphScale.range([0, 75]);
  countries.selectAll("path").style("fill", "#bcbcbc");

  var projection = d3.geoPatterson()
    .scale(mapWidth / 6.3, mapHeight / 5)
    .translate([mapWidth / 2, mapHeight / 2])
    .precision(1);
  var path = d3.geoPath().projection(projection);
  var movingCircles = svg.select(".movingCircle");
  var staticCircle = svg.select(".staticCircle");

  function clearAll() {
    svg.selectAll("line").remove();
    svg.selectAll("circle").remove();
    svg.selectAll("rect").remove();
    svg.select(".movingCircle")
      .selectAll("circle")
      .remove();
    svg.select(".staticCircle")
      .selectAll("circle")
      .remove();
    svg.selectAll(".countryTooltip").remove();
    svg.selectAll(".countryTooltipText").remove();
    countries.selectAll("path")
      .on("mouseover", null)
      .on("mouseout", null);

    d3.select(".panelSVG").remove();
    svg.selectAll(".legend").remove();
    addMapLegend(maxRefugees);
    yAxisLabelWidth = 9999;
  }

  //get highest amount of refugees for the year
  var refugeeAmounts = [];

  for (var key in dataSet[0]) {
    delete dataSet[0][key]['code'];
    delete dataSet[0][key]['name'];
    Array.prototype.push.apply(refugeeAmounts, Object.values(dataSet[0][key]));
  }

  var highestNumRefugees = Math.max.apply(null, refugeeAmounts)
  //round to highest two digits
  var numDigits = highestNumRefugees.toString().length;
  var divider = Math.pow(10, numDigits - 2);
  var highestNumRefugeesRounded = Math.ceil(highestNumRefugees / divider) * divider;

  svg.selectAll(".legend").remove();
  addMapLegend(highestNumRefugeesRounded);

  function colorCountries(circle) {
    var current_circle = d3.select(circle);
    var countryID = current_circle.attr("data_country");
    var country_color = current_circle.attr("data_country_color");
    countries.selectAll("path").filter(function (d) {
      return d.id == countryID;
    }).each(function (d, i) {
      d3.select(this).transition()
        .duration(500)
        .style("fill", country_color)
        .on("end", function() {
          transitionInProgress = false;
          document.getElementById("year-slider").disabled = false;
        });
    });
  }

  //handles country click
  countries.selectAll("path").on("click", function (d) {
    if (transitionInProgress) {
      return;
    }

    countries.selectAll("path").style("fill", "#bcbcbc");
    d3.select(this).style("fill", "#FFD800");
    clearAll();
    selectedCountryObject = d;
    prevCountry = d;
    drawLines(d.id);
    moveCircles(colorCountries); //animation
    drawBars(d.id, parsed);
  });

  //handles button click
  d3.select(".sidePanel").selectAll("rect").on("click", function (d) {
    if (transitionInProgress) {
      return;
    }

    var countKey = getKey(0, false);
    var country = d;
    var countCode = countKey[country].code;
    var countElement = countries.selectAll("path")
      .select("[id=" + "'" + countCode.toString() + "'" + "]");

    countries.selectAll("path").each(function (d, i) {
      if (d.id == countCode) {
        countries.selectAll("path").style("fill", "#bcbcbc");
        d3.select(this).style("fill", "#FFD800");
        clearAll();
        selectedCountryObject = d;
        prevCountry = d;
        drawLines(d.id);
        moveCircles(colorCountries);

        drawBars(d.id, parsed);
      }
    });
  });

  function moveCircles(callback) {
    movingCircles.selectAll("circle")
      .transition()
        .duration(4000)
        .attr("cx", function (d) {
          return d[0][0];
        }) //moveTo
        .attr("cy", function (d) {
          return d[0][1];
        }).attr("r", function (d) {
          return d[1];
        })
      .on('end', function(){
        callback(this);
      })
      .transition()
        .duration(500)
        .style("opacity", "0");
  };

  function update(callback) {
    movingCircles.selectAll("circle")
      .attr("cx", selectedCenter[0])
      .attr("cy", selectedCenter[1])
      .on("end", callback);
  };

  function drawBars(countryID, parsedData) {
    //draws bottom of page graph
    var undernourishment = mediaMap["undernourishment.csv"];
    var perCapitaFoodSupply = mediaMap["perCapitaFoodSupply.csv"];
    var internetUsers = mediaMap["internetUsers.csv"];
    var poverty = mediaMap["poverty.csv"];
    var nameKey = {};
    nameKey[undernourishment] = "Undernourishment";
    nameKey[perCapitaFoodSupply] = "Food Supply";
    nameKey[internetUsers] = "Internet Users";
    nameKey[poverty] = "Poverty";
    var unitKey = {};
    unitKey[undernourishment] = "(% of population)";
    unitKey[perCapitaFoodSupply] = "(kcal/capita/day)";
    unitKey[poverty] = "(% of population)";

    reDraw();

    var svg = d3.select(".panelSVG");

    for (var y1 = 0; y1 < parsedData.length; y1++) {
      var lowerString = parsedData[y1].key;
      var countryName = getKey(countryID, 0, true);
      try {
        if (typeof lowerString !== 'undefined' && lowerString.toLowerCase() == countryName.toLowerCase()) {
          //if the country path selected matches the country name in the data

          //get initial date range all graphs
          var totalDateRange = [];

          for (var setnum = 0; setnum < dataSelect.length; setnum++) {
            var dates = parsedData[y1][mediaMap[dataSelect[setnum]]];
            dates = Object.keys(dates['values'][0]);
            dates = dates.slice(0, dates.length - 2).map(Number);
            Array.prototype.push.apply(totalDateRange, dates);
          }

          var dateRange = d3.extent(totalDateRange);
          var x = d3.scaleTime().range([0, width])
            .domain(dateRange);
          var x2 = d3.scaleTime().range([0, width])
            .domain(dateRange);
          var y2 = d3.scaleLinear().range([height2, 0]);
          var xAxis = d3.axisBottom(x);
          var xAxis2 = d3.axisBottom(x2);
          var brush = d3.brushX()
            .extent([[0, 0], [width, height2]])
            .on("brush end", brushed);
          var charts = [];

          for (var setnum = 0; setnum < dataSelect.length; setnum++) {
            charts.push(new Chart({
              data: parsedData[y1][mediaMap[dataSelect[setnum]]],
              id: setnum,
              name: nameKey[mediaMap[dataSelect[setnum]]],
              units: unitKey[mediaMap[dataSelect[setnum]]],
              svg: svg,
              x: x,
              x2: x2,
              xAxis: xAxis,
              dateRange: dateRange
            }));
          };

          var shift = graphHeight - (graphHeight * .1);
          var context = svg.append("g")
            .attr("class", "context")
            .attr("height", graphHeight * .2)
            .attr("transform", "translate(" + graphWidth * .06 + "," + shift + ")"); //10 px buffer
          context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);
          context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());
          context.selectAll('.handle')
            .style("cursor", "ew-resize")
            .style("stroke", "#b2b1b6")
            .style("stroke-width", 1)
            .style("fill", "#ebe7e8");
          svg.append('text')
            .attr("class", "graphContainerTitleText")
            .style("text-anchor", "middle")
            .attr("x", graphWidth * .5)
            .attr("y", graphHeight * .05)
            .style("font-size", "2vw")
            .style("font-family", "Helvetica Neue")
            .text(getKey(prevCountry.id, 0, true));

          function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") {
              return; // ignore brush-by-zoom
            }

            var s = d3.event.selection || x2.range();
            var b = s.map(x2.invert, x2);

            for (var setnum = 0; setnum < dataSelect.length; setnum++) {
              charts[setnum].showOnly(b);
            }
          }
        }

        function type(d) {
          d = parseDate(d);
          return d;
        }
      } catch (err) {
        console.log(err);
        break;
      }
    }
  };

  function Chart(options) {
    this.chartData = options.data;
    this.svg = options.svg;
    this.id = options.id;
    this.name = options.name;
    this.units = options.units;
    this.x = options.x;
    this.x2 = options.x2;
    this.xAxis = options.xAxis;
    this.dateRange = options.dateRange;
    this.y = d3.scaleLinear().range([height, 0]);
    this.yAxis = d3.axisLeft(this.y);
    var that = this;
    this.area = d3.area()
      .curve(d3.curveMonotoneX).x(function (d) {
        return that.x(parseDate(d[0]));
      }).y0(height).y1(function (d) {
        return that.y(d[1]);
      });
    this.numbersOnly = Object.values(this.chartData['values'][0]);
    this.keys = Object.keys(this.chartData['values'][0]);
    this.numbersOnly = this.numbersOnly.slice(0, this.numbersOnly.length - 2); //get's rid of country tag
    this.keys = this.keys.slice(0, this.keys.length - 2); //years for axis labels
    this.dataStoreFinal = [];

    for (var t = 0; t < this.keys.length; t++) {
      this.dataStoreFinal.push([this.keys[t], this.numbersOnly[t]]);
    }

    this.svg.select("#clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);
    this.graphOffset = ((graphHeight * .2) + (graphHeight * .08)) * this.id + (graphHeight * .12);
    this.chartContainer = d3.select('.focus' + this.id)
      .attr("transform", "translate(" + graphWidth * .04 + "," + this.graphOffset + ")");
    this.x.domain(d3.extent(this.dateRange, function (d) {
      return parseDate(d);
    }));
    this.y.domain(d3.extent(this.numbersOnly, function (d) {
      return +d;
    }));
    this.x2.domain(this.x.domain());
    this.chartContainer.append("path")
      .datum(this.dataStoreFinal)
      .attr("class", "area")
      .attr("d", this.area)
      .attr("transform", "translate(" + graphLeftMargin + "," + 0 + ")");
    this.chartContainer.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(" + graphLeftMargin + "," + height + ")")
      .call(this.xAxis);
    this.chartContainer.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(" + graphLeftMargin + "," + 0 + ")")
      .style("font-size", graphHeight * .015)
      .call(this.yAxis);
    var chartTitle = this.chartContainer.append('text')
      .attr("class", "graphTitleText")
      .attr("x", graphWidth * .03)
      .attr("y", -8)
      .style("font-size", "1.8vw")
      .style("font-family", "Helvetica Neue")
      .text(this.name);
    var bbox = chartTitle.node().getBBox();
    this.chartContainer.append('text')
      .attr("class", "graphTitleText")
      .attr("x", graphWidth * .03 + bbox.width + 8)
      .attr("y", -10)
      .style("font-size", "1vw")
      .style("font-family", "Helvetica Neue")
      .text(this.units);
    this.chartContainer.append("rect")
      .attr("class", "year_area")
      .attr("x", this.x(parseDate(year)))
      .attr("y", 3)
      .attr("width", 1)
      .attr("height", height - 3)
      .attr("fill", "rgba(0,0,0,0.2)");
    this.chartContainer.append("rect")
      .attr("class", "year_area2")
      .attr("x", this.x(parseDate(year + 1)))
      .attr("y", 3)
      .attr("width", 1)
      .attr("height", height - 3)
      .attr("fill", "rgba(0,0,0,0.2)");
    var yearTextX = this.x(parseDate(year)) + ((this.x(parseDate(year + 1)) - this.x(parseDate(year))) / 2);
    this.chartContainer.append("text")
      .attr("class", "year_title")
      .attr("x", yearTextX)
      .style("font-size", ".9vw")
      .attr("y", 2)
      .style("font-family", "Helvetica Neue")
      .style("text-anchor", "middle")
      .text(year);

      var currentYAxisLabelWidth = Math.abs(this.chartContainer.select(".axis--y").node().getBBox().x)
      yAxisLabelWidth = yAxisLabelWidth > currentYAxisLabelWidth ? currentYAxisLabelWidth : yAxisLabelWidth;
  }

  Chart.prototype.showOnly = function(b){
    var yearOffset1 = this.x(parseDate(year));
    var yearOffset2 = this.x(parseDate(year + 1));
    var yearTextOffset = yearOffset1 + ((yearOffset2 - yearOffset1) / 2);
    var yAxisLabelWidthCorrected = yAxisLabelWidth + 4;
    this.x.domain(b);
    this.chartContainer.select("path.area").datum(this.dataStoreFinal).attr("d", this.area);
    this.chartContainer.select("rect.year_area").attr("x", yearOffset1 + yAxisLabelWidthCorrected);
    this.chartContainer.select("rect.year_area2").attr("x", yearOffset2 + yAxisLabelWidthCorrected);
    this.chartContainer.select("text.year_title").attr("x", yearTextOffset + yAxisLabelWidthCorrected);
    this.chartContainer.select(".axis--x").call(this.xAxis);

    if (yearOffset2 > width || yearOffset2 < 0) {
      this.chartContainer.select("rect.year_area2").style("opacity", "0");
    } else {
      this.chartContainer.select("rect.year_area2").style("opacity", "1");
    }

    if (yearOffset1 > width || yearOffset1 < 0) {
      this.chartContainer.select("rect.year_area").style("opacity", "0");
    } else {
      this.chartContainer.select("rect.year_area").style("opacity", "1");
    }

    if (yearTextOffset > width || yearTextOffset < 0) {
      this.chartContainer.select("text.year_title").style("opacity", "0");
    } else {
      this.chartContainer.select("text.year_title").style("opacity", "1");
    }
  }

  function drawLines(countryID) {
    //draws paths to countries
    countryCounter = 0; //reset
    var selectedCountry = dataSet[getKey(countryID, 0, true)]; //gets country object that contains the data
    selectedCenter = path.centroid(selectedCountryObject);
    //add tooltip to selected country

    countries.selectAll("path").filter(function (d) {
      return d.id == countryID;
    }).each(function (d, i) {
      addTooltip(this, d, selectedCountry, getKey(d.id, 0, true), true);
    });

    var yearSlider = document.getElementById("year-slider");

    countries.selectAll("path").filter(function (d) {
      var currentCountryRefugees = typeof dataSet[0][getKey(countryID, 0, true)] == "undefined" ? undefined : dataSet[0][getKey(countryID, 0, true)][getKey(d.id, 0, true)];
      if (typeof currentCountryRefugees == "undefined" || currentCountryRefugees == 0) {
        //filters out countries that no refugees from seectedCountry have gone to
        return false;
      }

      countryCounter++;

      return true;
    }).each(function (d, i) {
      transitionInProgress = true;
      yearSlider.disabled = true;
      //loops through every country
      center = path.centroid(d); //cetnroid equal to center of each country
      //for intial setup when there is no selected country

      if (typeof center == 'undefined') {
        center = [0, 0];
      }

      if (typeof selectedCenter == 'undefined') {
        selectedCenter = [0, 0];
      }

      var currentID = d.id;
      var countryName = getKey(countryID, 0, true);
      var temp = dataSet[0][getKey(countryID, 0, true)]; //selects selected country object

      try {
        var circleName = getKey(d.id, 0, true);
        var size = temp[circleName]; //as it loops through each country, get's the data associated with the attribute of selected country associated with that country
      } catch (err) {}

      size = mainScale(size);
      center = [center, size, circleName];

      d3.select(this).attr("data-country-color", colorScale(temp[circleName]))

      svg.append("line") //adds refugee lines
        .attr("class", "countryLines")
        .attr("x1", center[0][0])
        .attr("x2", selectedCenter[0])
        .attr("y1", center[0][1])
        .attr("y2", selectedCenter[1])
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("opacity", 0.30)
        .style("pointer-events", "none");
      movingCircles.append("circle") //adds refugee circles
        .attr("id", "p" + Math.random())
        .datum(center)
        .attr("data_country_color", colorScale(temp[circleName]))
        .attr("data_country", currentID)
        .attr("cx", selectedCenter[0])
        .attr("cy", selectedCenter[1])
        .attr("r", 1)
        .style("fill", colorScale(temp[circleName]));

      //add tooltip to refugee countries
      addTooltip(this, d, temp, circleName, false);
    });

    function addTooltip(that, d, temp, name, origin) {
      d3.select(that).on("mouseover", function (d) {
        var currentSelectedCountry = d3.select(that);
        var currentSelectedCenter = path.centroid(d);
        var coor = d3.mouse(that);
        var setText = name;

        if (origin == false) {
          setText = setText.replace (/^/, Math.round(temp[name]) + " - ");
        }

        var countryTooltip = svg.append('rect')
          .attr("class", "countryTooltip")
          .attr("x", currentSelectedCenter[0])
          .attr("y", currentSelectedCenter[1] - 16)
          .attr("height", 25)
          .style("fill", "white")
          .style("pointer-events", "none")
          .style("fill", "black")
          .attr("rx", 12)
          .attr("ry", 12);
        var tooltipText = svg.append('text')
          .attr("class", "countryTooltipText")
          .attr("x", currentSelectedCenter[0])
          .attr("y", currentSelectedCenter[1])
          .style("pointer-events", "none")
          .text(setText)
          .style("fill", "white");
        var bbox = tooltipText.node().getBBox();
        var test = parseInt(svg.style("width")) - bbox.width - 10;
        countryTooltip.attr("width", 1.3 * bbox.width);
        tooltipText.attr("x", currentSelectedCenter[0] + .13 * bbox.width);
        var svg_width = parseInt(svg.style("width"));
        var svg_height = parseInt(svg.style("height"));
        //correct for tooltip going off the map

        if (currentSelectedCenter[0] + bbox.width > svg_width) {
          countryTooltip.attr("x", svg_width - bbox.width * 1.5 - 10);
          tooltipText.attr("x", svg_width - bbox.width * 1.5 + .06 * bbox.width);
        }

        if (currentSelectedCenter[1] + bbox.height > svg_height) {
          countryTooltip.attr("y", svg_height - 26);
          tooltipText.attr("y", svg_height - 10);
        } else if (currentSelectedCenter[1] < 10) {
          countryTooltip.attr("y", 10);
          tooltipText.attr("y", 26)
        }
      }).on("mouseout", function (d) {
        var currentSelectedCountry = d3.select(that);
        svg.selectAll('.countryTooltip').remove();
        svg.selectAll('.countryTooltipText').remove();
      });
    }
  }
}