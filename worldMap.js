"use strict";

var year = 1975;
var parsed;
var graphWidth = 900;
var mapWidth;
var mapHeight;
var graphWidth;
var graphHeight;
var margin = { top: 20, right: 5, bottom: 20, left: 15 };
var margin2 = { top: 20, right: 5, bottom: 20, left: 15 };
var dataSelect = "perCapitaFoodSupply.csv";
var selectButtonHeight = 20;
var primeCountriesLower = ["Angola", "Indonesia", "Kenya", "Nigeria", "Nepal", "Jordan", "South Sudan", "Sudan", "Sierra Leone"];
var gdpScale = d3.scaleLog();
gdpScale.domain([288, 73000]);
gdpScale.range([30, 255]);
var prevCountry;
var mainScale = d3.scaleLog();
mainScale.base(30);
mainScale.domain([1, 400000]);
mainScale.range([3, 30]);
var colorScale = d3.scaleLinear();
colorScale.domain([3, 30]);
colorScale.range([180, 300]);

function clear() {
  d3.select("body").select(".mapSVG").select(".countries").selectAll("path").style("fill", "black");
}

function reDraw() {
  var topPanel = d3.select(".divElement").append('svg').attr("width", '100%').attr("height", '40%').attr("class", "panelSVG");

  topPanel.append("g").attr("class", "xaxis");
  topPanel.append("g").attr("class", "yaxis");
  topPanel.append("defs").append("clipPath").attr("id", "clip");
  topPanel.append('g').attr("class", "graphTitle").append('text');

  topPanel.append("g") //main map
  .attr("class", "focus").attr("transform", "translate(" + margin.left + "," + 30 + ")");

  topPanel.append("g").attr("class", "dataSelecter"); //data select

  return topPanel;
}

function updateYear(yearChanged) {
  d3.select('.yearText').text(yearChanged);
}

function buildMap(dataServerPath) {
  var primeCountries = ["AFGHANISTAN", "ALBANIA", "ALGERIA", "AMERICAN SAMOA", "ANDORRA", "ANGOLA", "ANGUILLA", "ANTIGUA AND BARBUDA", "ARGENTINA", "ARMENIA", "ARUBA", "IA", "AUSTRIA", "AZERBAIJAN", "BAHAMAS", "BAHRAIN", "BANGLADESH", "BARBADOS", "BELARUS", "BELGIUM", "BELIZE", "BENIN", "BERMUDA", "BHUTAN", "BOLIVIA", "BONAIRE", "BOSNIA-HERZEGOVINA", "BOTSWANA", "BOUVET ISLAND", "BRAZIL", "BRUNEI", "BULGARIA", "BURKINA FASO", "BURUNDI", "CAMBODIA", "CAMEROON", "CANADA", "CAPE VERDE", "CAYMAN ISLANDS", "CENTRAL ARICAN REPUBLIC", "CHAD", "CHILE", "CHINA", "CHRISTMAS ISLAND", "COCOS (KEELING) ISLANDS", "COLOMBIA", "COMOROS", "CONGO", "COOK ISLANDS", "COSTA RICA", "CROATIA", "CUBA", "CYPRUS", "CZECH REP.", "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "ECUADOR", "EGYPT", "EL SALVADOR", "EQUATORIAL GUINEA", "ERITREA", "ESTONIA", "ETHIOPIA", "FALKLAND ISLANDS", "FAROE ISLANDS", "FIJI", "FINLAND", "FRANCE", "FRENCH GUIANA", "GABON", "GAMBIA", "GEORGIA", "GERMANY", "GHANA", "GIBRALTAR", "GREECE", "GREENLAND", "GRENADA", "GUATEMALA", "GUINEA", "GUINEA BISSAU", "GUYANA", "HAITI", "HOLY SEE", "HONDURAS", "HONG KONG", "HUNGARY", "ICELAND", "INDIA", "INDONESIA", "IRAN", "IRAQ", "IRELAND", "ISRAEL", "ITALY", "IVORY COAST", "JAMAICA", "JAPAN", "JORDAN", "KAZAKHSTAN", "KENYA", "KIRIBATI", "KOSOVO", "KUWAIT", "KYRGYZSTAN", "LAOS", "LATVIA", "LEBANON", "LESOTHO", "LIBERIA", "LIBYA", "LIECHTENSTEIN", "LITHUANIA", "LUXEMBOURG", "MACAU", "MACEDONIA", "MADAGASCAR", "MALAWI", "MALAYSIA", "MALDIVES", "MALI", "MALTA", "MARSHALL ISLANDS", "MAURITANIA", "MAURITIUS", "MAYOTTE", "MEXICO", "MICRONESIA", "MOLDOVA", "MONACO", "MONGOLIA", "MONTENEGRO", "MONTSERRAT", "MOROCCO", "MOZAMBIQUE", "MYANMAR", "NAMIBIA", "NAURU", "NEPAL", "NETHERLANDS", "NETHERLANDS ANTILLES", "NEW ZEALAND", "NICARAGUA", "NIGER", "NIGERIA", "NIUE", "NORFOLK ISLAND", "NORTH KOREA", "NORTHERN MARIANA ISLANDS", "NORWAY", "OMAN", "PAKISTAN", "PALAU", "PANAMA", "PAPUA NEW GUINEA", "PARAGUAY", "PERU", "PHILIPPINES", "PITCAIRN ISLAND", "POLAND", "POLYNESIA (FRENCH)", "PORTUGAL", "PUERTO RICO", "QATAR", "RNION", "ROMANIA", "RUSSIA", "RWANDA", "SAINT HELENA", "SAINT KITTS AND NEVIS", "SAINT LUCIA", "SAINT PIERRE AND MIQUELON", "SAINT VINCENT AND GRENADINES", "SAMOA", "SAN MARINO", "SAO TOME AND PRINCIPE", "SAUDI ARABIA", "SENEGAL", "SERBIA", "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SINT MAARTEN", "SLOVAKIA", "SLOVENIA", "SOLOMON ISLANDS", "SOMALIA", "SOUTH AFRICA", "SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS", "SOUTH KOREA", "SOUTH SUDAN", "SOUTH SUDAN", "SPAIN", "SRI LANKA", "SUDAN", "SURINAME", "SVALBARD AND JAN MAYEN ISLANDS", "SWAZILAND", "SWEDEN", "SWITZERLAND", "SYRIA", "TAIWAN", "TAJIKISTAN", "TANZANIA", "THAILAND", "TIMOR-LESTE (EAST TIMOR)", "TOGO", "TOKELAU", "TONGA", "TRINIDAD AND TOBAGO", "TUNISIA", "TURKEY", "TURKMENISTAN", "TURKS AND CAICOS ISLANDS", "TUVALU", "UGANDA", "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM", "UNITED STATES", "URUGUAY", "UZBEKISTAN", "VANUATU", "VENEZUELA", "VIETNAM", "VIRGIN ISLANDS", "WALLIS AND FUTUNA ISLANDS", "YEMEN", "ZAMBIA", "ZIMBABWE"];

  var primeCountries2 = ["ANGOLA", "INDONESIA", "KENYA", "NIGERIA", "NEPAL", "JORDAN", "SOUTH SUDAN", "SUDAN", "SIERRA LEONE"];
  var data = [];
  var countCode;

  var divElement = d3.select("body").append("div").attr("class", "divElement");

  var svg = divElement.append('svg').attr("x", 0).attr("y", 0).attr("width", '80%').attr("height", '73%').attr("class", "mapSVG");

  var sidePanel = divElement.append("svg").attr("width", "20%").attr("height", "70%").attr("class", "sidePanel");

  var topPanel = reDraw();

  var countries = svg.append("g").attr("class", "countries");

  var movingCircles = svg.append("g").attr("class", "movingCircle");

  var staticCircle = svg.append("g").attr("class", "staticCircle");

  setCountries(primeCountries); //selects all countries for data parsing

  primeCountries = ["Angola", "Indonesia", "Kenya", "Nigeria", "Nepal", "Jordan", "South Sudan", "Sudan", "Sierra Leone"];

  sidePanel.append('text').attr("class", "yearText").attr("x", parseInt(sidePanel.style("width")) / 3).attr("y", parseInt(sidePanel.style("height")) / 15).style("stroke", "black").text("");

  graphWidth = parseInt(topPanel.style("width")); //gets number valus for svg widths and heights
  graphHeight = parseInt(topPanel.style("height"));

  mapWidth = parseInt(svg.style("width"));
  mapHeight = parseInt(svg.style("height"));

  var sideWidth = parseInt(sidePanel.style("width"));
  var buttonWidth = parseInt(sidePanel.style("width")) - margin.right - margin.left;

  sidePanel.append('g').attr("class", "graph").selectAll('rect') //adds country select buttons
  .data(primeCountries).enter().append('rect').attr("class", "countrySelect").attr("x", (sideWidth - buttonWidth) / 2).attr("y", function (d, i) {
    return (i + 1) * (parseInt(sidePanel.style("height")) / 10);
  }).attr("height", parseInt(sidePanel.style("height")) / 11).attr("width", buttonWidth);

  sidePanel.select(".graph").selectAll("text") //adds country select names
  .data(primeCountries).enter().append('text').attr("class", "countryLabels").transition().attr("x", 18).attr("text-anchor", "left").attr("y", function (d, i) {
    return parseInt((i + 1.6) * (parseInt(sidePanel.style("height")) / 10));
  }) //shift labels down so that they ligne up with les boits
  .style("fill", "black").style("pointer-events", "none").text(function (d) {
    return d;
  });

  svg.attr("style", "outline: thin solid blue;").attr("width", mapWidth).attr("height", mapHeight);

  var projection = d3.geoPatterson().scale(mapWidth / 6.3, mapHeight / 5).translate([mapWidth / 2, mapHeight / 2]).precision(0.3);

  var path = d3.geoPath().projection(projection);

  svg.append("path") //adds the grid
  .datum(d3.geoGraticule10()).attr("class", "graticule").attr("d", path);

  var collectedData = coagData(dataServerPath, ["internetUsers.csv", "perCapitaFoodSupply.csv", "undernourishment.csv", "poverty.csv", "gdpPerCap.csv"], data, 0, function (dat) {
    dat.pop(); // removes unecessary country tag
    parsed = dat;
    //draws map
    d3.json("https://d3js.org/world-50m.v1.json", function (error, world) {
      if (error) throw error;
      countries.attr("class", "states").selectAll("path").data(topojson.feature(world, world.objects.countries).features).enter().append("path").attr("class", "countriePaths").attr("d", path).style("stroke-linejoin", "round").style("fill", "#a1a1a1").style("stroke", "#0051a8").attr("id", function (d) {
        prevCountry = d.id;
        if (primeCountriesLower.indexOf(getKey(d.id, 0, true)) > -1) {
          d3.select(this).style("fill", "red");
        }

        return d.id;
      });
    });
  });
}

function fillPC() {
  //highlights primero countries in red after map updates
  primeCountriesLower = ["Angola", "Indonesia", "Kenya", "Nigeria", "Nepal", "Jordan", "South Sudan", "Sudan", "Sierra Leone"];
  d3.select(".divElement").select(".mapSVG").select(".states").selectAll("path").each(function (d) {
    if (primeCountriesLower.indexOf(getKey(d.id, 0, true)) > -1) {
      d3.select(this).style("fill", "red");
    }
  });
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
  scale.domain([0, 100]);
  scale.range([0, 90]);

  graphScale.domain([0, 2400]);
  graphScale.range([0, 75]);

  countries.selectAll("path").style("fill", "#a1a1a1");

  fillPC();

  var projection = d3.geoPatterson().scale(mapWidth / 6.3, mapHeight / 5).translate([mapWidth / 2, mapHeight / 2]).precision(1);

  var path = d3.geoPath().projection(projection);
  var movingCircles = svg.select(".movingCircle");
  var staticCircle = svg.select(".staticCircle");

  function clearAll() {
    svg.selectAll("line").remove();
    svg.selectAll("circle").remove();
    svg.selectAll("rect").remove();
    svg.select(".movingCircle").selectAll("circle").remove();
    svg.select(".staticCircle").selectAll("circle").remove();
  }

  clearAll();

  //handles country click
  countries.selectAll("path").on("click", function (d) {
    countries.selectAll("path").style("fill", "#a1a1a1");

    fillPC();

    d3.select(this).style("fill", d3.rgb(100, 20, 100));

    clearAll();
    selectedCountryObject = d;
    prevCountry = d;
    drawLines(d.id);
    trans(); //animation

    if (primeCountriesLower.indexOf(getKey(d.id, 0, true)) > -1) {
      //only draws graph for primero countries
      drawBars(d.id, parsed);
    }
  });

  //handles button click
  d3.select(".sidePanel").selectAll("rect").on("click", function (d) {
    var countKey = getKey(0, false);
    var country = d;

    var countCode = countKey[country].code;

    var countElement = countries.selectAll("path").select("[id=" + "'" + countCode.toString() + "'" + "]");

    countries.selectAll("path").each(function (d, i) {
      if (d.id == countCode) {
        countries.selectAll("path").style("fill", "#a1a1a1");
        fillPC();
        d3.select(this).style("fill", d3.rgb(100, 20, 100));
        clearAll();
        selectedCountryObject = d;
        prevCountry = d;
        drawLines(d.id);
        trans();

        if (primeCountriesLower.indexOf(getKey(d.id, 0, true)) > -1) {
          drawBars(d.id, parsed);
        }
      }
    });
  });

  function trans() {
    movingCircles.selectAll("circle").transition().duration(4000).attr("cx", function (d) {
      return d[0][0];
    }) //moveTo
    .attr("cy", function (d) {
      return d[0][1];
    }).attr("r", function (d) {
      return d[1];
    });
  };

  function update(callback) {
    movingCircles.selectAll("circle").attr("cx", selectedCenter[0]).attr("cy", selectedCenter[1]).on("end", callback);
  };

  function drawBars(countryID, parsedData) {
    //draws bottom of page graph
    var graphLeftMargin = 20;
    var nameKey = [{ "undernourishment.csv": "Undernourishment", "perCapitaFoodSupply.csv": "Food Supply", "internetUsers.csv": "Internet Users", "poverty.csv": "Poverty" }];

    d3.select(".panelSVG").remove();

    reDraw();

    for (var y1 = 0; y1 < parsedData.length; y1++) {

      var lowerString = parsedData[y1].key;
      var countryName = getKey(countryID, 0, true);

      try {
        var brushed = function brushed() {
          if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") {
            return; // ignore brush-by-zoom
          }

          var s = d3.event.selection || x2.range();
          x.domain(s.map(x2.invert, x2));
          focus.select(".area").attr("d", area);
          focus.select(".axis--x").call(xAxis);
          svg.select(".zoom").call(zoom.transform, d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0));
        };

        var zoomed = function zoomed() {
          if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") {
            return; // ignore zoom-by-brush
          }
          var t = d3.event.transform;
          x.domain(t.rescaleX(x2).domain()); //resets x domain to match little graph
          focus.select(".area").attr("d", area);
          focus.select(".axis--x").call(xAxis);
          context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        };

        var type = function type(d) {
          d = parseDate(d);
          return d;
        };

        if (typeof lowerString !== 'undefined' && lowerString.toLowerCase() == countryName.toLowerCase()) {
          //if the country path selected matches the country name in the data
          var numbersOnly = Object.values(parsedData[y1][dataSelect]['values'][0]);
          var keys = Object.keys(parsedData[y1][dataSelect]['values'][0]);

          numbersOnly = numbersOnly.slice(0, numbersOnly.length - 2); //get's rid of country tag
          keys = keys.slice(0, keys.length - 2); //years for axis labels

          var dataStoreFinal = [];

          for (var t = 0; t < keys.length; t++) {
            dataStoreFinal.push([keys[t], numbersOnly[t]]);
          }

          var svg = d3.select(".panelSVG"),
              width = graphWidth;
          height = 7 * graphHeight / 12;
          height2 = graphHeight / 8;

          var parseDate = d3.timeParse("%Y");

          var x = d3.scaleTime().range([0, width]),
              x2 = d3.scaleTime().range([0, width]),
              y = d3.scaleLinear().range([height, 0]),
              y2 = d3.scaleLinear().range([height2, 0]);

          var xAxis = d3.axisBottom(x),
              xAxis2 = d3.axisBottom(x2),
              yAxis = d3.axisLeft(y);

          var brush = d3.brushX().extent([[0, 0], [width, height2]]).on("brush end", brushed);

          var zoom = d3.zoom().scaleExtent([1, Infinity]).translateExtent([[0, 0], [width, height]]).extent([[0, 0], [width, height]]).on("zoom", zoomed);

          var area = d3.area() //main graph area
          .curve(d3.curveMonotoneX).x(function (d) {
            return x(parseDate(d[0]));
          }).y0(height).y1(function (d) {
            return y(d[1]);
          });

          var area2 = d3.area() //mini graph area
          .curve(d3.curveMonotoneX).x(function (d) {
            return x2(parseDate(d[0]));
          }).y0(height2).y1(function (d) {
            return y2(d[1]);
          });

          svg.select("#clip").append("rect").attr("width", width).attr("height", height);

          var focus = d3.select('.focus');
          var shift = parseInt(height) + parseInt(height2) + parseInt(height2) / 2;

          var context = svg.append("g").attr("class", "context").attr("transform", "translate(" + margin2.left + "," + shift + ")"); //10 px buffer

          x.domain(d3.extent(keys, function (d) {
            return parseDate(d);
          }));
          y.domain(d3.extent(numbersOnly, function (d) {
            return +d;
          }));
          x2.domain(x.domain());
          y2.domain(y.domain());

          focus.append("path").datum(dataStoreFinal).attr("class", "area").attr("d", area).attr("transform", "translate(" + graphLeftMargin + "," + 0 + ")");

          focus.append("g").attr("class", "axis axis--x").attr("transform", "translate(" + graphLeftMargin + "," + height + ")").call(xAxis);

          focus.append("g").attr("class", "axis axis--y").attr("transform", "translate(" + graphLeftMargin + "," + 0 + ")").call(yAxis);

          context.append("path").datum(dataStoreFinal).attr("class", "areaContex").attr("d", area2);

          context.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + height2 + ")").call(xAxis2);

          context.append("g").attr("class", "brush").call(brush).call(brush.move, x.range());

          focus.append('text').attr("class", "graphTitleText").attr("x", graphWidth / 2 - margin.left - margin.right).attr("y", selectButtonHeight + 4).style("font-size", "2vw").style("font-family", "Helvetica Neue").style("font-weight", "bold").text(nameKey[0][dataSelect] + "-" + getKey(prevCountry.id, 0, true));
        };

        var dataSelecter = d3.select(".dataSelecter");

        dataSelecter.selectAll('rect') //creates data type buttons
        .data(["perCapitaFoodSupply.csv", "undernourishment.csv", "poverty.csv"]).enter().append('rect').attr("class", "attributeButtons").attr("x", function (d, i) {
          return i * (graphWidth - margin.left - margin.right) / 4 + margin.left;
        }).attr("y", 5).attr("width", (graphWidth - margin.left - margin.right) / 5).attr("height", selectButtonHeight).style("fill", "#67697C").on("click", function (d) {
          dataSelect = d;
          drawBars(prevCountry.id, parsed);
        });

        dataSelecter.selectAll('text') //adds text to data type buttons
        .data(["Food Supply", "Undernourishment", "Poverty"]).enter().append('text').attr("class", "attributeButtonLabels").attr("text-anchor", "middle").attr("x", function (d, i) {
          return i * (graphWidth - margin.left - margin.right) / 4 + margin.left + (graphWidth - margin.left - margin.right) / 10;
        }).attr("y", selectButtonHeight / 1.4 + 5).style("stroke", "white").style("fill", "white").style("pointer-events", "none").text(function (d) {
          return d;
        });
      } catch (err) {
        console.log(err);
        break;
      }
    }
  };

  function drawLines(countryID) {
    //draws paths to countries
    countryCounter = 0; //reset

    var selectedCountry = dataSet[getKey(countryID, 0, true)]; //gets country object that contains the data

    selectedCenter = path.centroid(selectedCountryObject);

    countries.selectAll("path").filter(function (d) {
      var currentCountryRefugees = dataSet[0][getKey(countryID, 0, true)][getKey(d.id, 0, true)];

      if (typeof currentCountryRefugees == "undefined" || currentCountryRefugees == 0) {
        //filters out countries that no refugees from seectedCountry have gone to
        return false;
      }

      countryCounter++;
      return true;
    }).each(function (d, i) {
      //loops through every country
      var gdpValue = 0;
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

      var gdp = parsed.findIndex(function (item) {
        return item.key == getKey(d.id, 0, true).toUpperCase();
      });
      var gdpScaledValue = 0;

      if (gdp != -1) {
        //if there is data on the country's gdp
        try {
          gdpValue = parsed[gdp]["gdpPerCap.csv"]["values"][0][year];
        } catch (err) {
          console.log("No data on: " + parsed[gdp].key);
        }
        gdpScaledValue = gdpScale(gdpValue);
      }

      d3.select(this).style("fill", d3.rgb(gdpScaledValue / 2, gdpScaledValue / 4, gdpScaledValue));

      svg.append("line") //adds refugee lines
      .attr("class", "countryLines").attr("x1", center[0][0]).attr("x2", selectedCenter[0]).attr("y1", center[0][1]).attr("y2", selectedCenter[1]).style("stroke", "black").style("stroke-width", 1).style("opacity", 0.30).style("pointer-events", "none");

      movingCircles.append("circle") //adds refugee circles
      .attr("id", "p" + Math.random()).datum(center).attr("cx", selectedCenter[0]).attr("cy", selectedCenter[1]).attr("r", 1).style("fill", d3.hsl(colorScale(size), 0.8, 0.5)).on("mouseover", function (d) {
        var coor = d3.mouse(this);
        var setText = Math.round(mainScale.invert(d[1])) + " - " + d[2];

        var text = movingCircles.append('text').attr("x", d[0][0]).attr("y", d[0][1]).style("pointer-events", "none").text(setText);

        var bbox = text.node().getBBox();

        movingCircles.append('rect').attr("x", d[0][0]).attr("y", d[0][1] - 16).attr("height", 20).attr("width", 1.5 * bbox.width).style("fill", "white").style("pointer-events", "none").style("fill", "black").attr("rx", 20).attr("ry", 20);

        var text = movingCircles.append('text').attr("x", d[0][0] + 0.3 * bbox.width).attr("y", d[0][1]).style("pointer-events", "none").text(setText).style("fill", "white");
      }).on("mouseout", function (d) {
        movingCircles.selectAll('text').remove();
        movingCircles.selectAll('rect').remove();
      });
    });
  }
}