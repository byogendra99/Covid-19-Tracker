import React from 'react';
import './App.css';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core'
import { useState, useEffect } from 'react';
import InfoBox from './Components/InfoBox';
import Map from './Components/Map';
import Table from './Components/Table';
import Graph from './Components/Graph';
import { sortData, prettyPrintStat, searchTable, prettyPrintStat2 } from './util';
import "leaflet/dist/leaflet.css";
import PhoneIcon from '@material-ui/icons/Phone';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
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
              value: country.countryInfo.iso2,
              flag: country.countryInfo.flag
            }
          ));
          const sortedData = sortData(data);
          setData(sortedData);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        })
        .catch(error => console.log(error));
    }
    getCountriesData();
  }, []);

  const handleDropdownChange = async (event) => {
    event.preventDefault();
    const countryCode = event.target.value;

    if (countryCode === "") {
      return;
    }

    const url = countryCode === "worldwide"
      ? 'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        countryCode === "worldwide" ? setMapCenter({ lat: 34.80746, lng: -40.4796 }) : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === "worldwide" ? setMapZoom(2) : setMapZoom(4);
        setCountry(countryCode);
        setCountryInfo(data);
      })
  }

  const onChangeInput = e => {
    e.preventDefault();
    let str = e.target.value;
    let newTableData = searchTable(str, data);
    console.log(newTableData);
    setTableData(newTableData);
  }

  // const onChangeDropdownInput = e => {
  //   e.preventDefault();
  //   let input = e.target.value;
  //   let newData = searchTable(input, data);
  //   newData = newData.map(country => {
  //     return { name: country, value: country.countryInfo.iso2, flag: country.countryInfo.flag }
  //   });
  //   setCountries(newData);
  // }

  return (
    <div>
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
                  <MenuItem key={index} value={country.value}>{country.name}<img src={country.flag} alt={country} height="12" width="15" style={{ borderRadius: "3px", marginLeft: "5px" }} /></MenuItem>
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
              total={prettyPrintStat2(countryInfo.cases)} />
            <InfoBox
              onClick={(e) => setCasesType("recovered")}
              active={casesType === "recovered"}
              title="Recovered"
              casesToday={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat2(countryInfo.recovered)} />
            <InfoBox
              isRed
              onClick={(e) => setCasesType("deaths")}
              active={casesType === "deaths"}
              title="Deaths"
              casesToday={prettyPrintStat(countryInfo.todayDeaths)}
              total={prettyPrintStat2(countryInfo.deaths)} />
          </div>

          <Map countries={mapCountries} casesTypes={casesType} center={mapCenter} zoom={mapZoom} />
        </div>
        <Card className="appRight">
          <CardContent>
            <div className="appRightSidebar">
              <h3>Cases by Country</h3>
              <input type="text" className="searchInput" onChange={(e) => onChangeInput(e)} placeholder="Search..." title="Type in a name"></input>
              <Table countries={tableData} />
              <br />
              <hr />
              <h3>Total Cases Globally</h3>
              <Graph className="appGraph" casesType={casesType} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="footer">
        <p>Author: Yogendra Baral
        <br />
          <PhoneIcon style={{ fontSize: 10 }} /> +1 347-651-5368
        <br />
        @ yogendrabaral1@gmail.com</p>
      </div>
    </div>
  );
}

export default App;
