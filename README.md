# RefuD3 - A Refugee Migration Map in D3
This map is meant to visualize refugee data from the UN Refugee Agency between the years of 1975 and 2013 in a fun a visually pleasing manner. The application was built using Mike Bostock’s d3.js library, served as an html webpage and styled exclusively with CSS .

## Getting Started
Download or clone the repo to your machine. All libraries used have been included to src tags.

### Prerequisites
If you plan on using your local machine, you’ll need a server client. I recommend using http-server:

```
npm install http-server -g
```

Once installed, open the project folder and start your local server:

```
http-server -p portNumber
```
Open your web browser and navigate to:

```
http://localhost/portNumber
```

The map should load in your browser window. This application runs best on the Firefox and Chrome browsers, though it officially supports:
Firefox v54.0.1
Chrome v59.0.3
Safari v10.1.1

## Using RefuD3
The user selects a year via the sidebar on the top of the page, and then selects a country, either by clicking on the country itself or using one of the buttons in the sidebar. Current Primero countries are highlighted in red, and are shown in the sidebar. The selected country is highlighted in purple, and the countries to which the selected country sent refugees in the displayed year are highlighted as well, according to their GDP per capita (the lighter a country is, the higher it's gdp per capita is in that year). Circles also move from the selected country to the countries of residence. The radius of each circle is proportional to the number of refugees the country of residence received from the selected country (scaled logarythmically). The color of the circles is also related to the number of refugees, with smaller circles being lighter and bluer, and larger circles being brighter and more purple. 
Mousing over a circle displays the exact number of UN sanctioned refugees. If a Primero country is selected, a time-series graph appears at the bottom of the page. The graph defaults to undernourishment data, but the user can choose between displaying values for percentage of the population that is undernourished (according to the UN definition), the percentage of the population that lives below the poverty line (according to UN calculations), and the available food supply (in kilocalories per person). The user can then use the smaller graph found below to zoom in on sections of the data by resizing and dragging the gray box along the x axis.

## Built With
* [D3.js](https://github.com/d3/d3)
* [D3GeoProjections](https://github.com/d3/d3-geo-projection)
* [TopoJSON](https://github.com/topojson/topojson) 

## Contributing
Data used in this program was sourced from the [United Nations High Commissioner for Refugees](http://www.unhcr.org/) and the [The Humanitarian Data Exchange](https://data.humdata.org/).

* **Isaac Robinson** - *Quoin Inc Intern* 
