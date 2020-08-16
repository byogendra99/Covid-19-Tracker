import React from 'react';
import './App.css';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core'
import { useState, useEffect } from 'react';
import InfoBox from './Components/InfoBox';
import Map from './Components/Map';
import Table from './Components/Table';
import Graph from './Components/Graph';
import { sortData, prettyPrintStat } from './util';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);


  useEffect(() => {
    const getAllData = async () => {
      await fetch("https://disease.sh/v3/covid-19/all")
        .then(response => response.json())
        .then(data => {
          setCountryInfo(data);
        });
    }
    getAllData();
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        })
        .catch(error => console.log(error));
    }
    getCountriesData();
  }, []);

  const handleDropdownChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        setCountry(countryCode);
        setCountryInfo(data);
      })
  }

  return (
    <div className="App">
      <div className="appLeft">
        <div className="appHeader">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="appDropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={handleDropdownChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, index) =>
                <MenuItem key={index} value={country.value}>{country.name}</MenuItem>
              )}
            </Select>
          </FormControl>
        </div>

        <div className="appInfoBox">
          <InfoBox
            isRed
            onClick={(e) => setCasesType("cases")}
            active={casesType === "cases"}
            title="Confirmed"
            casesToday={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)} />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
            title="Recovered"
            casesToday={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)} />
          <InfoBox
            isRed
            onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            title="Deaths"
            casesToday={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)} />
        </div>

        <Map countries={mapCountries} casesTypes={casesType} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="appRight">
        <CardContent>
          <div className="appRightSidebar">
            <h3>Cases by Country</h3>
            <Table countries={tableData} />
            <br />
            <hr />
            <h3>Daily Change</h3>
            <Graph className="appGraph" casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
